import Image from 'next/image'
import { TypesenseService } from 'tn-events-service'
import StadiumSvg from './StadiumSvg'

const ActivityImage = ({ activity, imageLoaded, handleImageLoad, handleImageError, imageSources }) => {
    switch (activity.entityType) {
        case 'Performer':
            return (
                <div className='relative min-w-10 h-10 mr-2 rounded-full overflow-hidden'>
                    {!imageLoaded && (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-5 h-5 border-t-[3px] border-[#DA003B] rounded-full animate-spin'></div>
                        </div>
                    )}
                    <Image
                        src={imageSources[activity.entityId] || TypesenseService.getPerformerImage(activity.entityId)}
                        alt={`${activity.name} Image`}
                        className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => handleImageLoad(activity.entityId)}
                        onError={() => handleImageError(activity.entityId)}
                        fill
                        priority
                        quality={5}
                    />
                </div>
            )
        case 'Venue':
            return (
                <div className='relative min-w-10 h-10 mr-2 rounded-full overflow-hidden flex items-center justify-center'>
                    <StadiumSvg />
                </div>
            )
        case 'Event':
            return activity?.date && activity.date?.split(' ').length === 2 ? (
                <div className='relative min-w-10 h-10 mr-2 rounded-full overflow-hidden flex flex-col items-center justify-center border border-gray-300'>
                    <div className='absolute top-0 left-0 right-0 h-1/2 bg-gray-200'></div>
                    <div className='relative z-10 text-xs text-gray-500'>{activity.date.split(' ')[0]}</div>
                    <div className='relative z-10 text-xs'>{activity.date.split(' ')[1]}</div>
                </div>
            ) : (
                <div className='relative min-w-10 h-10 mr-2 rounded-full overflow-hidden'>
                    {!imageLoaded && (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-5 h-5 border-t-[3px] border-[#DA003B] rounded-full animate-spin'></div>
                        </div>
                    )}
                    <Image
                        src={`https://www.ticketnetwork.com/e/expedia-image?event_id=${activity.entityId}`}
                        alt={`${activity.name} Image`}
                        onLoad={() => handleImageLoad(activity.entityId)}
                        className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        fill
                    />
                </div>
            )
        default:
            return null
    }
}

export default ActivityImage
