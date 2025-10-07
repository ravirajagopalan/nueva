'use client'

import { SearchIcon } from '@heroicons/react/outline'
import { Fragment, useState } from 'react'

import RecentActivities from './RecentActivities'
import TrendingPerformers from './TrendingPerformers'

import Image from 'next/image'
import { _slugify, classNames, searchToSlug, slugifyPerformerName, trackAction } from '../utility/helperFunctions'

export default function SearchBannerInput({
    isOpen,
    setIsOpen,
    searchRes,
    searchQuery,
    performers,
    venues,
    cities,
    events,
    searchRef,
    handleSearch,
    trendingPerformers,
    recentActivities,
    searchLoading,
    displayRecentTrendingSearch,
}) {
    const displayEventsAndCities = false

    const numOfEntities = () => {
        let i = 0
        if (performers.length > 0) i++
        if (venues.length > 0) i++
        if (cities.length > 0) i++
        return i
    }

    const totalEntriesToShow = 9
    const recentActivitiesCount = recentActivities?.length || 0
    const mobileRecentActivitesCount = Math.min(recentActivitiesCount, 3)
    const trendingPerformersCount = Math.max(0, totalEntriesToShow - mobileRecentActivitesCount)

    const recentActivitiesForMobile = recentActivities?.slice(0, mobileRecentActivitesCount)
    const trendingPerformersForMobile = trendingPerformers?.slice(0, trendingPerformersCount)

    const shouldShowEvents = numOfEntities() <= 2 || searchQuery.includes(' vs')

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
    const selectPerformer = (performer) => {
        window.location.href = `/performers/${searchToSlug(performer)}`
    }
    const selectActivity = (activity) => {
        trackAction('trending_search_click', activity.entityType)
        switch (activity.entityType) {
            case 'Performer':
                window.location.href = `/performers/${slugifyPerformerName(activity.name, '', activity.entityId)}`
                break
            case 'Event':
                window.location.href = `/tickets/${_slugify(activity.entityId, activity.name, activity.address, activity.day, activity.date)}`
                break
            case 'Venue':
                window.location.href = `/venues/${_slugify(activity.entityId, activity.name)}`
                break
        }
    }

    const selectVenue = (venue) => {
        const slug = _slugify(venue.id, venue.name)
        window.location.href = `/venues/${slug}`
    }

    const selectCity = (city) => {
        window.location.href = `/cities/${city.name.toLowerCase()}`
    }

    // Don't change this to router.push because we need the hard navigation to tickets page for the header in that page to work propely.
    const selectEvent = (event) => {
        window.location.href = `/tickets/${_slugify(event.id, event.name, event.address, event.day, event.date)}`
    }

    const handleKeyDownSearch = (e) => {
        if (e.key === 'Enter' || e.key === 'NumpadEnter' || e.keyCode == 13) {
            window.location.href = `/results-general?kwds=${searchQuery}`
        }
    }
    return (
        <>
            <div ref={searchRef} className='relative z-30 flex items-center'>
                <SearchIcon className='absolute w-5 h-5 sm:w-6 sm:h-6 text-primary left-3' aria-hidden='true' />
                <input
                    type='text'
                    value={searchQuery || ''}
                    onClick={() => {
                        setIsMobileSearchOpen(true)
                        document.body.style.overflow = 'hidden'
                    }}
                    className='sm:hidden flex items-center w-full h-12 pl-10 placeholder:text-sm placeholder:text-[#808080] placeholder:font-light bg-white border-none rounded-md focus:outline-none outline-none'
                    placeholder='Search teams, artists & venues'
                    readOnly
                />

                <input
                    value={searchQuery || ''}
                    onKeyDown={(e) => handleKeyDownSearch(e)}
                    onInput={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        setIsOpen(true)
                    }}
                    className='hidden sm:block w-full h-16 pl-12 placeholder:text-lg placeholder:text-[#808080] placeholder:font-light bg-white border-none rounded-full focus:outline-none outline-none'
                    placeholder='Search teams, artists & venues'
                />
                <div
                    className={classNames(
                        isOpen ? 'absolute block w-content' : 'hidden opacity-0',
                        'bg-white rounded-3xl border border-gray w-full overflow-y-auto top-14 sm:top-20 p-4 scroll-m-2 scrollbar-hide h-fit min-h-[220px]',
                    )}
                >
                    <Fragment>
                        {performers && performers.length > 0 && (
                            <div className='mb-4 border-b border-gray-300'>
                                <div className='mb-2'>
                                    <div className='mb-2 text-base font-semibold text-black'>Performers</div>
                                    {performers.length > 0 &&
                                        performers.map((performer, index) => {
                                            return (
                                                <div
                                                    onClick={() => selectPerformer(performer)}
                                                    key={performer.id}
                                                    className='flex items-center py-2 pl-1 mb-3 cursor-pointer'
                                                >
                                                    <span className='text-sm font-normal text-black'>{performer.name}</span>
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        )}
                        {displayEventsAndCities && shouldShowEvents && events && events.length > 0 && (
                            <div className='mb-4 border-b border-gray-300'>
                                <div className='mb-2'>
                                    <div className='mb-2 text-base font-semibold text-black'>Events</div>
                                    {events.map((event) => {
                                        return (
                                            <div
                                                onClick={() => selectEvent(event)}
                                                key={event.id}
                                                className='flex items-center py-2 pl-1 mb-3 cursor-pointer'
                                            >
                                                <span className='text-sm font-normal text-black'>{event.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        {displayEventsAndCities && cities && cities.length > 0 && (
                            <div className='mb-4 border-b border-gray-300'>
                                <div className='mb-2'>
                                    <div className='mb-2 text-base font-semibold text-black'>Cities</div>
                                    {cities.length > 0 &&
                                        cities.map((city) => {
                                            return (
                                                <div
                                                    onClick={() => selectCity(city)}
                                                    key={city.id}
                                                    className='flex items-center py-2 pl-1 mb-3 cursor-pointer'
                                                >
                                                    <span className='text-sm font-normal text-black'>{`${city.name}, ${city.state}`}</span>
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        )}
                        {venues && venues.length > 0 && (
                            <div className='border-b border-gray-300'>
                                <div className='mb-2'>
                                    <div className='mb-2 text-base font-semibold text-black'>Venues</div>
                                    {venues.length > 0 &&
                                        venues.map((venue, index) => {
                                            return (
                                                <div
                                                    onClick={() => selectVenue(venue)}
                                                    key={venue.id}
                                                    className='flex items-center py-2 pl-1 mb-3 cursor-pointer'
                                                >
                                                    <span className='text-sm font-normal text-black'>{venue.name}</span>
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        )}
                        {searchRes === 0 &&
                            searchQuery?.length > 0 &&
                            !searchLoading &&
                            (displayRecentTrendingSearch ? (
                                <>
                                    <span className='mt-6 text-sm font-light text-center text-gray-600'>
                                        No results for <strong>{searchQuery}</strong>
                                    </span>
                                    <div className='-ml-16 my-2 bg-gray-500 w-[120vw] h-[1px]' />
                                </>
                            ) : (
                                <div className='mt-8'>
                                    <div className='flex flex-col items-center justify-center w-full'>
                                        <div className='relative overflow-hidden w-36 h-36'>
                                            <Image fill src='https://megaseats-public.s3.amazonaws.com/no_results.svg' alt='No matching' />
                                        </div>
                                        <span className='mt-6 text-sm font-light text-center text-gray-600'>
                                            Press <strong>Enter</strong> to search for <strong>&ldquo;{searchQuery}&ldquo;</strong>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        {displayRecentTrendingSearch && numOfEntities() === 0 && (
                            <>
                                <RecentActivities recentActivities={recentActivities} selectActivity={selectActivity} />
                                <TrendingPerformers trendingPerformers={trendingPerformers} selectActivity={selectActivity} />
                                {/* <RecommendedPerformers isOpen={isOpen} recentSearches={recentlyViewedPerformers} /> */}
                            </>
                        )}
                    </Fragment>
                </div>
            </div>
            {isMobileSearchOpen && (
                <div style={{ zIndex: 999999 }} ref={searchRef} className='fixed inset-0 overflow-y-auto overflow-x-hidden bg-white sm:hidden'>
                    <div className='flex items-center justify-between px-4 py-2'>
                        <div className='relative flex items-center w-full'>
                            <SearchIcon className='absolute w-5 h-5 text-gray-500 left-3 group-focus:text-indigo-600' aria-hidden='true' />
                            <input
                                autoFocus
                                value={searchQuery || ''}
                                onKeyDown={(e) => handleKeyDownSearch(e)}
                                onInput={(e) => handleSearch(e.target.value)}
                                onFocus={() => {
                                    setIsOpen(true)
                                }}
                                className='w-full h-10 pl-10 text-sm font-normal border rounded-lg focus:border-blue-200'
                                type='text'
                                placeholder='Search by artist, team'
                            />
                        </div>
                        <button
                            type='button'
                            className='inline-flex ml-4 font-medium text-gray-700'
                            onClick={() => {
                                setIsMobileSearchOpen(false)
                                setIsOpen(false)
                                document.body.style.overflow = 'auto'
                            }}
                        >
                            <span>Close</span>
                        </button>
                    </div>
                    <div className='p-4 mx-2'>
                        <Fragment>
                            {performers.length > 0 && (
                                <div className='mb-4 border-b border-gray-300'>
                                    <div className='mb-2'>
                                        <div className='mb-2 text-base font-semibold text-black'>Performers</div>
                                        {performers.length > 0 &&
                                            performers.map((performer, index) => {
                                                return (
                                                    <div
                                                        onClick={() => selectPerformer(performer)}
                                                        key={performer.id}
                                                        className='flex items-center py-2 pl-2 mb-1 cursor-pointer'
                                                    >
                                                        <span className='font-normal'>{performer.name}</span>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </div>
                            )}
                            {displayEventsAndCities && shouldShowEvents && events && events.length > 0 && (
                                <div className='mb-4 border-b border-gray-300'>
                                    <div className='mb-2'>
                                        <div className='mb-2 text-base font-semibold text-black'>Events</div>
                                        {events.map((event) => {
                                            return (
                                                <div
                                                    onClick={() => selectPerformer(event)}
                                                    key={event.id}
                                                    className='flex items-center py-2 pl-2 mb-1 cursor-pointer'
                                                >
                                                    <span className='font-normal'>{event.name}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            {displayEventsAndCities && cities && cities.length > 0 && (
                                <div className='mb-4 border-b border-gray-300'>
                                    <div className='mb-2'>
                                        <div className='mb-2 text-base font-semibold text-black'>Cities</div>
                                        {cities.length > 0 &&
                                            cities.map((city) => {
                                                return (
                                                    <div
                                                        onClick={() => selectPerformer(city)}
                                                        key={city.id}
                                                        className='flex items-center py-2 pl-2 mb-1 cursor-pointer'
                                                    >
                                                        <span className='font-normal'>{city.name}</span>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </div>
                            )}
                            {venues.length > 0 && (
                                <div className='border-b border-gray-300'>
                                    <div className='mb-2'>
                                        <div className='mb-2 text-base font-semibold text-black'>Venues</div>
                                        {venues.length > 0 &&
                                            venues.map((venue, index) => {
                                                return (
                                                    <div
                                                        onClick={() => selectVenue(venue)}
                                                        key={venue.id}
                                                        className='flex items-center py-2 pl-2 cursor-pointer'
                                                    >
                                                        <span className='font-normal'>{venue.name}</span>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </div>
                            )}
                            {searchRes === 0 &&
                                searchQuery?.length > 0 &&
                                !searchLoading &&
                                (displayRecentTrendingSearch ? (
                                    <>
                                        <span className='mt-6 text-sm font-light text-center text-gray-600'>
                                            No results for <strong>{searchQuery}</strong>
                                        </span>
                                        <div className='-ml-16 my-2 bg-gray-500 w-[120vw] h-[1px]' />
                                    </>
                                ) : (
                                    <div className='mt-8'>
                                        <div className='flex flex-col items-center justify-center w-full'>
                                            <div className='relative overflow-hidden w-36 h-36'>
                                                <Image fill src='https://megaseats-public.s3.amazonaws.com/no_results.svg' alt='No matching' />
                                            </div>
                                            <span className='mt-6 text-sm font-light text-center text-gray-600'>
                                                Press <strong>Enter</strong> to search for <strong>&ldquo;{searchQuery}&ldquo;</strong>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            {displayRecentTrendingSearch && numOfEntities() === 0 && (
                                <>
                                    <RecentActivities recentActivities={recentActivitiesForMobile} selectActivity={selectActivity} />
                                    <TrendingPerformers trendingPerformers={trendingPerformersForMobile} selectActivity={selectActivity} />
                                </>
                            )}
                        </Fragment>
                    </div>
                </div>
            )}
        </>
    )
}
