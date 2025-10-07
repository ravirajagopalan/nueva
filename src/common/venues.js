import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { apihost, compareLastUpdated, getNumberFromString, getVenueImage, venueToSlug } from '../utility/helperFunctions'

const SearchBanner = dynamic(() => import('../components/SearchBanner'))
const ItemPerformers = dynamic(() => import('../components/ItemPerformers'))
const EventsWrapper = dynamic(() => import('../components/EventsWrapper'))
const SearchInput = dynamic(() => import('../components/common/SearchInput'))
const GridWrapper = dynamic(() => import('../components/GridWrapper'))
const RenderIntro = dynamic(() => import('../components/RenderIntro'))
const RenderFaq = dynamic(() => import('../components/RenderFaq'))
const QABox = dynamic(() => import('../components/QABox'))
const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false })

import isEmpty from 'lodash/isEmpty'
import slugify from 'slugify'

import { revalidateTag } from 'next/cache'
import { ItemVenueService, TypesenseService } from 'tn-events-service'
import { FormatTicketPriceWithCommas, isEventStale, isVenueEventsUpToDate, structuredDataGenerator } from '../utility/helperFunctions'
import { WLog } from '../utility/Logger'

async function resolveVenueIdFromParams(venue, slugIdResolver) {
    // TN USES HEADERLIST
    const headersList = headers()

    let venue_id = -1

    if (slugIdResolver) {
        try {
            // default case
            venue_id = getNumberFromString(venue)
        } catch (e) {}
    }

    // Supports results-general page
    if (headersList.has('ms-venue-id')) {
        let msVenueId = headersList.get('ms-venue-id')
        if (msVenueId) {
            try {
                venue_id = parseInt(msVenueId)
            } catch (e) {
                WLog.warn(`Failed to parse ms-venue-id: ${msVenueId}`, 'Venues')
            }
        }
    }

    if (venue_id === -1) {
        let deSlug = venue.replace('-tickets', '')
        deSlug = deSlug.replace(/-/g, ' ')
        const retVenues = await ItemVenueService.suggest(deSlug)
        if (retVenues.length > 0) {
            venue_id = retVenues[0].id
            return venue_id
        } else {
            notFound()
        }
    }
    return venue_id
}

async function getVenueInfo(venue, slugIdResolver, tag) {
    const venue_id = await resolveVenueIdFromParams(venue, slugIdResolver)
    const venueInfo = await ItemVenueService.findByIdDetail(venue_id, tag)
    if (!venueInfo) {
        notFound()
    }

    return venueInfo
}

export async function generateVenueMetadata(
    venue,
    currentDomain,
    getTitle,
    getDescription,
    dynamicTitleExperiment = null,
    metaConfig,
    setUrl,
    slugIdResolver = true,
) {
    const venueInfo = await getVenueInfo(venue, slugIdResolver)
    let meta = {
        title: getTitle(venueInfo.detail),
        description: getDescription(venueInfo.detail),
    }

    if (dynamicTitleExperiment) {
        meta.title = dynamicTitleExperiment(venue, venueInfo)
        if (metaConfig.titleYear) {
            meta.title += ' ' + metaConfig.titleYear
        }
    }

    let venue_name = venueInfo.detail.venue_name.toLowerCase()
    let url = `${currentDomain}/venues/${venueToSlug(venueInfo.detail)}`
    let canonical = `${currentDomain}/venues/${venueToSlug(venueInfo.detail)}`
    if (setUrl) {
        const { _url, _canonical } = setUrl(venue_name)
        url = _url
        canonical = _canonical
    }

    return {
        metadataBase: new URL(url),
        title: meta.title,
        description: meta.description,
        openGraph: {
            title: meta.title,
            description: meta.description,
            url: url,
        },
        alternates: {
            canonical: canonical,
        },
    }
}

/**
 * Fetches all events for a venue using pagination, including current, next, and future years, and returns the most recent event's date and time for a performer
 * @param {number} venue_id - The venue ID
 * @param {string} tag - The cache tag
 * @param {number} performerId - The performer ID to filter
 * @returns {Promise<{date: string, time: string} | null>} - The most recent event's date and time for the performer, or null if not found
 */
