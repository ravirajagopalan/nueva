import dynamic from 'next/dynamic'
import { notFound, redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import slugify from 'slugify'

const Banner = dynamic(() => import('../components/Banner'))
const EventsWrapper = dynamic(() => import('../components/EventsWrapper')) // a.k.a ItemEvents
const GridWrapper = dynamic(() => import('../components/GridWrapper'))

import { _slugify, apihost, isPerformerEventsUpToDate, FormatTicketPriceWithCommas, structuredDataGenerator, isEventStale, getIdFromInput, compareLastUpdated } from '../utility/helperFunctions'

import PPCCategoryGrandchildView from '../lib/PPCCategoryGrandchildView.json'
import isEmpty from 'lodash/isEmpty'
import startCase from 'lodash/startCase'
import camelCase from 'lodash/camelCase'

import { revalidateTag } from 'next/cache'
import { WLog } from '../utility/Logger'
import { ItemPerformerService } from 'tn-events-service'

async function getVenueAndPerformerDetail(venue, performer, _customImage, redirectUrlService=null) {
    const cookieStore = cookies()
    const headersList = headers()

    let location = cookieStore.get('_location')
    if (!location) {
        location = {
            value: headersList.get('ms-location'),
        }
    }
    const venue_id = getIdFromInput(venue, notFound)
    const performer_id = getIdFromInput(performer, notFound)

    let events = []
    let eventsNearby = []

    const perPage = 20
    const eventGetUrl = `${apihost.honolulu}/ItemPerformers/${performer_id}/eventsDetailed?venueId=${venue_id}&perPage=${perPage}`

    const performerTag = `performer-detail-${performer_id}`
    const performerContentTag = `performer-content-${performer_id}`
    let tag = `performer-${performer_id}`
    const [resPerformer, resEventsResult] = await Promise.all([
        ItemPerformerService.findByIdDetail(performer_id, _customImage, performerTag),
        ItemPerformerService.findEventsDetailed(performer_id, location.latitude, location.longitude, venue_id, perPage, 1, tag),
    ])

    let performer_name = ''
    let performer_image = ''
    let performer_detail = null

    // the performer object
    if (!resPerformer) {
        const webPerformersRes = await ItemPerformerService.findAllById(performer_id)
        if (!webPerformersRes) {
            notFound()
        }
        performer_name = webPerformersRes.name
        performer_image = webPerformersRes.pathPicture
        performer_detail = webPerformersRes.detail
    } else {
        performer_name = resPerformer.name
        performer_image = resPerformer.pathPicture
        performer_detail = resPerformer.detail
    }

    for (const result of resEventsResult) {
        if (result.name === 'All Events') {
            events = result.results
        } else if (result.name === 'Events Nearby') {
            eventsNearby = result.results
        }
    }

    if (eventsNearby.length == 0) {
        if (redirectUrlService) {
            redirectUrlService(performer_id, performer_name)
        } else {
            redirect(`/performers/${_slugify(performer_id, performer_name)}`)
        }
    }

    let firstEventDetail = eventsNearby[0].detail
    let venue_detail = {
        venue_id: venue_id,
        venue_name: firstEventDetail.venue_name,
        venue_city: firstEventDetail.venue_city,
        venue_state_province_short: firstEventDetail.venue_state_province_short,
    }

    performer_detail.venue_id = venue_detail.venue_id
    performer_detail.venue_name = venue_detail.venue_name
    performer_detail.venue_city = venue_detail.venue_city
    performer_detail.venue_state_province_short = venue_detail.venue_state_province_short

    return {
        performer_name,
        detail: performer_detail,
        performer_image,
        eventGetUrl,
        venue_detail,
        events,
        eventsNearby,
        tag,
        performerTag,
        performerContentTag,
    }
}

export async function generatePerformerVenueMetadata(performer, venue, currentDomain, getTitle, getDescription, setUrl, redirectUrlService=null) {
    const res = await getVenueAndPerformerDetail(venue, performer, false, redirectUrlService)
    let meta = {
        title: getTitle(res.detail),
        description: getDescription(res.detail),
    }
    const { performer_name, venue_detail, detail } = res

    const defaultUrl = `${currentDomain}/performers/${_slugify(res.detail.performer_id, res.performer_name)}/venues/${_slugify(
        venue_detail.venue_id,
        venue_detail.venue_city,
        venue_detail.venue_name,
    )}`

    // This gives flexibility to customize own canonical and url
    let url = defaultUrl
    let canonical = defaultUrl

    if (setUrl) {
        const { _url, _canonical } = setUrl(performer_name, detail, venue_detail)
        url = _url
        canonical = _canonical
    }
    return {
        metadataBase: new URL(url),
        title: meta.title,
        openGraph: {
            title: meta.title,
            description: meta.description,
            url: url,
        },
        description: meta.description,
        alternates: {
            canonical: canonical,
        },
    }
}

export default async function VenuePerformer({
    performer,
    venue,
    titleNoCity,
    _BreadCrumbs,
    _Banner,
    _ItemEvents,
    _IntroSection,
    _ItemVenues,
    currentDomain,
    _customContentCollection,
    _customImage = false,
    _SideContent,
    breadCrumbsHome,
    breadCrumbsHasPath,
    redirectUrlService=null
}) {
    const venue_id = getIdFromInput(venue, notFound)
    const performer_id = getIdFromInput(performer, notFound)

    const res = await getVenueAndPerformerDetail(venue, performer, _customImage, redirectUrlService)
    let performer_detail = res.detail
    let { performer_name, performer_image, venue_detail, events, eventsNearby, eventGetUrl, tag, performerTag, performerContentTag } = res

    const breadCrumbs = breadCrumbsHome ? [breadCrumbsHome] : []

    // as naming changes throughout different sites, we need to have a domain config to handle the naming of breadcrumbs
    const nameConfig = (performer_name, venue_detail) => {
        let name = `${performer_name} ${venue_detail.venue_city} - ${venue_detail.venue_name}`
        if (titleNoCity) name = `${performer_name} at ${venue_detail.venue_name}`

        return name
    }
    const titleConfig = (performer_name, venue_detail) => {
        let title = `${startCase(camelCase(performer_name))} In ${venue_detail.venue_city}`
        if (titleNoCity) title = performer_name

        return title
    }

    try {
        const breadCrumbsDict = {
            category: null,
            child: null,
            grandchild: null,
        }
        for (const k in PPCCategoryGrandchildView) {
            if (
                performer_detail.parent &&
                performer_detail.parent !== '-' &&
                !PPCCategoryGrandchildView[k].child &&
                !PPCCategoryGrandchildView[k].granchild
            ) {
                let parentComparison = performer_detail.parent === 'THEATRE' ? 'theater' : performer_detail.parent.toLowerCase()
                if (k === parentComparison) {
                    breadCrumbsDict['category'] = {
                        name: PPCCategoryGrandchildView[k].title,
                        url: `/category/${k}`,
                        path: breadCrumbsHasPath ? PPCCategoryGrandchildView[k].path : '',
                    }
                }
            }
            if (performer_detail.child && performer_detail.child !== '-' && !PPCCategoryGrandchildView[k].granchild) {
                if (PPCCategoryGrandchildView[k].child.toLowerCase() === performer_detail.child.toLowerCase()) {
                    let parentComparison = performer_detail.parent === 'THEATRE' ? 'theater' : performer_detail.parent.toLowerCase()
                    if (parentComparison === PPCCategoryGrandchildView[k].category.toLowerCase()) {
                        breadCrumbsDict['child'] = {
                            name: PPCCategoryGrandchildView[k].title,
                            url: `/category/${k}`,
                            path: breadCrumbsHasPath ? PPCCategoryGrandchildView[k].path : '',
                        }
                    }
                }
            }
            if (performer_detail.grandchild && performer_detail.grandchild !== '-') {
                let grandChildComparison = performer_detail.grandchild.split('Professional (').pop().split(')')[0].toLowerCase()
                let parentComparison = performer_detail.parent === 'THEATRE' ? 'theater' : performer_detail.parent.toLowerCase()
                if (
                    k === grandChildComparison &&
                    PPCCategoryGrandchildView[k].category.toLowerCase() === parentComparison &&
                    PPCCategoryGrandchildView[k].child.toLowerCase() === performer_detail.child.toLowerCase()
                ) {
                    breadCrumbsDict['grandchild'] = {
                        name: PPCCategoryGrandchildView[k].title,
                        url: `/category/${k}`,
                        path: breadCrumbsHasPath ? PPCCategoryGrandchildView[k].path : '',
                    }
                }
            }
        }
        if (breadCrumbsDict['category']) {
            breadCrumbs.push(breadCrumbsDict['category'])
        }
        if (breadCrumbsDict['child']) {
            breadCrumbs.push(breadCrumbsDict['child'])
        }
        if (breadCrumbsDict['grandchild']) {
            breadCrumbs.push(breadCrumbsDict['grandchild'])
        }

        breadCrumbs.push({
            name: performer_name,
            url: `/performers/${_slugify(performer_id, performer_name)}`,
            path: breadCrumbsHasPath ? `/performers/${slugify(`${performer_name.toLowerCase()} tickets`, '-')}` : '',
        })

        breadCrumbs.push({
            name: nameConfig(performer_name, venue_detail),
            url: `/performers/${_slugify(performer_id, performer_name)}/venues/${_slugify(
                venue_id,
                venue_detail.venue_city,
                venue_detail.venue_name,
            )}`,
            path: breadCrumbsHasPath ? `/events2/performer-at-venue?p=${performer_id}&v=${venue_id}` : '',
        })
    } catch (e) {
        console.log(e)
    }

    // Banner Object
    // added performerName, venueName, venueId, _bannerType
    // title is unused in ticketnetwork
    let banner = {
        img: performer_image,
        title: titleConfig(performer_name, venue_detail),
        p_id: performer_id,
        description: `No Buyer Fees ${startCase(camelCase(performer_name))} Tickets - Up to 30% Off Compared to Competitors`,
        performerName: performer_name,
        venueName: venue_detail.venue_name,
        venueId: venue_id,
        venueCity: venue_detail.venue_city,
        venueState: venue_detail.venue_state_province_short,
    }

    let no_performer = events.length == 0

    const structuredDataNearby = structuredDataGenerator(eventsNearby, performer_image, performer_name, performer_detail, currentDomain, '')

    let venueDict = [{}]
    let venues = []

    if (_ItemVenues) {
        for (const event of events) {
            try {
                if (event.detail) {
                    if (!(event.detail.venue_id in venueDict)) {
                        venueDict[event.detail.venue_id] = 1
                        if (event.detail.venue_country_short === 'US') {
                            venues.push({
                                venue_id: event.detail.venue_id,
                                venue_name: event.detail.venue_name,
                                venue_city: event.detail.venue_city,
                                venue_state_province_short: event.detail.venue_state_province_short,
                                performer_id: performer_id,
                                performer_name: performer_name,
                                average_ticket_price:
                                    Math.floor(event.detail.average_ticket_price) !== 0
                                        ? FormatTicketPriceWithCommas(event.detail.average_ticket_price)
                                        : '-',
                            })
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    // CASE 2 - 404 force revalidate so new added performer will be shown
    if (events.length === 0 && eventsNearby.length === 0) {
        WLog.warn('Revalidation due to no Events', 'VenuePerformer', {
            performerId: performer_id,
            venueId: venue_id,
        })
        revalidateTag(tag)
        revalidateTag(`${tag}-${venue_id}`)
    }

    let eventsNeedRevalidation = false
    let eventsNearbyNeedRevalidation = false

    // CASE 1 STARTS
    // Checks for outdated events in All Events
    if (events && events.length > 0) {
        try {
            const event = events[0]
            if (isEventStale(event)) {
                WLog.warn('Page has stale data on events', 'VenuePerformer', {
                    performerId: performer_id,
                    venueId: venue_id,
                    localtimestamp: event.detail.event_local_timestamp,
                    date: `${event.date} , ${event.time}`,
                    timeoffset: event.detail.venue_time_zone_offset,
                })
                eventsNeedRevalidation = true
            }
        } catch (error) {
            WLog.error('Failed localtime v UTC time comparison on events', 'VenuePerformer', { performerId: performer_id, venueId: venue_id, error })
        }
    }

    // Checks for outdated events in Nearby Events
    if (eventsNearby && eventsNearby.length > 0) {
        try {
            const eventNearby = eventsNearby[0]
            if (isEventStale(eventNearby)) {
                WLog.warn('Page has stale data on nearby events', 'VenuePerformer', {
                    performerId: performer_id,
                    venueId: venue_id,
                    localtimestamp: eventNearby.detail.event_local_timestamp,
                    date: `${eventNearby.date} , ${eventNearby.time}`,
                    timeoffset: eventNearby.detail.venue_time_zone_offset,
                })
                eventsNearbyNeedRevalidation = true
            }
        } catch (error) {
            WLog.error('Failed localtime v UTC time comparison on nearby events', 'VenuePerformer', {
                performerId: performer_id,
                venueId: venue_id,
                error,
            })
        }
    }

    if (eventsNeedRevalidation) {
        WLog.warn(`Revalidating events for tag ${tag} ...`, 'VenuePerformer')
        revalidateTag(tag)
    }
    if (eventsNearbyNeedRevalidation) {
        WLog.warn(`Revalidating events nearby for tag ${tag}-${venue_id} ...`, 'VenuePerformer')
        revalidateTag(`${tag}-${venue_id}`)
    }
    // CASE 1 ENDS

    // CASE 3 - Performer lastUpdated is outdated
    if (performer_detail) {
        try {
            if (isPerformerEventsUpToDate(performer_detail)) {
                WLog.warn('Revalidation on Events due to Performer lastUpdated is outdated', 'VenuePerformer', {
                    performerDetail: performer_detail,
                })
                revalidateTag(tag)
                revalidateTag(`${tag}-${venue_id}`)
            }
            if (isPerformerEventsUpToDate(performer_detail)) {
                WLog.warn(`Revalidation on Performer Detail due to performer lastUpdated is outdated`, 'VenuePerformer', {
                    performerDetail: performer_detail,
                })
                revalidateTag(performerTag)
            }
        } catch (err) {
            WLog.error(`Failed comparing lastUpdated with UTC`, 'VenuePerformer', err)
        }
    }

    // prepare intro
    let intro = ''
    if (_IntroSection) {
        try {
            const resContent = await ItemPerformerService.findContentById(performer_id, _customContentCollection, performerContentTag)
            // Case 4- empty or outdated Content
            // check if resContent is null, undefined or empty
            // if (!resContent || isEmpty(resContent?.intro)) {
            //     WLog.warn('Revalidation on contents due to content is null or undefined', 'VenuePerformer', {
            //         resContent: resContent,
            //     })
            //     revalidateTag(performerContentTag)
            // }
            if (resContent) {
                // if (compareLastUpdated(resContent?.updatedDate, -4)) {
                //     WLog.warn('Revalidation on contents due to content updatedDate is outdated', 'VenuePerformer', {
                //         resContent: resContent,
                //     })
                //     revalidateTag(performerContentTag)
                // }

                intro = resContent.intro
            }
        } catch (e) {
            WLog.warn('Failed fetching resContent from ItemPerformerService.findContentById', 'VenuePerformer', {
                performer_id: performer_id,
                venue_id: venue_id,
                error: e,
            })
        }
    }
    return (
        <>
            {!isEmpty(banner) && (_Banner ? <_Banner banner={banner} breadCrumbs={breadCrumbs} /> : <Banner banner={banner} breadCrumbs={breadCrumbs} />)}
            {_BreadCrumbs && breadCrumbs.length > 0 && <_BreadCrumbs paths={breadCrumbs} isOverlay={true} />}

            <GridWrapper layoutType={_SideContent ? 'two-columns' : 'one-column'}>
                <div>
                    {!isEmpty(eventsNearby) && (
                        <div className='my-10'>
                            {_ItemEvents
                                ? !isEmpty(eventsNearby) && (
                                      <_ItemEvents
                                          events={eventsNearby}
                                          title={`${performer_name} Events ${venue_detail.venue_city}, ${venue_detail.venue_state_province_short} - ${venue_detail.venue_name}`}
                                          venueName={venue_detail.venue_name}
                                          structuredData={structuredDataNearby}
                                          type='nearby'
                                          revertTitle={performer_detail?.category === 'concerts'}
                                      />
                                  )
                                : !isEmpty(eventsNearby) && (
                                      <EventsWrapper
                                          events={eventsNearby}
                                          title={`${performer_name} Events ${venue_detail.venue_city}, ${venue_detail.venue_state_province_short} - ${venue_detail.venue_name}`}
                                          structuredData={structuredDataNearby}
                                      />
                                  )}
                        </div>
                    )}

                    {_ItemEvents
                        ? !isEmpty(events) && (
                              <_ItemEvents
                                  events={events}
                                  title={`All ${performer_name} Events`}
                                  hasLoadMore
                                  loadMoreUrl={eventGetUrl}
                                  revertTitle={performer_detail?.category === 'concerts'}
                                  venueName={venue_detail.venue_name}
                              />
                          )
                        : !isEmpty(events) && (
                              <EventsWrapper events={events} title={`All ${performer_name} Events`} hasLoadMore loadMoreUrl={eventGetUrl} />
                          )}
                </div>
                {_SideContent && <_SideContent performerImage={performer_image} />}
            </GridWrapper>

            {_IntroSection && !isEmpty(intro) && <_IntroSection performer_name={performer_name} intro={intro} />}
            {_ItemVenues && !isEmpty(venues) && <_ItemVenues title={`${performer_name} by City`} venuePerformers={venues} />}
            {no_performer && (
                <>
                    <div className='py-10 bg-white'>
                        <div className='mx-4 max-w-7xl sm:mx-10'>
                            <h1 className='text-xl font-semibold'>{performer_name}</h1>
                            <span className='text-sm'>No Events Available</span>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
