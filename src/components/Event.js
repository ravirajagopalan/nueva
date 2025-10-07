import Link from 'next/link'
import Badge from './Badge'

import { _slugify } from '../utility/helperFunctions'

export default function Event({ event, revertTitle }) {
    return (
        <li className='py-4 border-b border-[#EDEDED] group'>
            <a
                href={`/tickets/${_slugify(event.id, event.name, event.address, event.day, event.date)}`}
                title={`${event.name} at ${event.address}, `}
                className='flex justify-between items-start lg:items-center'
            >
                <div className='flex flex-col lg:min-w-[135px] lg:pr-6 mr-4 lg:mr-8 lg:border-r-2 border-dotted border-[#E2E2E2]'>
                    <div className='hidden lg:block text-base text-[#DA183B] font-bold'>
                        <span data-testid='eventDate'>
                            {event.date}, {event.year}
                        </span>
                    </div>
                    <div className='hidden lg:block text-sm text-[#808080] font-normal'>
                        <span>{event.day}</span>
                        <span className='mx-1'>•</span>
                        <span data-testid='eventTime'>{event.time}</span>
                    </div>
                    <div className='lg:hidden flex flex-col justify-center items-center'>
                        <span className='text-[#111111] font-semibold text-xs capitalize leading-3'>{event.date.split(' ')[0]}</span>
                        <span className='text-[#111111] font-semibold text-xl'>{event.date.split(' ')[1]}</span>
                        <span className='text-[#808080] text-[10px] capitalize'>{event.day.toLowerCase()}</span>
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row flex-1 justify-between items-start lg:items-center'>
                    <div className='flex flex-col mb-1 lg:mb-0 lg:w-2/3 xl:w-auto'>
                        {revertTitle ? (
                            <>
                                <span className='text-base text-[#111111] font-bold line-clamp-1'>
                                    <span className='lg:hidden'>{event.time} - </span>
                                    {event.address}
                                </span>
                                <span className='text-sm text-[#808080] line-clamp-1'>{event.name}</span>
                            </>
                        ) : (
                            <>
                                <span className='text-base text-[#111111] font-bold line-clamp-1'>
                                    <span className='lg:hidden'>{event.time} - </span>
                                    {event.name}
                                </span>
                                <span className='text-sm text-[#808080] line-clamp-1'>{event.address}</span>
                            </>
                        )}
                    </div>
                    <div className='flex items-center sm:justify-center justify-start flex-wrap sm:flex-nowrap gap-2 sm:gap-4'>
                        {event.badges &&
                            event.badges.map((badge, index) => {
                                return <Badge key={index} data={badge} />
                            })}
                        <button className='hidden xl:block text-xs text-[#DA193B] font-semibold border border-[#DA193B] py-1.5 px-5 rounded group-hover:bg-primary group-hover:text-white transition ease-in-out duration-300'>
                            Tickets
                        </button>
                    </div>
                </div>
            </a>
        </li>
    )
}
