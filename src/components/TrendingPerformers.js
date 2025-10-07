import Image from 'next/image'
import { useCallback, useState } from 'react'
import { TypesenseService } from 'tn-events-service'

export default function TrendingPerformers({ trendingPerformers, selectActivity }) {
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

    return (
        <>
            {trendingPerformers?.length > 0 && (
                <div className='mx-auto bg-white'>
                    <div className='flex items-center'>
                        <svg className='w-5 h-5 text-gray-500' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'>
                            <path d='M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z' />
                        </svg>
                        <h2 className='text-lg ml-2 font-semibold text-gray-800'>Trending Performers</h2>
                    </div>

                    <div className='grid sm:grid-cols-3'>
                        {trendingPerformers.map((performer) => {
                            const imageLoaded = loadedImages[performer.id]
                            const _performer = {
                                name: performer.performer_name,
                                entityId: performer.id,
                                entityType: 'Performer',
                            }
                            return (
                                <div
                                    key={performer.id}
                                    onClick={() => selectActivity(_performer)}
                                    className='flex items-center py-2 pl-2 pr-4 w-full text-left rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200'
                                >
                                    <div className='relative h-10 min-w-10 rounded-full overflow-hidden'>
                                        {!imageLoaded && (
                                            <div className='absolute inset-0 flex items-center justify-center'>
                                                <div className='w-5 h-5 border-t-[3px] border-[#DA003B] rounded-full animate-spin'></div>
                                            </div>
                                        )}
                                        <Image
                                            src={imageSources[performer.id] || TypesenseService.getPerformerImage(performer.id)}
                                            alt={performer.performer_name}
                                            className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                            onLoad={() => handleImageLoad(performer.id)}
                                            onError={() => handleImageError(performer.id)}
                                            fill
                                            priority
                                            quality={5}
                                        />
                                    </div>
                                    <div className='ml-4'>
                                        <p className='text-gray-800 text-sm font-semibold line-clamp-1'>{performer.performer_name}</p>
                                        <p className='text-xs text-[#707070]'>{performer.events_available} Events</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}