async function getLatestEventDateTimeForPerformer(events, venue_id, tag, performerId) {
    // First, check if performerId is present in the provided events array
    if (Array.isArray(events) && events.length > 0) {
        const matchedEvent = events.find(
            (event) => event.detail && Array.isArray(event.detail.performer_ids) && event.detail.performer_ids.includes(performerId) && event.date,
        )
        if (matchedEvent) {
            return { date: matchedEvent.date, time: matchedEvent.time }
        }
    }

    // If not found, proceed to fetch paginated events
    const perPage = 100
    let page = 1
    let hasMore = true
    tag = tag + `-performer-${performerId}-nearest-event`

    while (hasMore) {
        const eventsPage = await ItemVenueService.findEventsByIdDetailed(venue_id, perPage, page, tag)

        if (eventsPage && eventsPage.length > 0) {
            const matchedEvent = eventsPage.find(
                (event) =>
                    event.detail && Array.isArray(event.detail.performer_ids) && event.detail.performer_ids.includes(performerId) && event.date,
            )
            if (matchedEvent) {
                return { date: matchedEvent.date, time: matchedEvent.time }
            }
            if (eventsPage.length < perPage) {
                hasMore = false
            } else {
                page++
            }
        } else {
            hasMore = false
        }
    }

    return null
}

