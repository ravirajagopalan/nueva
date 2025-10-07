'use client'

import { useState, useEffect, Fragment } from 'react'

import Event from './Event'
import { _slugify, getUrlParameter, distanceCalc } from '../utility/helperFunctions'
import { CheckmarkIcon } from './CheckmarkIcon'
import { classNames } from '../utility/helperFunctions'

export default function EventsWrapper({
    title,
    events,
    structuredData,
    hasLoadMore,
    loadMoreUrl,
    location = undefined,
    isPerformerPage = false,
    isCategoryPage = false,
}) {
    const perPageUrlParam = loadMoreUrl ? getUrlParameter(loadMoreUrl, 'perPage') : null

    const perPage = parseInt(perPageUrlParam, 10) || 200

    const [_events, setEvents] = useState(events)

    const [isTestingPerformerSortedEvents, setIsTestingPerformerSortedEvents] = useState(false)
    const [isTestingCategorySortedEvents, setIsTestingCategorySortedEvents] = useState(false)

    const [eventsSorting, setEventsSorting] = useState(isCategoryPage ? 'popular' : 'date')
    const [isOpenSort, setIsOpenSort] = useState(false)

    const [datePageIndex, setDatePageIndex] = useState(isPerformerPage ? 2 : 1)
    const [distancePageIndex, setDistancePageIndex] = useState(1)
    const [popularPageIndex, setPopularPageIndex] = useState(isCategoryPage ? 2 : 1)

    const [loading, setLoading] = useState(false)
    const [useLoadMore, setUseLoadMore] = useState(false)

    const sortByDate = (a, b) => new Date(`${a.date} ${a.year} ${a.time}`) - new Date(`${b.date} ${b.year} ${b.time}`)
    const sortByDistance = (a, b) => {
        return (
            distanceCalc(location?.latitude, location?.longitude, a.detail.location[0], a.detail.location[1]) -
            distanceCalc(location?.latitude, location?.longitude, b.detail.location[0], b.detail.location[1])
        )
    }

    const ALL_EVENTS_CACHE_KEY_DATE = 'all_events_cache_date'
    const ALL_EVENTS_CACHE_KEY_DISTANCE = 'all_events_cache_distance'
    const ALL_EVENTS_CACHE_KEY_POPULAR = 'all_events_cache_popular'

    function getCacheKey(sortType) {
        return sortType === 'distance'
            ? ALL_EVENTS_CACHE_KEY_DISTANCE
            : sortType === 'popular'
            ? ALL_EVENTS_CACHE_KEY_POPULAR
            : ALL_EVENTS_CACHE_KEY_DATE
    }
    function getPageIndex(sortType) {
        switch (sortType) {
            case 'distance':
                return distancePageIndex
            case 'popular':
                return popularPageIndex
            case 'date':
                return datePageIndex
            default:
                return 0
        }
    }
    function incrementPageIndex(eventsSorting) {
        if (eventsSorting === 'date') {
            setDatePageIndex(datePageIndex + 1)
        } else if (eventsSorting === 'distance') {
            setDistancePageIndex(distancePageIndex + 1)
        } else if (eventsSorting == 'popular') {
            setPopularPageIndex(popularPageIndex + 1)
        }
    }

    function saveLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data))
    }
    function loadLocalStorageKey(key) {
        const cachedData = localStorage.getItem(key)
        return cachedData ? JSON.parse(cachedData) : null
    }
    function clearLocalStorageItems() {
        localStorage.removeItem(ALL_EVENTS_CACHE_KEY_DATE)
        localStorage.removeItem(ALL_EVENTS_CACHE_KEY_DISTANCE)
        localStorage.removeItem(ALL_EVENTS_CACHE_KEY_POPULAR)
    }

    useEffect(() => {
        clearLocalStorageItems()
        const cacheKey = isCategoryPage ? ALL_EVENTS_CACHE_KEY_POPULAR : ALL_EVENTS_CACHE_KEY_DATE
        saveLocalStorage(cacheKey, _events)
    }, [])

    // this one helps with performer pages events nearby // please don't remove this comment
    useEffect(() => {
        if (title !== 'Events Nearby' || !isPerformerPage) return
        let sortedEvents = [...events]
        if (eventsSorting === 'date') {
            sortedEvents.sort(sortByDate)
        } else if (eventsSorting === 'distance') {
            sortedEvents.sort(sortByDistance)
        }
        setEvents(sortedEvents)
    }, [eventsSorting])

    async function fetchEvents(sortType) {
        const cacheKey = getCacheKey(sortType)
        const page = getPageIndex(sortType)
        const cachedData = loadLocalStorageKey(cacheKey)
        if (cachedData) return cachedData

        const _loadMoreUrl = `${loadMoreUrl}${loadMoreUrl.includes('?') ? '&' : '?'}page=${page}&sortBy=${sortType}&latitude=${
            location?.latitude || ''
        }&longitude=${location?.longitude || ''}`
        const response = await fetch(_loadMoreUrl)
        const resEventsResult = await response.json()

        incrementPageIndex(sortType)
        const data = resEventsResult[0]?.results || resEventsResult
        saveLocalStorage(cacheKey, data)
        return data
    }

    async function loadMoreEvent() {
        setLoading(true)
        const page = getPageIndex(eventsSorting)
        const cacheKey = getCacheKey(eventsSorting)
        try {
            let _loadMoreUrl = loadMoreUrl?.includes('?') ? `${loadMoreUrl}&page=${page}` : `${loadMoreUrl}?page=${page}`
            if (isTestingPerformerSortedEvents || isTestingCategorySortedEvents) {
                _loadMoreUrl = `${loadMoreUrl}${loadMoreUrl.includes('?') ? '&' : '?'}page=${page}&sortBy=${eventsSorting}&latitude=${
                    location?.latitude || ''
                }&longitude=${location?.longitude || ''}`
            }

            const response = await fetch(_loadMoreUrl)
            const resEventsResult = await response.json()
            // category page does not include nearby event section in its response
            if (isCategoryPage || _loadMoreUrl.includes('/ItemVenues/')) {
                const updatedEvents = [...(_events ?? []), ...resEventsResult]
                if (isTestingPerformerSortedEvents || isTestingCategorySortedEvents) {
                    saveLocalStorage(cacheKey, updatedEvents)
                }

                setEvents((initialEvents) => [...(initialEvents ?? []), ...resEventsResult])
                setLoading(false)
            } else if (isPerformerPage) {
                for (const result of resEventsResult) {
                    if (result.name === 'All Events') {
                        const updatedEvents = [...(_events ?? []), ...result.results]
                        if (isTestingPerformerSortedEvents || isTestingCategorySortedEvents) {
                            saveLocalStorage(cacheKey, updatedEvents)
                        }

                        setEvents((initialEvents) => [...(initialEvents ?? []), ...result.results])
                        setLoading(false)
                    }
                }
            }
            incrementPageIndex(eventsSorting)
        } catch (error) {
            setLoading(false)
            setUseLoadMore(false)
        }
    }

    async function handleSortingBtnClick(sortType) {
        setIsOpenSort((val) => !val)
        setEventsSorting(sortType)
        // Handling All Events Section
        if ((title !== 'Events Nearby' && isPerformerPage) || isCategoryPage) {
            try {
                const data = await fetchEvents(sortType)
                setEvents(data)
            } catch (e) {
                console.error('Something went wrong while fetching events:', e)
                setUseLoadMore(false)
            }
        }
        // performer page nearby events
        else {
            let sortedEvents = [...events]
            if (eventsSorting === 'date') {
                sortedEvents.sort(sortByDate)
            } else if (eventsSorting === 'distance') {
                sortedEvents.sort(sortByDistance)
            }
            setEvents(sortedEvents)
        }
    }

    useEffect(() => {
        const handleCustomEventPerformer = (event) => {
            if (event.detail === true && isPerformerPage) {
                setIsTestingPerformerSortedEvents(true)
            }
        }
        const handleCustomEventCategory = (event) => {
            if (event.detail === true && isCategoryPage) {
                setIsTestingCategorySortedEvents(true)
            }
        }

        window.addEventListener('sortedEvents', handleCustomEventPerformer)
        window.addEventListener('sortedEventsCategory', handleCustomEventCategory)

        return () => {
            window.removeEventListener('sortedEvents', handleCustomEventPerformer)
            window.removeEventListener('sortedEventsCategory', handleCustomEventCategory)
        }
    }, [])

    // this use effect will control show load more
    useEffect(() => {
        const pageIndex = getPageIndex(eventsSorting)

        if (_events.length < (pageIndex - 1) * perPage) {
            setUseLoadMore(false)
        } else {
            setUseLoadMore(true)
        }
    }, [_events])

    return (
        <>
            <div className='flex items-center justify-between'>
                {title && <div className='text-2xl text-[#222222] font-bold'>{title}</div>}
                {((isTestingPerformerSortedEvents && isPerformerPage) || (isTestingCategorySortedEvents && isCategoryPage)) && (
                    <div className='flex items-center justify-center'>
                        <button
                            className='text-primary font-semibold text-xs sm:text-sm lg:text-base rounded-lg text-center inline-flex items-center gap-1 sm:gap-2 outline-none'
                            onClick={() => setIsOpenSort((val) => !val)}
                        >
                            {eventsSorting === 'distance' ? 'SORT BY DISTANCE' : eventsSorting === 'popular' ? 'SORT BY TRENDING' : 'SORT BY DATE'}
                            <svg
                                className={classNames(
                                    isOpenSort ? 'rotate-180' : 'rotate-0',
                                    'w-2.5 h-2.5 transition-transform duration-300 ease-in-out',
                                )}
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 10 6'
                            >
                                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 4 4 4-4' />
                            </svg>
                        </button>
                        <div
                            id='dropdown'
                            className={classNames(
                                isOpenSort ? 'block' : 'hidden',
                                'z-10 bg-white divide-y divide-gray-100 rounded-lg shadow absolute text-base font-normal mt-7',
                            )}
                        >
                            <ul className='py-2 text-sm text-gray-700' aria-labelledby='dropdownDefaultButton'>
                                {isCategoryPage && (
                                    <li className='flex flex-row'>
                                        <button
                                            onClick={() => handleSortingBtnClick('popular')}
                                            className='pl-4 pr-3 py-2 hover:bg-gray-100 w-full text-left text-xs sm:text-sm'
                                        >
                                            <div className='flex flex-row justify-between gap-4 whitespace-nowrap text-nowrap'>
                                                Sort By Trending
                                                {eventsSorting === 'popular' && <CheckmarkIcon />}
                                            </div>
                                        </button>
                                    </li>
                                )}
                                <li className='flex flex-row'>
                                    <button
                                        onClick={() => handleSortingBtnClick('date')}
                                        className='pl-4 pr-3 py-2 hover:bg-gray-100 w-full text-left text-xs sm:text-sm'
                                    >
                                        <div className='flex flex-row justify-between gap-4 whitespace-nowrap text-nowrap'>
                                            Sort By Date
                                            {eventsSorting === 'date' && <CheckmarkIcon />}
                                        </div>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleSortingBtnClick('distance')}
                                        className='pl-4 pr-3 py-2 hover:bg-gray-100 w-full text-left text-xs sm:text-sm'
                                    >
                                        <div className='flex flex-row justify-between gap-4 whitespace-nowrap text-nowrap'>
                                            Sort By Distance
                                            {eventsSorting === 'distance' && <CheckmarkIcon />}
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            <ul>
                {_events.length > 0 &&
                    _events.map((event, index) => (
                        <Fragment key={event.id}>
                            <Event event={event} structuredData={structuredData} />
                            <div>
                                {structuredData && structuredData.events[index] && (
                                    <>
                                        {structuredData &&
                                            Object.keys(structuredData).length > 0 &&
                                            Object.keys(structuredData.events).length > 0 && (
                                                <script
                                                    type='application/ld+json'
                                                    dangerouslySetInnerHTML={{
                                                        __html: JSON.stringify(structuredData.events[index]),
                                                    }}
                                                />
                                            )}
                                    </>
                                )}
                            </div>
                        </Fragment>
                    ))}
            </ul>
            {hasLoadMore && useLoadMore && (
                <button
                    style={{ maxWidth: '1400px' }}
                    onClick={() => {
                        loadMoreEvent()
                        setLoading(true)
                    }}
                    className='flex justify-center w-1/2 mx-auto mt-4 mb-10 border border-[#EDEDED] p-2 bg-white text-[#DA183B] font-semibold text-base rounded hover:bg-[#DA183B] hover:border-[#DA183B] hover:text-white transition ease-in-out duration-500'
                    disabled={loading}
                >
                    <span>Load More Events</span>
                </button>
            )}
        </>
    )
}
