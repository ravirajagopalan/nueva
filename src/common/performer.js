import camelCase from 'lodash/camelCase'
import { revalidateTag } from 'next/cache'
import dynamic from 'next/dynamic'
import { cookies, headers } from 'next/headers'
import { notFound } from 'next/navigation'

const Banner = dynamic(() => import('../components/Banner'))
const EventsWrapper = dynamic(() => import('../components/EventsWrapper')) // a.k.a ItemEvents
const GeoLocation = dynamic(() => import('../components/GeoLocation'))
const Venues = dynamic(() => import('../components/Venues')) // a.k.a ItemVenuePerformers
const NoEvents = dynamic(() => import('../components/NoEvents'))

import isEmpty from 'lodash/isEmpty'
import startCase from 'lodash/startCase'

import { ItemPerformerService } from 'tn-events-service'
import GridWrapper from '../components/GridWrapper'
import PPCCategoryGrandchildView from '../lib/PPCCategoryGrandchildView.json'
import { WLog } from '../utility/Logger'
import {
    FormatTicketPriceWithCommas,
    _slugify,
    apihost,
    defaultLocation,
    getNumberFromString,
    hamiltonPerformerId,
    isEventStale,
    isPerformerEventsUpToDate,
    resolvePerformerId,
    structuredDataGenerator,
    testPerformerId,
} from '../utility/helperFunctions'

async function getPerformerDetail(id, _customImage, tag) {
    let res = await ItemPerformerService.findByIdDetail(id, _customImage, tag)
    if (!res) {
        res = await ItemPerformerService.findAllById(id, _customImage, tag)
    }
    return res
}

export async function generatePerformerMetadata(performer, currentDomain, getTitle, getDescription, setUrl, slugIdResolver = true) {
    const headersList = headers()
    let performer_id = -1
    let performer_detail = null

    if (slugIdResolver) {
        try {
            performer_id = getNumberFromString(performer)
        } catch (e) { }
    }

    // Supports results-general page
    if (headersList.has('ms-performer-id')) {
        let msPerformerId = headersList.get('ms-performer-id')
        if (msPerformerId) {
            try {
                performer_id = parseInt(msPerformerId)
            } catch (e) {
                WLog.warn(`Failed to parse ms-performer-id: ${msPerformerId}`, 'Performers')
            }
        }
    }

    if (performer_id === -1) {
        let deSlug = performer.replace('-tickets', '')
        deSlug = deSlug.replace(/-/g, ' ')
        if (deSlug === 't pain') {
            deSlug = 't-pain'
        }
        if (deSlug === 'trans siberian orchestra') {
            deSlug = 'trans-siberian orchestra'
        }
        const retPerformers = await ItemPerformerService.suggest(deSlug)
        if (retPerformers.length > 0) {
            performer_id = retPerformers[0].id
        } else {
            notFound()
        }
    }

    const resPerformer = await getPerformerDetail(performer_id, false)
    if (!resPerformer) {
        return {}
    }
    performer_detail = resPerformer.detail

    let meta = {
        title: getTitle(performer_detail),
        description: getDescription(performer_detail),
    }

    // This gives flexibility to customize own canonical and url
    let canonical = setUrl ? setUrl(performer_detail) : `${currentDomain}/performers/${performer}`

    return {
        metadataBase: new URL(canonical),
        title: meta.title,
        openGraph: {
            title: meta.title,
            description: meta.description,
            url: canonical,
        },
        description: meta.description,
        alternates: {
            canonical: canonical,
        },
    }
}

