'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { axiosLulu, setAuthorizationHeader } from '../utility/axiosLuluInstance'
import { apihost } from '../utility/helperFunctions'
import { WLog } from '../utility/Logger'

const ItemPerformers = dynamic(() => import('../components/ItemPerformers'))

export default function RecentlyViewSection({ _ItemPerformer }) {
    const [recentlyVisitedPerformers, setRecentlyVisitedPerformers] = useState([])

    useEffect(() => {
        async function getUserTrack() {
            const token = localStorage.getItem('guestToken')
            if (!token) {
                return
            }
            setAuthorizationHeader(token)
            try {
                const response = await axiosLulu.get(`${apihost.honolulu}/CustomerActivity/recent-performers`)
                if (!response?.data?.results?.length) return
                setRecentlyVisitedPerformers(response.data.results)
            } catch (e) {
                WLog.warn(`Could not fetch custoemrs latest performers`, 'RecentlyViewSection', { error: e })
            }
        }
        getUserTrack()
    }, [])
    return (
        <>
            {recentlyVisitedPerformers.length > 0 ? (
                _ItemPerformer ? (
                    <_ItemPerformer
                        performers={recentlyVisitedPerformers}
                        title={'Recently Viewed Performers'}
                        titleHeading={true}
                        showEventsCount={false}
                    />
                ) : (
                    <div className='py-3 max-content-w'>
                        <ItemPerformers
                            performers={recentlyVisitedPerformers}
                            title={'Recently Viewed Performers'}
                            titleHeading={true}
                            showEventsCount={false}
                        />
                    </div>
                )
            ) : null}
        </>
    )
}
