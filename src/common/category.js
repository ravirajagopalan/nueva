import { cookies, headers } from 'next/headers'
import { notFound } from 'next/navigation'

import EventsWrapper from '../components/EventsWrapper'
import GeoLocation from '../components/GeoLocation'
import ItemPerformers from '../components/ItemPerformers'
import SearchBanner from '../components/SearchBanner'
import SearchInput from '../components/common/SearchInput'

import isEmpty from 'lodash/isEmpty'
import { apihost, structuredDataGenerator, getCategoryImage, getPerformerImageWithFallback } from '../utility/helperFunctions'

import { ItemEventService, ItemPerformerService } from 'tn-events-service'
import PPCCategoryGrandchildView from '../lib/PPCCategoryGrandchildView.json'

// export const runtime = 'edge'

// export const dynamic = 'force-dynamic'
// export const dynamicParams = true

function getCategoryName(category) {
    const sub_category_dict = category in PPCCategoryGrandchildView ? PPCCategoryGrandchildView[category] : null

    if (!sub_category_dict) {
        return null
    }

    const category_name = sub_category_dict.title

    return category_name
}

export async function generateCategoryMetadata(category, currentDomain) {
    const category_name = getCategoryName(category)

    if (!category_name) {
        return {}
    }

    return {
        metadataBase: new URL(`${currentDomain}/category/${category}`),
        title: `No Fee ${category_name} Tickets`,
        description: `Buy ${category_name} tickets on a site where the price you see is the price you pay. With 100% Money-Back Guarantee.`,
        openGraph: {
            title: `No Fee ${category_name} Tickets`,
            description: `Buy ${category_name} tickets on a site where the price you see is the price you pay. With 100% Money-Back Guarantee.`,
            url: `${currentDomain}/category/${category}`,
        },
        alternates: {
            canonical: `${currentDomain}/category/${category}`,
        },
    }
}