export default async function Performers({
    slugIdResolver = true,
    performer,
    currentDomain,
    urlHasId,
    breadCrumbsHome,
    breadCrumbsHasPath,
    revertTitle,
    _customContentCollection,
    _customImage = false,
    _BreadCrumbs,
    _Banner,
    _GeoLocation,
    _ItemEvents,
    _ItemEventsGeo,
    _ItemVenuePerformers,
    _Detail,
    _History,
    _SideContent,
    _Intro,
}) {
    let performer_id = -1

    if (slugIdResolver) {
        try {
            performer_id = getNumberFromString(performer)
        } catch (e) { }
    }

    const cookieStore = cookies()
    const headersList = headers()

    if (headersList.has('ms-performer-id')) {
        let msPerformerId = headersList.get('ms-performer-id')
        if (msPerformerId) {
            try {
                performer_id = parseInt(msPerformerId)
            } catch (e) {
                WLog.warn(`Failed to parse ms-performer-id: ${msPerformerId}`, 'Performers')
            }
        }
    }

    if (performer_id === -1) {
        let deSlug = performer.replace('-tickets', '')
        deSlug = deSlug.replace(/-/g, ' ')
        if (deSlug === 't pain') {
            deSlug = 't-pain'
        }
        if (deSlug === 'trans siberian orchestra') {
            deSlug = 'trans-siberian orchestra'
        }
        const retPerformers = await ItemPerformerService.suggest(deSlug)
        if (retPerformers.length > 0) {
            performer_id = retPerformers[0].id
        } else {
            notFound()
        }
    }

    let _location = cookieStore.get('_location')
    if (!_location || typeof _location === 'undefined') {
        _location = {
            value: headersList.get('ms-location'),
        }
    }
    let location = {}

    let city_postal = null
    try {
        location = JSON.parse(_location.value)
        city_postal = location.postalCode
    } catch (e) {
        if (performer_id === testPerformerId) {
            location = defaultLocation
        }
    }

    let events = []
    let eventsNearby = []

    const perPage = 20

    let loadMoreDomain = apihost.honolulu

    let eventGetUrl = `${loadMoreDomain}/ItemPerformers/${performer_id}/eventsDetailed?perPage=${perPage}`

    if (city_postal) {
        eventGetUrl = `${loadMoreDomain}/ItemPerformers/${performer_id}/eventsDetailed?postalCode=${city_postal}&perPage=${perPage}`
    }

    let performerDetailTag = `performer-detail-${performer_id}`
    const performerContentTag = `performer-content-${performer_id}`
    let tag = `performer-${performer_id}`

    let resPerformer, resEventsResult, resContent
    if (performer_id === testPerformerId) {
        ;[resPerformer, resEventsResult, resContent] = await Promise.all([
            getPerformerDetail(hamiltonPerformerId, _customImage, performerDetailTag),
            //  null, null, city_postal, null, perPage, 1
            ItemPerformerService.mockFindEventsDetailed(performer_id, location.latitude, location.longitude, '', perPage, 1, tag, city_postal),
            ItemPerformerService.findContentById(hamiltonPerformerId, _customContentCollection, performerContentTag),
        ])
    } else {
        ;[resPerformer, resEventsResult, resContent] = await Promise.all([
            getPerformerDetail(performer_id, _customImage, performerDetailTag),
            //  null, null, city_postal, null, perPage, 1
            ItemPerformerService.findEventsDetailed(performer_id, location?.latitude, location?.longitude, '', perPage, 1, tag, city_postal),
            ItemPerformerService.findContentById(performer_id, _customContentCollection, performerContentTag),
        ])
    }

    let performer_name = ''
    let performer_picture = ''
    let performer_detail = null

    // the performer object
    if (!resPerformer) {
        notFound()
    } else {
        performer_name = resPerformer.name
        performer_picture = resPerformer.pathPicture
        performer_detail = resPerformer.detail
    }

    const breadCrumbs = breadCrumbsHome ? [breadCrumbsHome] : []

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
                !PPCCategoryGrandchildView[k].grandchild
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
            if (performer_detail.child && performer_detail.child !== '-' && !PPCCategoryGrandchildView[k].grandchild) {
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

        let url = `/performers/${_slugify(performer_id, performer_name)}`
        if (!urlHasId) {
            url = `/performers/${performer}`
        }
        breadCrumbs.push({
            name: performer_name,
            url: url,
        })
    } catch (e) {
        console.log(e)
    }

    for (const result of resEventsResult) {
        if (result.name === 'All Events') {
            events = result.results
        } else if (result.name === 'Events Nearby') {
            eventsNearby = result.results
        }
    }

    // CASE 2 - 404 force revalidate so new added performer will be shown
    if (events.length === 0 && eventsNearby.length === 0) {
        WLog.warn(`Revalidation due to no Events`, 'Performers')
        revalidateTag(tag)
        revalidateTag(`${tag}-${city_postal}`)
    }

    let eventsNeedRevalidation = false
    let eventsNearbyNeedRevalidation = false

    // Checks for outdated events in All Events
    if (events && events.length > 0) {
        try {
            const event = events[0]
            if (isEventStale(event)) {
                WLog.warn('Page has stale data on events', 'Performers', {
                    performerId: performer_id,
                    localtimestamp: event.detail.event_local_timestamp,
                    date: `${event.date} , ${event.time}`,
                    timeoffset: event.detail.venue_time_zone_offset,
                })
                eventsNeedRevalidation = true
            }
        } catch (error) {
            WLog.error('Failed localtime v UTC time comparison on events', 'Performers', { performerId: performer_id, error })
        }
    }

    // Checks for outdated events in Nearby Events
    if (eventsNearby && eventsNearby.length > 0) {
        try {
            const eventNearby = eventsNearby[0]
            if (isEventStale(eventNearby)) {
                WLog.warn('Page has stale data on nearby events', 'Performers', {
                    performerId: performer_id,
                    localtimestamp: eventNearby.detail.event_local_timestamp,
                    date: `${eventNearby.date} , ${eventNearby.time}`,
                    timeoffset: eventNearby.detail.venue_time_zone_offset,
                })
                eventsNearbyNeedRevalidation = true
            }
        } catch (error) {
            WLog.error('Failed localtime v UTC time comparison on nearby events', 'Performers', { performerId: performer_id, error })
        }
    }

    if (eventsNeedRevalidation) {
        WLog.warn(`Revalidating events for tag ${tag} ...`, 'Performers')
        revalidateTag(tag)
    }
    if (eventsNearbyNeedRevalidation) {
        WLog.warn(`Revalidating events for tag ${tag}-${city_postal} ...`, 'Performers')
        revalidateTag(`${tag}-${city_postal}`)
    }

    // CASE 3 - Performer lastUpdated is outdated
    if (performer_detail) {
        try {
            if (isPerformerEventsUpToDate(performer_detail)) {
                WLog.warn('Revalidation on Events due to Performer lastUpdated is outdated', 'Performers', {
                    performerDetail: performer_detail,
                })
                revalidateTag(tag)
                revalidateTag(`${tag}-${city_postal}`)
            }
            if (isPerformerEventsUpToDate(performer_detail)) {
                WLog.warn(`Revalidation on Performer Detail due to performer lastUpdated is outdated`, 'Performers', {
                    performerDetail: performer_detail,
                })
                revalidateTag(performerDetailTag)
            }
        } catch (err) {
            WLog.error(`Failed comparing lastUpdated with UTC`, 'Performers', err)
        }
    }

    // Case 4 - Performer has no faq pricefaq intro detail history
    // if (resContent) {
    //     try {
    //         if (resContent && compareLastUpdated(resContent.updatedDate, -4)) {
    //             WLog.warn('Revalidation on Content due to content updatedDate is outdated', 'Performers', {
    //                 resContent: resContent,
    //             })
    //             revalidateTag(performerContentTag)
    //         }
    //     } catch (error) {
    //         WLog.error('Failed revalidating performer content when content is outdated', 'Performers', {error, resContent})
    //     }
    // }

    // if (!resContent) {
    //     WLog.warn(`Revalidation on Content due to empty content`, 'Performers', {
    //         resContent: resContent,
    //     })
    //     revalidateTag(performerContentTag)
    // }

    let faq = []
    let priceFaq = []
    let intro = ''
    let detail = '' // For scorebig
    let history = '' // For scorebig
    if (resContent) {
        /** Prepare the FAQ array by replacing all occurrences of "Affirm" in questions
         * and answers with a hyperlink to Affirm's disclosures page.
         * If no FAQ exists, set as an empty array.
         */
        faq = !resContent.faq
            ? []
            : resContent.faq.map((q) => ({
                ...q,
                question: q.question
                    ? q.question.replace(/Affirm/g, '<a href="https://www.affirm.com/disclosures" style="text-decoration: underline;">Affirm</a>')
                    : q.question,
                answer: q.answer
                    ? q.answer.replace(/Affirm/g, '<a href="https://www.affirm.com/disclosures" style="text-decoration: underline;">Affirm</a>')
                    : q.answer,
            }))
        priceFaq = !resContent.priceFaq ? [] : resContent.priceFaq
        intro = !resContent.intro ? '' : resContent.intro
        if (_Detail && _History) {
            detail = !resContent.detail ? '' : resContent.detail
            history = !resContent.history ? '' : resContent.history
        }
    }

    // ? Structured Data Preparation Ends

    // Banner Object
    let banner = {
        img: performer_picture,
        title: startCase(camelCase(performer_name)),
        p_id: performer_id,
        description: `No Buyer Fees ${startCase(camelCase(performer_name))} Tickets - Up to 30% Off Compared to Competitors`,
        performerName: performer_name,
    }

    const date = new Date()
    const year = date.getFullYear()

    performer = {
        performer_name: performer_name,
        detail: performer_detail,
        performer_image: performer_picture,
    }

    //-------------------------------------------------------

    //Page Starts Here
    let no_performer = events.length == 0

    let venueDict = {}
    let venues = []
    for (const event of events) {
        try {
            if (!(event.detail.venue_id in venueDict)) {
                venueDict[event.detail.venue_id] = 1
                if (event.detail.venue_country_short === 'US') {
                    venues.push({
                        venue_id: event.detail.venue_id,
                        venue_name: event.detail.venue_name,
                        venue_city: event.detail.venue_city,
                        venue_state_province_short: event.detail.venue_state_province_short,
                        performer_id: performer.detail.id,
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

    const structuredData = structuredDataGenerator(events, performer_picture, performer_name, performer_detail, currentDomain, '')

    return (
        <>
            <>
                {!isEmpty(banner) &&
                    (_Banner ? (
                        <_Banner
                            banner={banner}
                            type='performer'
                            breadCrumbs={breadCrumbs}
                            showBio={!isEmpty(intro) || !isEmpty(detail)}
                            showFaq={!isEmpty(faq) || !isEmpty(priceFaq)}
                            showHistory={!isEmpty(history)}
                        />
                    ) : (
                        <Banner
                            banner={banner}
                            type='performer'
                            breadCrumbs={breadCrumbs}
                            showBio={!isEmpty(intro) || !isEmpty(detail)}
                            showFaq={!isEmpty(faq) || !isEmpty(priceFaq)}
                            showHistory={!isEmpty(history)}
                        />
                    ))}
                {_BreadCrumbs && breadCrumbs.length > 0 && <_BreadCrumbs paths={breadCrumbs} isOverlay={true} />}
                {_GeoLocation !== null ? _GeoLocation ? <_GeoLocation /> : <GeoLocation isPerformer={true} /> : null}
                {/* //? Pass the url without the / at the beginning because it has the / on the Events component */}
                <GridWrapper layoutType={_SideContent ? 'two-columns' : 'one-column'}>
                    <div id='events'>
                        {!no_performer && _ItemEventsGeo ? (
                            <_ItemEventsGeo
                                events={eventsNearby}
                                revertTitle={revertTitle}
                                type='performer'
                                title={`${performer.performer_name} Events Nearby`}
                                location={location}
                            />
                        ) : !isEmpty(eventsNearby) ? (
                            _ItemEvents ? (
                                <_ItemEvents
                                    events={eventsNearby}
                                    type='performer'
                                    title={`${performer.performer_name} Events Nearby`}
                                    revertTitle={revertTitle}
                                    location={location}
                                />
                            ) : (
                                <div className='mb-10'>
                                    <EventsWrapper title={`Events Nearby`} events={eventsNearby} location={location} isPerformerPage={true} />
                                </div>
                            )
                        ) : (
                            <NoEvents title={`Events Nearby`} subTitle={`We're Sorry. There are currently no events near you.`} />
                        )}
                        {no_performer && (
                            <>
                                <div className='py-10'>
                                    <div className='max-w-7xl sm:mx-10'>
                                        <h1 className='text-sm sm:text-xl font-semibold'>{performer.performer_name}</h1>
                                        <span className='text-sm'>No Events Available</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {!isEmpty(events) &&
                            (_ItemEvents ? (
                                <_ItemEvents
                                    events={events}
                                    title={`All ${performer.performer_name} Events`}
                                    revertTitle={revertTitle}
                                    hasLoadMore
                                    loadMoreUrl={eventGetUrl}
                                    structuredData={structuredData}
                                    location={location}
                                />
                            ) : (
                                <EventsWrapper
                                    title={`All ${performer.performer_name} Events`}
                                    events={events}
                                    structuredData={structuredData}
                                    loadMoreUrl={eventGetUrl}
                                    hasLoadMore
                                    location={location}
                                    isPerformerPage={true}
                                />
                            ))}
                    </div>
                    {_SideContent && <_SideContent performerImage={performer.performer_image} />}
                </GridWrapper>
                {!isEmpty(venues) &&
                    (_ItemVenuePerformers ? (
                        <_ItemVenuePerformers venuePerformers={venues} title={`${performer.performer_name} Cities & Venues`} />
                    ) : (
                        // TODO: manage to control horizontal margins from one place to make all pages looks the same
                        <div className='my-10'>
                            <Venues title={`${performer.performer_name} Cities & Venues`} venues={venues} linksToPerformerVenues={true} />
                        </div>
                    ))}
                {!isEmpty(intro) &&
                    (_Intro ? (
                        <_Intro intro={intro} performerName={performer.performer_name} />
                    ) : (
                        <div id='bio' className='pt-4 mb-10'>
                            <h2 className='mb-1 text-xl font-semibold sm:mb-2'>{`About ${performer.performer_name}`}</h2>
                            {intro.split('\n').map((line, i) => (
                                <p key={i} className='mb-2 text-gray-500'>
                                    {line}
                                </p>
                            ))}
                        </div>
                    ))}
                {_Detail && <_Detail performer={performer.performer_name} detail={detail} />}
                {_History ? (
                    <_History performer={performer.performer_name} history={history} />
                ) : (
                    (!isEmpty(faq) || !isEmpty(priceFaq)) && (
                        <div id='faq' className='pt-4 mb-10'>
                            <h2 className='mb-1 text-xl font-semibold sm:mb-2'>{`Frequently Asked Questions About ${performer.performer_name} Tickets and Events`}</h2>
                            {priceFaq.map((question, index) => (
                                <div
                                    itemScope
                                    itemType='https://schema.org/Question'
                                    itemProp='mainEntity'
                                    key={index}
                                    className='flex flex-col pt-5 sm:pt-7 items-left lg:w-[60%]'
                                >
                                    <h3 itemProp='name' className='text-lg font-semibold'>
                                        {question.question}
                                    </h3>
                                    <div itemScope itemType='https://schema.org/Answer' itemProp='acceptedAnswer'>
                                        <p itemProp='text' className='text-gray-500'>
                                            {question.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {faq.map((question, index) => (
                                <div
                                    itemScope
                                    itemType='https://schema.org/Question'
                                    itemProp='mainEntity'
                                    key={index}
                                    className='flex flex-col pt-5 sm:pt-7 items-left lg:w-[60%]'
                                >
                                    <h3 itemProp='name' className='text-lg font-semibold'>
                                        <span dangerouslySetInnerHTML={{ __html: question.question }} />
                                    </h3>
                                    <div itemScope itemType='https://schema.org/Answer' itemProp='acceptedAnswer'>
                                        <p itemProp='text' className='text-gray-500'>
                                            <span dangerouslySetInnerHTML={{ __html: question.answer }} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </>
        </>
    )
}
