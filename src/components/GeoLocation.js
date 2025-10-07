'use client'

import { apihost, classNames } from '../utility/helperFunctions'
import debounce from 'lodash/debounce'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

export default function GeoLocation({ isNoChange, isPerformer }) {
    const [cookies, setCookie, removeCookie] = useCookies(['_location'])
    const [locations, _setLocations] = useState([])
    const [locationCookie, setLocationCookie] = useState('')
    const [enterLocation, setEnterLocation] = useState(false)
    const [isOpenSearch, setIsOpenSearch] = useState(false)

    useEffect(() => {
        setLocationCookie(cookies._location ? cookies._location : '')
    }, [cookies._location])

    async function getLocation(q) {
        if (!q) {
            return
        }
        await fetch(`${apihost.honolulu}/Locations/suggestCity?q=${q}`, {
            headers: {
                'X-Wcid': '26205',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setIsOpenSearch(true)
                _setLocations(data)
            })
    }

    const throttleHandleChange = useCallback(debounce(getLocation, 500), [])

    function handleLocation(e) {
        const q = e.target.value.toLowerCase()
        throttleHandleChange(q)
    }

    async function handleCurrentLocation() {
        setEnterLocation(!enterLocation)
        await fetch(`${apihost.honolulu}/Locations/resolveLocation`, {
            headers: {
                'X-Wcid': '26205',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setLocation(data)
            })
    }

    function setLocation(loc) {
        setEnterLocation(!enterLocation)
        setIsOpenSearch(false)
        setCookie('_location', loc, { path: '/' })
        if (window) {
            window.location.reload()
        }
    }

    return (
        <div
            className={classNames(
                isPerformer ? 'items-start justify-start mt-4 mb-10' : '-translate-y-6 items-center',
                'relative flex flex-col w-full z-10',
            )}
        >
            <div
                onClick={() => setEnterLocation(!enterLocation)}
                className={classNames(
                    isPerformer ? 'py-2 sm:py-4' : 'py-4',
                    'relative w-fit rounded-full px-6 bg-white shadow-lg border border-[#E2E2E2] focus:outline-none',
                )}
            >
                {locationCookie && !isNoChange ? (
                    <p className='text-base text-[#111111] font-semibold w-full text-center m-0'>
                        Events Near <span className='text-primary'>{locationCookie.address}</span>
                    </p>
                ) : (
                    <p className='text-base text-[#111111] font-semibold w-full text-center m-0'>
                        Select Location <span className='text-primary'>(e.g, New York)</span>
                    </p>
                )}
                {enterLocation && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={classNames(
                            isPerformer ? 'top-12' : 'top-16',
                            'absolute block h-content max-h-96 bg-white rounded-lg shadow-lg inset-x-2 p-4 z-50',
                        )}
                    >
                        <div
                            onClick={() => handleCurrentLocation()}
                            className='flex items-center border border-[#E2E2E2] rounded-md p-2 mb-2 group hover:border-primary'
                        >
                            <span className='mr-3 group-hover:text-primary'>
                                <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 512 512' className='w-4 h-4' fill='currentColor'>
                                    <path d='M256 0c17.7 0 32 14.3 32 32V66.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H445.3C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.3C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H66.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z' />
                                </svg>
                            </span>
                            <span className='text-[#111111] text-base group-hover:text-primary'>Use current location</span>
                        </div>
                        {/* Input field for searching location */}
                        <div className='relative'>
                            <input
                                className='w-full h-8 pl-3 border border-[#E2E2E2] rounded-full focus:outline-none'
                                type='text'
                                onInput={(e) => handleLocation(e)}
                                placeholder='Enter a Location'
                            />
                            <div className={classNames(isOpenSearch ? 'block w-content' : 'hidden opacity-0', 'h-auto overflow-y-scroll p-2 z-50')}>
                                <Fragment>
                                    {locations.length > 0 &&
                                        locations.map((location) => (
                                            <div
                                                key={location.postalCode}
                                                onClick={() => setLocation(location)}
                                                className='flex items-center py-1 mb-3 cursor-pointer'
                                            >
                                                <span className='text-sm font-normal'>{location.address}</span>
                                            </div>
                                        ))}
                                </Fragment>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
