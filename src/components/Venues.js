import { _slugify } from '../utility/helperFunctions'

import isEmpty from 'lodash/isEmpty'
import Link from 'next/link'

export default function Venues({ title, venues, linksToPerformerVenues, titleHeading }) {
    return (
        <>
            <div className='mb-10'>
                {title && (
                    <>
                        {titleHeading ? (
                            <h2 className='text-2xl font-extrabold text-[#111111]'>{title}</h2>
                        ) : (
                            <div className='text-2xl font-bold text-[#222222]'>{title}</div>
                        )}
                    </>
                )}
                {!isEmpty(venues) && (
                    // flex justify-start items-start snap-x overflow-x-scroll overflow-y-visible gap-6 scrollbar-hide py-4
                    <ul className='lg:grid grid-cols-4 flex items-start justify-start gap-6 overflow-x-scroll sm:overflow-x-auto overflow-y-visible sm:overflow-y-auto snap-x scrollbar-hide'>
                        {venues.map((venue, index) => (
                            <li className='bg-white snap-start border border-[#EAEAEA] rounded-md p-3.5' key={index}>
                                {linksToPerformerVenues ? (
                                    <Link
                                        title={`${venue.performer_name} ${venue.venue_city}, ${venue.venue_state_province_short} - ${venue.venue_name}`}
                                        prefetch={false}
                                        href={`/performers/${_slugify(venue.performer_id, venue.performer_name)}/venues/${_slugify(
                                            venue.venue_id,
                                            venue.venue_city,
                                            venue.venue_name,
                                        )}`}
                                    >
                                        <p className='text-base font-semibold text-[#111111] w-60 lg:w-52 xl:w-64 2xl:w-72 line-clamp-1'>
                                            {venue.venue_name}
                                        </p>
                                        <span className='text-sm font-normal text-[#808080] sm:font-medium'>
                                            {venue.venue_city}, {venue.venue_state_province_short}
                                        </span>
                                    </Link>
                                ) : (
                                    <Link
                                        title={`Events in ${venue.name} | MegaSeats`}
                                        prefetch={false}
                                        href={`/venues/${_slugify(venue.id, venue.name)}`}
                                        key={index}
                                    >
                                        <p className='text-base font-semibold text-[#111111] w-60 lg:w-52 xl:w-64 2xl:w-72 line-clamp-1'>
                                            {venue.name}
                                        </p>
                                        <span className='text-sm font-normal text-[#808080] sm:font-medium'>{venue.address}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}
