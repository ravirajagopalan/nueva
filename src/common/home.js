import dynamic from 'next/dynamic'
import { cookies, headers } from 'next/headers'

import { FeedSegmentService } from 'tn-events-service'

const GeoLocation = dynamic(() => import('../components/GeoLocation'))
const ItemPerformers = dynamic(() => import('../components/ItemPerformers'))
const SearchBanner = dynamic(() => import('../components/SearchBanner'))
const Tabs = dynamic(() => import('../components/Tabs'))
const Venues = dynamic(() => import('../components/Venues'))
const SearchInput = dynamic(() => import('../components/common/SearchInput'))
const RecentlyViewSection = dynamic(() => import('../components/RecentlyViewedPerformersWrapper'))

export default async function Home({
    _customFeedSegments,
    _customImages = false,
    _SearchBanner,
    _GeoLocation,
    _HomeCategories,
    _ItemPerformer,
    _ItemPromo,
    _VenuesList,
    _EventsList,
    _EventCategoriesList,
    _TopList,
    _MostRecent = false,
}) {
    const cookieStore = cookies()
    const headersList = headers()
    let location = cookieStore.get('_location')
    if (!location || typeof location === 'undefined') {
        location = {
            value: headersList.get('ms-location'),
        }
    }
    try {
        location = JSON.parse(location.value)
    } catch (e) {}

    let customFeeds = _customFeedSegments || null
    const feeds = await FeedSegmentService.getFeed('explore', location, _customImages, customFeeds)

    let categorySection = []
    if (_TopList) {
        for (const feed of feeds) {
            if (feed.entityType === 'Performer' || feed.entityType === 'Venue') {
                categorySection.push(feed)
            }
        }
    }

    return (
        <>
            <div className=' bg-white'>
                {_SearchBanner ? (
                    <_SearchBanner isH1 subTitle='No Fees - Secure Checkout - 100% Guarantee' SearchInput={SearchInput} />
                ) : (
                    <SearchBanner isH1={true} SearchInput={SearchInput} />
                )}
                {_HomeCategories ? <_HomeCategories /> : ''}
                {_GeoLocation !== null ? _GeoLocation ? <_GeoLocation /> : <GeoLocation /> : null}
                {_MostRecent ? <RecentlyViewSection _customImages={_customImages} _ItemPerformer={_ItemPerformer} /> : null}
                {feeds.map((fd, i) => {
                    if (fd.entityType === 'Explore' || fd.entityType === 'Banner') {
                        return <>{_ItemPromo ? <_ItemPromo featuredList={fd.results} /> : null}</>
                    }
                    if (fd.entityType == 'Performer') {
                        return (
                            <>
                                {_ItemPerformer !== null ? (
                                    _ItemPerformer ? (
                                        <>
                                            <_ItemPerformer title={fd.name} performers={fd.results} titleHeading={true} />
                                        </>
                                    ) : (
                                        <ItemPerformers title={fd.name} performers={fd.results} titleHeading={true} showEventsCount={true} />
                                    )
                                ) : null}
                            </>
                        )
                    }
                    if (fd.entityType == 'Venue') {
                        return (
                            <>
                                {_VenuesList !== null ? (
                                    _VenuesList ? (
                                        <_VenuesList venues={fd.results} />
                                    ) : (
                                        <Venues title={'Local Venues'} venues={fd.results} titleHeading={true} />
                                    )
                                ) : null}
                            </>
                        )
                    }
                    if (fd.entityType == 'Event') {
                        return (
                            <>
                                {_EventsList !== null ? (
                                    _EventsList ? (
                                        <_EventsList key={i} events={fd.results} />
                                    ) : (
                                        <Tabs tabs={fd.results} title={fd.name} />
                                    )
                                ) : null}
                            </>
                        )
                    }
                    if (fd.entityType == 'EventCategory') {
                        return (
                            <div key={i} className='w-full'>
                                {_EventCategoriesList !== null ? (
                                    _EventCategoriesList ? (
                                        <_EventCategoriesList key={i} categories={fd} />
                                    ) : (
                                        <Tabs tabs={fd.results} title={fd.name} />
                                    )
                                ) : null}
                            </div>
                        )
                    }
                })}
                {_TopList ? <_TopList categorySection={categorySection} /> : null}
            </div>
        </>
    )
}
// Removed Data was incorrect | Showing DC instead of CT
// const feedsRes = await fetch(`https://develop.tn-backend.app/FeedSegments/getModernFeed?type=explore`, {
//     method: 'get',
//     headers: {
//         'X-Wcid': 26205,
//     },
//     next: {
//         tags: ['getFeed'],
//         revalidate: 43200,
//     },
// })
// const feeds = await feedsRes.json()
