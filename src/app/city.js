import { notFound } from 'next/navigation'

import ItemPerformers from '../components/ItemPerformers'
import SearchBanner from '../components/SearchBanner'
import Tabs from '../components/Tabs'
import Venues from '../components/Venues'
import SearchInput from '../components/common/SearchInput'

import { LocationService, FeedSegmentService } from 'tn-events-service'

export async function generateCityMetadata(city, currentDomain) {
    const cityString = city.replace(/-/g, ' ')
    const cities = await LocationService.suggestCity(cityString)
    if (cities.length == 0) {
        return {}
    }
    const topCity = cities[0]

    return {
        metadataBase: new URL(`${currentDomain}/cities/${city}`),
        title: `Get Tickets to Top Concerts, Sports and Theater Events in ${topCity.city}`,
        description: `Buy ${topCity.city} event tickets on a site where the price you see is the price you pay. With 100% Money-Back Guarantee.`,
        openGraph: {
            title: `Get Tickets to Top Concerts, Sports and Theater Events in ${topCity.city}`,
            description: `Buy ${topCity.city} event tickets on a site where the price you see is the price you pay. With 100% Money-Back Guarantee.`,
            url: `${currentDomain}/cities/${city}`,
        },
        alternates: {
            canonical: `${currentDomain}/category/${city}`,
        },
    }
}