export default async function Venues({
    slugIdResolver = true,
    venue,
    currentDomain,
    dynamicTitleExperiment,
    _SearchBanner,
    _ItemPerformers,
    _ItemEvents,
    _VenuePerformerItems,
    _SeatingChartList,
    _Intro,
    _Faq,
    _SideContent,
    _customContentCollection,
    _customAIContentCollection = 'FCVenueContent',
    _CategoryListSection,
    showMapComponent = false,
    marketingKeywords,
}) {
    const venue_id = await resolveVenueIdFromParams(venue, slugIdResolver)
    const perPage = 20
    const eventGetUrl = `${apihost.honolulu}/ItemVenues/${venue_id}/eventsDetailed?perPage=${perPage}`

    let venueDetailTag = `venue-detail-${venue_id}`
    let tag = `venue-${venue_id}`
    // const venueContentTag = `venue-content-${venue_id}`
    const [venueInfo, events, performers, resContent] = await Promise.all([
        ItemVenueService.findByIdDetail(venue_id, tag),
        ItemVenueService.findEventsByIdDetailed(venue_id, perPage, 1, tag),
        ItemVenueService.findPerformers(venue_id),
        // TODO: Add venueContentTag into call below
        ItemVenueService.findContentById(venue_id, _customContentCollection),
    ])
    if (!venueInfo) {
        notFound()
    }

    if (events.length == 0 && performers.length == 0) {
        notFound() // 404 if request fails
    }

    // TODO: Import compareLastUpdated from helperFunctions when this activated
    // // CASE 1 - ResContent has no intro, faq, priceFaq or is outdated
    // if (resContent && isEmpty(resContent?.intro) && isEmpty(resContent?.faq) && isEmpty(resContent?.priceFaq) && !resContent) {
    //     WLog.warn(`Revalidation due to no Content`, 'Venues', { resContent: resContent })
    //     revalidateTag(venueContentTag)
    // } else if (resContent && compareLastUpdated(resContent.lastUpdated, -4)) {
    //     WLog.warn(`Revalidation due to content is outdated`, 'Venues', { resContent: resContent })
    //     revalidateTag(venueContentTag)
    // }

    // CASE 2 - 404 force revalidate so new added performer will be shown
    if (events.length === 0 && performers.length === 0) {
        WLog.warn(`Revalidation due to no Events`, 'Venues')
        revalidateTag(tag)
    }

    // Checks for outdated events in All Events
    if (events && events.length > 0) {
        try {
            const event = events[0]
            if (isEventStale(event)) {
                WLog.warn('Page has stale data', 'Venues', {
                    venueId: venue_id,
                    localtimestamp: event.detail.event_local_timestamp,
                    date: `${event.date}, ${event.time}`,
                    timeoffset: event.detail.venue_time_zone_offset,
                })
                revalidateTag(tag)
            }
        } catch (error) {
            WLog.error('Failed localtime vs UTC comparison', 'Venues', {
                venueId: venue_id,
                event: events[0],
                error,
            })
        }
    }

    // CASE 3 - Performer lastUpdated is outdated
    if (venueInfo) {
        try {
            if (isVenueEventsUpToDate(venueInfo)) {
                WLog.warn(`Revalidation on Events due to Venue lastUpdated is outdated`, 'Venues', {
                    venueInfo,
                })
                revalidateTag(tag)
            }
            if (isVenueEventsUpToDate(venueInfo)) {
                WLog.warn(`Revalidation on Venue Detail due to venue lastUpdated is outdated`, 'Venues', {
                    venueInfo,
                })
                revalidateTag(venueDetailTag)
            }
        } catch (err) {
            WLog.error(`Failed comparing lastUpdated with UTC`, 'Venues', { venueId: venue_id, error: err })
        }
    }

    // Add venue info and latest event info to performers
    for (const performer of performers) {
        performer.venue_city = venueInfo.detail.venue_city
        performer.venue_id = venueInfo.detail.venue_id
        performer.venue_name = venueInfo.detail.venue_name
        performer.venue_state_province_short = venueInfo.detail.venue_state
        // Use helper function to get most recent event's date and time for this performer
        const latestEventDateTime = await getLatestEventDateTimeForPerformer(events, venue_id, tag, performer.id)
        if (latestEventDateTime) {
            performer.date = latestEventDateTime.date
            performer.time = latestEventDateTime.time
        }
    }

    let faq = []
    let priceFaq = []
    let intro = ''
    if (resContent) {
        faq = !resContent.faq ? [] : resContent.faq
        priceFaq = !resContent.priceFaq ? [] : resContent.priceFaq
        intro = !resContent.intro ? '' : resContent.intro
    }

    const venDetail = venueInfo.detail
    let venueTitle = ''
    if (dynamicTitleExperiment) {
        venueTitle = dynamicTitleExperiment(venue, venueInfo)
    }

    let AIDataQA = []
    let AIDataContent = ''

    async function fetchAIData(keyword, venueInfo) {
        const { venue_city, venue_state_long, venue_name } = venueInfo.detail

        if (keyword === `${venue_city} ${venue_state_long}`) {
            keyword = 'City State'
        } else if (keyword === venue_city) {
            keyword = 'City'
        }

        try {
            const contentTag = `venue-content-${venue_id}-${keyword}`
            const query_by = 'venue_name,keyword'
            const q = `${venue_name.replace('Las Vegas', '')}, ${keyword}`
            const filter_by = `venue_name:="${venue_name}"`

            const queryArg = {
                q: q,
                query_by: query_by,
                filter_by: filter_by,
            }

            const AIDataResponse = await TypesenseService.typesenseSearch(_customAIContentCollection, queryArg, contentTag)

            if (!AIDataResponse?.hits?.length) {
                return { AIDataQA: [], AIDataContent: '', keyword: '' }
            }

            const hit = AIDataResponse.hits[0]
            const AIDataQA = hit.document?.qna || []
            const AIDataContent = hit.document?.content || ''

            if (!AIDataQA?.length || !AIDataContent) {
                return { AIDataQA: [], AIDataContent: '', keyword: '' }
            }

            if (keyword === 'City State' || keyword === 'City') {
                keyword = venue_city
            }

            return { AIDataQA, AIDataContent, keyword }
        } catch (error) {
            WLog.error('Failed fetching keyword data', 'Venues', {
                venue_name,
                keyword,
                error,
            })
            return { AIDataQA: [], AIDataContent: '', keyword: '' }
        }
    }

    function getKeywordFromSlug(fullSlug, marketingKeywords) {
        if (!fullSlug || !marketingKeywords) return ''
        let normalizedFullSlug = fullSlug.replace(/-/g, ' ').trim()

        const matchingKeywordInDeSlug = marketingKeywords.find((keyword) => normalizedFullSlug.toLowerCase().includes(keyword.toLowerCase()))
        if (matchingKeywordInDeSlug) {
            return matchingKeywordInDeSlug
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
        }
        return ''
    }

    const city_state = `${venDetail.venue_city} ${venDetail.venue_state_long}`
    marketingKeywords?.push(city_state, venDetail.venue_state_long, venDetail.venue_city)

    const venueSlug = slugify(venDetail.venue_name).toLowerCase()
    const normalizedFullSlug = venue.toLowerCase()
    const onlyKeywordFromSlug = normalizedFullSlug.replace(venueSlug + '-', '')

    let keyword = getKeywordFromSlug(onlyKeywordFromSlug, marketingKeywords)

    const venueImage = await getVenueImage(venDetail)

    if (keyword) {
        const result = await fetchAIData(keyword, venueInfo)
        AIDataQA = result.AIDataQA
        AIDataContent = result.AIDataContent
        keyword = result.keyword
    }

    // no picture or image for the venue
    const structuredData = structuredDataGenerator(events, '', '', venDetail, currentDomain, 'venue')

    let performerDict = [{}]
    let sportsEvents = []
    let concertEvents = []
    let theaterEvents = []
    let performersList = []

    for (const event of events) {
        try {
            // categorize events for TN
            if (_CategoryListSection && event.detail) {
                try {
                    if (event.detail.parent_category === 'Sports') {
                        sportsEvents.push(event)
                    } else if (event.detail.parent_category === 'Concerts') {
                        concertEvents.push(event)
                    } else if (event.detail.parent_category === 'Theater') {
                        theaterEvents.push(event)
                    }
                    for (const performer of event.detail.performers)
                        if (!(performer.performer_id in performerDict)) {
                            performerDict[performer.performer_id] = 1
                            if (event.detail.venue_country_short === 'US') {
                                performersList.push({
                                    performer_id: performer.performer_id,
                                    performer_name: performer.performer_name,
                                    average_ticket_price:
                                        Math.floor(event.detail.average_ticket_price) !== 0
                                            ? FormatTicketPriceWithCommas(event.detail.average_ticket_price)
                                            : '-',
                                })
                            }
                        }
                } catch (e) {
                    console.log(e)
                }
            }
        } catch (e) {
            WLog.error('Failed on preparing snippet data', 'Venues', {
                venueId: venue_id,
                error: e,
            })
        }
    }

    //CATEGORY EVENT LIST
    const categoryEventsList = []
    if (_CategoryListSection) {
        if (concertEvents.length > 0) {
            categoryEventsList.push({
                name: `Concerts`,
                list: concertEvents.slice(0, 5),
            })
        } else if (sportsEvents.length > 0) {
            categoryEventsList.push({
                name: `Sports`,
                list: sportsEvents.slice(0, 5),
            })
        } else if (theaterEvents.length > 0) {
            categoryEventsList.push({
                name: `Theater`,
                list: theaterEvents.slice(0, 5),
            })
        }
    }

    const venueLat = venueInfo.detail.venue_latitude
    const venueLong = venueInfo.detail.venue_longitude
    let fullAddress
    async function getFullAddress(latitude, longitude) {
        try {
            if (!latitude || !longitude) return
            const tag = `address_${latitude}_${longitude}`
            const requestOptions = {
                next: {
                    revalidate: 60 * 60 * 24 * 365, // 1 year in seconds
                    tags: [tag],
                },
            }

            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, requestOptions)

            if (!response.ok) {
                throw new Error(`Error fetching address: ${response.statusText}`)
            }

            const data = await response.json()
            const address = data.display_name
            return address
        } catch (error) {
            console.error('Error fetching address:', error)
            return null
        }
    }
    if (showMapComponent) fullAddress = await getFullAddress(venueLat, venueLong)

    return (
        <>
            {_SearchBanner ? (
                <_SearchBanner
                    venueId={venue_id}
                    venueName={`${venDetail.venue_name} Seating Charts &`}
                    venueTitle={venueTitle}
                    location={venueInfo.address}
                    title={`${venDetail.venue_name} Tickets`}
                    subTitle={`${venDetail.venue_city}, ${venDetail.venue_state_long}`}
                    SearchInput={SearchInput}
                    keyword={keyword}
                    charts={!isEmpty(venueInfo.detail?.seating_chart_images)}
                    venueImage={venueImage}
                />
            ) : (
                <SearchBanner
                    title={`${venDetail.venue_name} Tickets`}
                    subTitle={`${venDetail.venue_city}, ${venDetail.venue_state_long}`}
                    SearchInput={SearchInput}
                />
            )}

            {!isEmpty(performers) &&
                (_ItemPerformers === null ? (
                    ' '
                ) : _ItemPerformers ? (
                    <_ItemPerformers performers={performers} atVenue={true} showEventsCount={false} title={`${venDetail.venue_name} Performers`} />
                ) : (
                    <div className='mt-4'>
                        <ItemPerformers performers={performers} atVenue={true} showEventsCount={false} title={`${venDetail.venue_name} Performers`} />
                    </div>
                ))}
            {keyword && <QABox data={AIDataQA} />}
            <GridWrapper layoutType={_SideContent ? 'two-columns' : 'one-column'}>
                <div>
                    {_ItemEvents ? (
                        <_ItemEvents
                            events={events}
                            title={`${venDetail.venue_name} Events`}
                            hasLoadMore
                            loadMoreUrl={eventGetUrl}
                            structuredData={structuredData}
                        />
                    ) : (
                        <EventsWrapper
                            events={events}
                            title={`${venDetail.venue_name} Events`}
                            hasLoadMore
                            loadMoreUrl={eventGetUrl}
                            structuredData={structuredData}
                        />
                    )}
                </div>
                {_SideContent && (
                    <_SideContent
                        performerImage={`https://ticketnetwork.s3.amazonaws.com/auto-resized/responsive-images/venue/${venue_id}/${venue_id}-600x300.jpg`}
                    />
                )}
            </GridWrapper>
            {keyword && (
                <RenderIntro
                    CustomComponent={_Intro}
                    intro={AIDataContent}
                    venDetail={venDetail}
                    title={`${venDetail.venue_name} ${keyword}`}
                    id={'keyword'}
                />
            )}
            {fullAddress && showMapComponent && (
                <div>
                    <MapComponent latitude={venueLat} longitude={venueLong} venueName={venDetail.venue_name} fullAddress={fullAddress} />
                </div>
            )}

            {!isEmpty(intro) && _Intro !== null && <RenderIntro CustomComponent={_Intro} intro={intro} venDetail={venDetail} />}
            {(!isEmpty(faq) || !isEmpty(priceFaq)) && _Faq !== null && (
                <RenderFaq CustomComponent={_Faq} venDetail={venDetail} faq={faq} priceFaq={priceFaq} />
            )}

            {venueTitle.includes('Seating') && _CategoryListSection && (
                <_CategoryListSection
                    categoryEventsList={categoryEventsList}
                    venDetail={venDetail}
                    concertEvents={concertEvents}
                    sportsEvents={sportsEvents}
                    theaterEvents={theaterEvents}
                />
            )}
            {!isEmpty(venueInfo.detail?.seating_chart_images) && _SeatingChartList && (
                <_SeatingChartList
                    isOpenChartImage={false}
                    venue_name={venDetail.venue_name}
                    seatingCharts={venueInfo.detail.seating_chart_images.filter(
                        (v) => !v.name.includes('INACTIVE') && !v.name.includes('DO-NOT-USE') && v.image_url.includes('.webp'),
                    )}
                />
            )}
            {!isEmpty(performersList) && (
                <_VenuePerformerItems venueId={venue_id} performers={performersList} title={`${venDetail.venue_name} Performers`} />
            )}
        </>
    )
}
