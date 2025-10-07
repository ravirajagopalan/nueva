'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BrokerLicense from './BrokerLicense'

export default function InfoButtons({ performer_id }) {
    const [displayBrokerLicenseButton, setDisplayBrokerLicenseButton] = useState(false)

    const [brokerLicenseOpen, setBrokerLicenseOpen] = useState(false)

    function handleLicenseButton() {
        setBrokerLicenseOpen(true)
    }

    useEffect(() => {
        document.addEventListener('seaticsEventInfoUpdated', function (event) {
            const _brokerLicenses = event.detail.brokerLicenses
            if (_brokerLicenses) {
                setDisplayBrokerLicenseButton(true)
            }
        })
    }, [])

    return (
        <>
            <div className='flex justify-center items-center space-x-2 lg:space-x-4 mx-auto h-10 lg:h-24 px-4 py-2 mt-2 lg:pb-7'>
                <Link
                    className='bg-gray-800 text-white text-center text-xs lg:text-lg py-1 lg:py-3 px-4 lg:px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out'
                    prefetch={false}
                    href={`/performers/${performer_id}`}
                >
                    All Events
                </Link>
                {displayBrokerLicenseButton && (
                    <button
                        onClick={handleLicenseButton}
                        className='bg-gray-800 text-white text-center text-xs lg:text-lg py-1 lg:py-3 px-4 lg:px-6 mr-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out'
                    >
                        More Info
                    </button>
                )}
            </div>

            {brokerLicenseOpen && <BrokerLicense brokerLicenseOpen={brokerLicenseOpen} setBrokerLicenseOpen={setBrokerLicenseOpen} />}
        </>
    )
}