export default async function City({ city, _SearchBanner, _ItemPerformer, _VenuesList, _EventsList }) {
    const cityString = city.replace(/-/g, ' ')

    const cities = await LocationService.suggestCity(cityString)
    if (cities.length == 0) {
        notFound()
        return
    }
    const topCity = cities[0]

    const feeds = await FeedSegmentService.getFeed('explore', topCity, false, [
        {
            name: 'Popular Performers',
            subsegments: [
                {
                    name: '',
                    queryMethod: 'getPerformersTypesense',
                    type: 'Performer',
                    queryArguments: {
                        q: '*',
                        sort_by: 'performer_orders_d7:desc',
                        per_page: 8,
                        geo_filter: '30mi',
                        filter_by: 'events_available:<50',
                    },
                },
            ],
        },
        {
            name: 'Popular Events',
            subsegments: [
                {
                    name: 'All Events',
                    type: 'EventCategory',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        date_filter: 'all',
                        per_page: 5,
                    },
                    queryMethod: 'getEventsTypesense',
                },
                {
                    name: 'This Week',
                    type: 'EventCategory',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        date_filter: 'this_week',
                        per_page: 5,
                    },
                    queryMethod: 'getEventsTypesense',
                },
                {
                    name: 'This Month',
                    type: 'EventCategory',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        date_filter: 'this_month',
                        per_page: 5,
                    },
                    queryMethod: 'getEventsTypesense',
                },
                {
                    name: 'Next 30 Days',
                    type: 'EventCategory',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        date_filter: 'next_30_days',
                        per_page: 5,
                    },
                    queryMethod: 'getEventsTypesense',
                },
                {
                    name: 'Next 60 Days',
                    type: 'EventCategory',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        date_filter: 'next_60_days',
                        per_page: 5,
                    },
                    queryMethod: 'getEventsTypesense',
                },
            ],
        },
        {
            name: 'Performers This Week',
            subsegments: [
                {
                    name: '',
                    queryArguments: {
                        q: '*',
                        sort_by: 'order_rank:asc',
                        per_page: 8,
                        date_filter: 'next_7_days',
                        geo_filter: '30mi',
                    },
                    queryMethod: 'getPerformersTypesense',
                    type: 'Performer',
                },
            ],
        },
        {
            name: 'Local Venues',
            subsegments: [
                {
                    name: '',
                    queryArguments: {
                        q: '*',
                        filter_by: 'events_available:>0',
                        sort_by: 'total_inventory_value:desc',
                        per_page: 8,
                        geo_filter: '30mi',
                    },
                    queryMethod: 'getVenuesTypesense',
                    type: 'Venue',
                },
            ],
        },
        {
            name: 'Browse By Category',
            subsegments: [
                {
                    name: 'Concerts',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        per_page: 5,
                        filter_by: 'parent_category:=Concerts',
                    },
                    queryMethod: 'getEventsTypesense',
                    type: 'EventCategory',
                },
                {
                    name: 'Sports',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        per_page: 5,
                        filter_by: 'parent_category:=Sports',
                    },
                    queryMethod: 'getEventsTypesense',
                    type: 'EventCategory',
                },
                {
                    name: 'Theater',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        per_page: 5,
                        filter_by: 'parent_category:=Theater',
                    },
                    queryMethod: 'getEventsTypesense',
                    type: 'EventCategory',
                },
                {
                    name: 'Country',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        per_page: 5,
                        filter_by: 'child_category:=Country / Folk',
                    },
                    queryMethod: 'getEventsTypesense',
                    type: 'EventCategory',
                },
                {
                    name: 'Broadway & Play',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        per_page: 5,
                        filter_by: 'child_category:=[Broadway,Musical / Play]',
                    },
                    queryMethod: 'getEventsTypesense',
                    type: 'EventCategory',
                },
                {
                    name: 'NFL',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        per_page: 5,
                        filter_by: 'major_category:=NFL',
                    },
                    queryMethod: 'getEventsTypesense',
                    type: 'EventCategory',
                },
                {
                    name: 'MLB',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        per_page: 5,
                        filter_by: 'major_category:=MLB',
                    },
                    queryMethod: 'getEventsTypesense',
                    type: 'EventCategory',
                },
                {
                    name: 'NBA',
                    queryArguments: {
                        q: '*',
                        sort_by: 'event_orders_d7:desc',
                        geo_filter: '30mi',
                        per_page: 5,
                        filter_by: 'major_category:=NBA',
                    },
                    queryMethod: 'getEventsTypesense',
                    type: 'EventCategory',
                },
            ],
        },
    ])

    console.log(feeds.length)

    return (
        <>
            {_SearchBanner ? (
                <_SearchBanner
                    title={`Events in ${topCity.city}, ${topCity.regionCode}`}
                    subTitle={`No Buyer Fees ${topCity.city} Event Tickets - Up to 30% Off Compared to Competitors`}
                    SearchInput={SearchInput}
                />
            ) : (
                <SearchBanner
                    title={`Events in ${topCity.city}, ${topCity.regionCode}`}
                    subTitle={`No Buyer Fees ${topCity.city} Event Tickets - Up to 30% Off Compared to Competitors`}
                    SearchInput={SearchInput}
                />
            )}

            {feeds.map((fd, i) => {
                if (fd.entityType == 'Performer') {
                    return (
                        <div key={i} className='mb-10'>
                            {_ItemPerformer ? (
                                <_ItemPerformer title={fd.name} performers={fd.results} titleHeading={true} />
                            ) : (
                                <ItemPerformers title={fd.name} performers={fd.results} titleHeading={true} showEventsCount={false} />
                            )}
                        </div>
                    )
                }
                if (fd.entityType == 'Venue') {
                    return (
                        <div key={i} className='mb-10'>
                            {_VenuesList ? (
                                <_VenuesList venues={fd.results} />
                            ) : (
                                <Venues title={'Local Venues'} venues={fd.results} titleHeading={true} />
                            )}
                        </div>
                    )
                }
                if (fd.entityType == 'Event') {
                    return (
                        <div key={i} className='mb-10'>
                            {_EventsList ? <_EventsList key={i} events={fd.results} /> : <Tabs tabs={fd.results} title={fd.name} />}
                        </div>
                    )
                }
                if (fd.entityType == 'EventCategory') {
                    return (
                        <div key={i} className='w-full mb-10'>
                            <Tabs tabs={fd.results} title={fd.name} />
                        </div>
                    )
                }
            })}
        </>
    )
}
