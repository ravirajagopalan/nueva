import { useCallback, useState } from 'react'
import ActivityImage from './ActivityImage'

export default function RecentActivities({ recentActivities, selectActivity }) {
    const [imageSources, setImageSources] = useState({})
    const [loadedImages, setLoadedImages] = useState({})

    const handleImageLoad = useCallback((id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }))
    }, [])

    const handleImageError = useCallback((id) => {
        setImageSources((prev) => ({
            ...prev,
            [id]: `https://www.ticketnetwork.com/e/expedia-image?performer_id=${id}`,
        }))
        setLoadedImages((prev) => ({ ...prev, [id]: true }))
    }, [])

    function handleKeyDown(activity) {
        selectActivity(activity)
    }

    return (
        <>
            {recentActivities?.length > 0 && (
                <div className='mx-auto bg-white'>
                    <div className='flex items-center bg-white'>
                        <svg
                            viewBox='0 0 24 24'
                            id='_24x24_On_Light_Clock'
                            data-name='24x24/On Light/Clock'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='#000000'
                            className='w-6 h-6'
                        >
                            <path
                                id='Shape'
                                d='M0,9.75A9.75,9.75,0,1,1,9.75,19.5,9.761,9.761,0,0,1,0,9.75Zm1.5,0A8.25,8.25,0,1,0,9.75,1.5,8.259,8.259,0,0,0,1.5,9.75Zm10.375,4.186L9.22,11.281A.754.754,0,0,1,9,10.75V5.55a.75.75,0,0,1,1.5,0v4.889l2.435,2.436a.75.75,0,1,1-1.06,1.06Z'
                                transform='translate(2.25 2.25)'
                                fill='#141124'
                            ></path>
                        </svg>
                        <h2 className='ml-2 text-lg font-semibold text-gray-800'>Recent Activities</h2>
                    </div>
                    <ul className='grid sm:grid-cols-3 bg-white rounded-lg'>
                        {recentActivities.map((activity, index) => {
                            const imageLoaded = loadedImages[activity.entityId]
                            return (
                                <li
                                    key={index}
                                    className='flex items-center py-2 pl-2 pr-4 w-full text-left rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200'
                                    onClick={() => handleKeyDown(activity)}
                                >
                                    <div className='flex items-center'>
                                        {
                                            <ActivityImage
                                                activity={activity}
                                                imageLoaded={imageLoaded}
                                                handleImageLoad={handleImageLoad}
                                                handleImageError={handleImageError}
                                                imageSources={imageSources}
                                            />
                                        }
                                        <span className='pl-2 text-sm font-semibold line-clamp-1'>{activity.name}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </>
    )
}