export default async function Category({ category, _ItemPerformers, _SearchBanner, _GeoLocation, _EventsWrapper, _BreadCrumbs, currentDomain }) {
    const cookieStore = cookies()
    const headersList = headers()
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
    } catch (e) {}
    const category_name = getCategoryName(category)

    if (!(category in PPCCategoryGrandchildView)) {
        notFound()
    }

    const sub_category_dict = category in PPCCategoryGrandchildView ? PPCCategoryGrandchildView[category] : null
    const sub_category = sub_category_dict ? sub_category_dict.grandchild : ''

    // Banner Object
    let banner = {
        img: '',
        title: category_name + ' Tickets',
        description: `No Buyer Fees ${category_name} Tickets - Up to 30% Off Compared to Competitors`,
    }

    let events = []
    let performers = []
    let queryParams = ''
    let parent = null
    let child = null
    let grandchild = null
    if (sub_category_dict.category) {
        queryParams = `parent=${sub_category_dict.category}`
        parent = sub_category_dict.category
    }
    if (sub_category_dict.child) {
        queryParams = !queryParams ? `child=${sub_category_dict.child}` : `${queryParams}&child=${sub_category_dict.child}`
        child = sub_category_dict.child
    }
    if (sub_category_dict.grandchild) {
        queryParams = !queryParams ? `grandchild=${sub_category_dict.grandchild}` : `${queryParams}&grandchild=${sub_category_dict.grandchild}`
        grandchild = sub_category_dict.grandchild
    }

    if (city_postal !== null) {
        queryParams = `${queryParams}&postalCode=${city_postal}`
    } else {
        city_postal = null
    }

    const perPage = 20

    const eventGetUrl = `${apihost.honolulu}/ItemEvents/suggestByCategory?${queryParams}&perPage=${perPage}`
    const shouldIncludeDetailsPropertyInEvents = true
    const resPromises = await Promise.all([
        ItemPerformerService.suggestByCategory(location.latitude, location.longitude, parent, child, grandchild),
        ItemEventService.suggestByCategory(
            location.latitude,
            location.longitude,
            perPage,
            1,
            parent,
            child,
            grandchild,
            shouldIncludeDetailsPropertyInEvents,
        ),
    ])

    performers = resPromises[0]
    events = resPromises[1]
    if (performers.length == 0 && events.length == 0) {
        return { notFound: true }
    }

    // Breadcrumbs
    let breadCrumbs = []
    try {
        if (sub_category_dict.category) {
            parent = null
            let parentSlug = ''
            for (const k in PPCCategoryGrandchildView) {
                if (k === category) {
                    continue
                }
                if (PPCCategoryGrandchildView[k].child) {
                    continue
                }
                if (PPCCategoryGrandchildView[k].grandchild) {
                    continue
                }
                if (PPCCategoryGrandchildView[k].category === sub_category_dict.category) {
                    parent = PPCCategoryGrandchildView[k]
                    parentSlug = k
                    break
                }
            }
            if (parent && parentSlug) {
                breadCrumbs.push({
                    name: parent.title,
                    url: `/category/${parentSlug}`,
                })
            }
        }
        if (sub_category_dict.child) {
            child = null
            let childSlug = ''
            for (const k in PPCCategoryGrandchildView) {
                if (k === category) {
                    continue
                }
                if (PPCCategoryGrandchildView[k].grandchild) {
                    continue
                }
                if (
                    PPCCategoryGrandchildView[k].child === sub_category_dict.child &&
                    PPCCategoryGrandchildView[k].category === sub_category_dict.category
                ) {
                    child = PPCCategoryGrandchildView[k]
                    childSlug = k
                    break
                }
            }
            if (child && childSlug) {
                breadCrumbs.push({
                    name: child.title,
                    url: `/category/${childSlug}`,
                })
            }
        }
        if (sub_category_dict.grandchild) {
            grandchild = null
            let grandchildSlug = ''
            for (const k in PPCCategoryGrandchildView) {
                if (k === category) {
                    continue
                }
                if (
                    PPCCategoryGrandchildView[k].grandchild === sub_category_dict.grandchild &&
                    PPCCategoryGrandchildView[k].child === sub_category_dict.child &&
                    PPCCategoryGrandchildView[k].category === sub_category_dict.category
                ) {
                    grandchild = PPCCategoryGrandchildView[k]
                    grandchildSlug = k
                    break
                }
            }
            if (grandchild && grandchildSlug) {
                breadCrumbs.push({
                    name: grandchild.title,
                    url: `/category/${grandchildSlug}`,
                })
            }
        }

        breadCrumbs.push({
            name: sub_category_dict.title,
            url: `/category/${category}`,
        })
    } catch (e) {}

    const categoryImage = getCategoryImage(parent?.title, child?.child, grandchild?.title) || getPerformerImageWithFallback(performers[0]?.id)
    const structuredData = currentDomain ? structuredDataGenerator(events, categoryImage, '', '', currentDomain) : null

    return (
        <>
            {_BreadCrumbs && <_BreadCrumbs paths={breadCrumbs} />}
            {_SearchBanner ? (
                <_SearchBanner
                    title={`${category_name} Tickets`}
                    subTitle={`No Buyer Fees ${category_name} Tickets - Up to 30% Off Compared to Competitors`}
                    breadCrumbs={_BreadCrumbs ? null : breadCrumbs}
                    SearchInput={SearchInput}
                />
            ) : (
                <SearchBanner
                    title={`${category_name} Tickets`}
                    subTitle={`No Buyer Fees ${category_name} Tickets - Up to 30% Off Compared to Competitors`}
                    breadCrumbs={breadCrumbs}
                    SearchInput={SearchInput}
                />
            )}
            {_GeoLocation ? <_GeoLocation /> : <GeoLocation />}
            {!isEmpty(performers) &&
                (_ItemPerformers ? (
                    <_ItemPerformers performers={performers} title={`${category_name} Performers`} />
                ) : (
                    <ItemPerformers performers={performers} title={`${category_name} Performers`} />
                ))}
            {!isEmpty(events) &&
                (_EventsWrapper ? (
                    <_EventsWrapper events={events} title={`${category_name} Events`} hasLoadMore loadMoreUrl={eventGetUrl} />
                ) : structuredData ? (
                    <EventsWrapper
                        events={events}
                        title={`${category_name} Events`}
                        hasLoadMore
                        loadMoreUrl={eventGetUrl}
                        location={location}
                        isCategoryPage={true}
                        structuredData={structuredData}
                    />
                ) : (
                    <EventsWrapper
                        events={events}
                        title={`${category_name} Events`}
                        hasLoadMore
                        loadMoreUrl={eventGetUrl}
                        location={location}
                        isCategoryPage={true}
                    />
                ))}
        </>
    )
}
