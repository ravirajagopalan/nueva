import Home from '../common/home'

const currentDomain = 'https://www.megaseats.com'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export const metadata = {
    metadataBase: new URL(currentDomain),
    title: 'Tickets with No Fees | MEGAseats.com',
    description: 'Buy tickets on a site where the price you see is the price you pay. With 100% Money-Back Guarantee.',
    openGraph: {
        title: 'Tickets with No Fees | MEGAseats.com',
        description: 'Buy tickets on a site where the price you see is the price you pay. With 100% Money-Back Guarantee.',
        url: currentDomain,
    },
    alternates: {
        canonical: '/',
    },
}

export default function Handler() {
    const customFeedSegment = [
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
                // {
                //     name: 'NFL',
                //     queryArguments: {
                //         q: '*',
                //         sort_by: 'event_orders_d7:desc',
                //         geo_filter: '30mi',
                //         per_page: 5,
                //         filter_by: 'major_category:=NFL',
                //     },
                //     queryMethod: 'getEventsTypesense',
                //     type: 'EventCategory',
                // },
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
    ]
    return <Home _customFeedSegments={customFeedSegment} _MostRecent={true} />
}
