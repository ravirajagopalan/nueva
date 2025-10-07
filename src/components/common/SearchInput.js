'use client'

import { GrowthBook } from '@growthbook/growthbook-react'
import axios from 'axios-minified'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { TypesenseService } from 'tn-events-service'
import { axiosLulu, createCancelToken, setAuthorizationHeader } from '../../utility/axiosLuluInstance'
import { SearchesGet, apihost, getCID, jsonpParser } from '../../utility/helperFunctions'
import { WLog } from '../../utility/Logger'

export default function SearchInput({ currentQuery, CustomUI, disableTrending = false }) {
    const displayEventsAndCitiesRef = useRef(false)
    const [displayRecentTrendingSearch, setDisplayRecentTrendingSearch] = useState(false)
    const [cookies] = useCookies()
    const gb = useMemo(() => {
        if (typeof window === 'undefined') {
            return null
        }
        const cid = getCID(cookies, window.document)
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        return new GrowthBook({
            apiHost: 'https://cdn.growthbook.io',
            clientKey: 'sdk-hyysdkXzu7Kl0V7',
            trackingCallback: function (experiment, result) {
                // Track experiment impression
                let attempts = 0
                const maxAttempts = 100
                const checkAndPushDataLayer = setInterval(() => {
                    if (typeof dataLayer !== 'undefined') {
                        clearInterval(checkAndPushDataLayer)
                        dataLayer.push({
                            event: 'growthbook-experiment-track',
                            growthbook_experiment_id: experiment.key,
                            growthbook_variation_id: result.variationId,
                            growthbook_cid: cid,
                            browser_viewport_width: viewportWidth,
                            browser_viewport_height: viewportHeight,
                        })
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkAndPushDataLayer)
                    }
                    attempts++
                }, 20)
                if (typeof window.clarity !== undefined) {
                    clarity('set', 'experiment_' + experiment.key, result.variationId)
                }
            },
            attributes: {
                id: cid,
                wcid: 26205,
                viewportWidth,
                viewportHeight,
                url: window.location.href,
            },
        })
    }, [cookies])

    useEffect(() => {
        async function startGrowthBook() {
            if (!gb) {
                return
            }
            await gb.init()
            setDisplayRecentTrendingSearch(gb.isOn('recent_trending_search'))
        }
        startGrowthBook()
    }, [gb])

    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState(currentQuery)
    const [searchRes, setSearchRes] = useState()
    const [searchLoading, setSearchLoading] = useState(false)

    const [performers, setPerformers] = useState([])
    const [venues, setVenues] = useState([])
    const [cities, setCities] = useState([])
    const [events, setEvents] = useState([])

    const [trendingPerformers, setTrendingPerformers] = useState([])
    const [recentActivities, setRecentActivities] = useState([])
    let location = cookies?._location

    const cancelTokenRef = useRef(createCancelToken())

    useEffect(() => {
        if (!searchQuery) {
            setSearchRes(0)
            setPerformers([])
            setVenues([])
            setCities([])
            setEvents([])
            if (isOpen && (!trendingPerformers?.length || !recentActivities?.length)) {
                getTrending()
            }
            return
        }
        if (cancelTokenRef?.current) {
            cancelTokenRef.current.cancel('Operation canceled due to new request.')
        }
        cancelTokenRef.current = createCancelToken()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery])

    const searchRef = useRef(null)

    // will be used for suggester search auth
    useEffect(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!searchRef.current || searchRef.current.contains(event.target)) {
                return
            }
            setIsOpen(false)
        }
        setSearchQuery(currentQuery)
        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [searchRef, currentQuery])

    const callSearchResults = async (q) => {
        if (q.length > 0) {
            if (typeof window !== 'undefined' && window?.isABSearch) {
                try {
                    jsonpParser(q)
                        .then((modifiedData) => {
                            setSearchRes(modifiedData.performers.length + modifiedData.venues.length)
                            setPerformers(modifiedData.performers) // All Performers
                            setVenues(modifiedData.venues)
                        })
                        .catch((error) => {
                            console.log(`No results were found in search suggester of a query:${q}`, { error })
                        })
                } catch (e) {
                    console.log('error searching for results:', e)
                }
            } else {
                try {
                    const response = await SearchesGet(q, displayEventsAndCitiesRef.current)
                    if (response) {
                        setSearchRes(response.performers.length + response.venues.length + response.cities.length + response.events.length) // The whole search response of performers
                        setPerformers(response.performers) // All Performers
                        setVenues(response.venues)
                        setCities(response.cities)
                        setEvents(response.events)
                    }
                } catch (e) {
                    console.log('SEARCH ERROR', e)
                }
            }
        }
        setSearchLoading(false)
    }

    const defaultLocation = {
        address: 'New York, NY, US',
        countryCode: 'US',
        city: 'New York',
        regionCode: 'NY',
        latitude: 40.6943,
        longitude: -73.9249,
        postalCode: '10007',
    }

    const getPopularFeed = async function () {
        if (!location) location = defaultLocation
        const feedTag = `search-feed-${location.postalCode}`
        const token = localStorage.getItem('guestToken')
        if (!token) return
        setAuthorizationHeader(token)

        const queryArgs = {
            q: '*',
            sort_by: 'performer_orders_d7:desc',
            per_page: 200,
            filter_by: 'events_available:<100 && events_available:>5',
            include_fields: 'id,performer_name,events_available,performer_orders_d7,performer_orders_t12',
        }

        const response = await TypesenseService.typesenseSearch('Performer', queryArgs, feedTag, null, true)
        const performerData = response.hits
        const res = []
        for (const p of performerData) {
            p.document.proportion_of_day_sale = p.document.performer_orders_d7 / p.document.performer_orders_t12
            res.push(p.document)
        }
        //sort by proportion_of_day_sale
        const top9 = res.sort((a, b) => b.proportion_of_day_sale - a.proportion_of_day_sale).slice(0, 9)

        return top9
    }

    const getRecentActivities = async function () {
        const token = localStorage.getItem('guestToken')
        if (!token) {
            console.log('No token in LocalStorage.')
            return
        }
        setAuthorizationHeader(token)
        if (!cancelTokenRef.current) {
            cancelTokenRef.current = createCancelToken()
        }
        try {
            const response = await axiosLulu.get(`${apihost.honolulu}/CustomerActivity/recent-activities`, {
                cancelToken: cancelTokenRef.current.token,
            })
            return response?.data
        } catch (e) {
            if (axios.isCancel(e)) {
                console.log('Request canceled:', e.message)
            } else {
                WLog.warn(`Could not fetch customers latest performers`, 'RecentlyViewedSection', { error: e })
            }
        }
    }

    const hasFetchedTrending = useRef(false)

    const getTrending = useCallback(
        async function (q) {
            if (hasFetchedTrending.current || !displayRecentTrendingSearch || disableTrending || (q && q.length > 0)) {
                return
            }

            hasFetchedTrending.current = true

            const activities = await getRecentActivities()
            setRecentActivities(activities)

            const trendingPerformers = await getPopularFeed()
            setTrendingPerformers(trendingPerformers)
        },
        [displayRecentTrendingSearch, disableTrending],
    )

    useEffect(() => {
        let intervalId

        const checkGuestTokenAndGetTrending = () => {
            const token = localStorage.getItem('guestToken')
            if (token && displayRecentTrendingSearch && (trendingPerformers?.length === 0 || recentActivities?.length === 0)) {
                if (!disableTrending && !hasFetchedTrending.current) {
                    getTrending('')
                }
                if (intervalId) {
                    clearInterval(intervalId)
                }
            }
        }

        checkGuestTokenAndGetTrending()

        intervalId = setInterval(checkGuestTokenAndGetTrending, 100)

        const timeoutId = setTimeout(() => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }, 5000)

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayRecentTrendingSearch, getTrending, trendingPerformers])

    const throttleHandleChange = useCallback(debounce(callSearchResults, 500), [])

    const handleSearch = (q) => {
        setSearchLoading(true)
        const query = q.toLowerCase()
        setSearchQuery(query)
        throttleHandleChange(query)
    }

    return (
        <>
            <CustomUI
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                searchRes={searchRes}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                performers={performers}
                venues={venues}
                cities={cities}
                events={events}
                searchRef={searchRef}
                handleSearch={handleSearch}
                trendingPerformers={trendingPerformers}
                recentActivities={recentActivities}
                searchLoading={searchLoading}
                displayRecentTrendingSearch={displayRecentTrendingSearch}
            />
        </>
    )
}
