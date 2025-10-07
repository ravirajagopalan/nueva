'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { _slugify, getPerformerImageWithFallback, trackAction } from '../utility/helperFunctions'
/*
    If there are 10 performers, there will be 3 pages
    1 2 3 4 / 5 6 7 8 / 7 8 9 10
    If user moves to or moves back from last page (page 3),
    we need to move extraPerformers x singlePerformerWidth to the left or right (2 * 306)
    else we can simply move translateConstant to the left or right
*/
export default function ItemPerformers({ title, titleHeading, atVenue, performers, showEventsCount }) {
    const [translateX, setTranslateX] = useState(0)
    const translateConstant = 1224
    const singlePerformerWidth = 306
    const extraPerformers = performers.length % 4
    const pages = Math.ceil(performers.length / 4) // notice that this is 1 based
    const [currentPage, setCurrentPage] = useState(1) // notice that this is 1 based
    const [hideLeftArrow, setHideLeftArrow] = useState(true)
    const [hideRightArrow, setHideRightArrow] = useState(pages <= 1)

    const handleLeft = () => {
        setHideRightArrow(false)
        setCurrentPage(currentPage - 1)
        if (currentPage === 2) {
            //if user is going to page 1
            setHideLeftArrow(true)
        }
        if (currentPage == pages) {
            // if user is going left from last page
            if (extraPerformers > 0) {
                setTranslateX(translateX + extraPerformers * singlePerformerWidth) // move only the extra performers
            } else {
                setTranslateX(translateX + translateConstant)
            }
        } else {
            // if user is going left from middle pages
            setTranslateX(translateX + translateConstant)
        }
    }

    const handleRight = () => {
        setHideLeftArrow(false)
        setCurrentPage(currentPage + 1)
        if (currentPage === pages - 1) {
            // if user is going to last page
            setHideRightArrow(true)
            if (extraPerformers > 0) {
                setTranslateX(translateX - extraPerformers * singlePerformerWidth)
            } else {
                setTranslateX(translateX - translateConstant)
            }
        } else {
            setTranslateX(translateX - translateConstant)
        }
    }

    const handleImageError = (e) => {
        e.target.remove() // remove the logo
    }

    const handleClick = (e) => {
        if (title === 'Recently Viewed Performers') {
            trackAction('recently_viewed_performer_clicked')
        }
    }

    return (
        <>
            <div className='mb-10'>
                {/* Title */}
                {title && (
                    <>
                        {titleHeading ? (
                            <h2 className='text-2xl font-extrabold text-[#111111]'>{title}</h2>
                        ) : (
                            <div className='text-2xl font-bold text-[#222222]'>{title}</div>
                        )}
                    </>
                )}

                {/* Performer Cards */}
                <div className='relative mb-10'>
                    <div className='overflow-x-scroll xl:overflow-x-hidden snap-x scrollbar-hide'>
                        <ul
                            className='flex items-start justify-start gap-6 transition-transform duration-300 ease-in-out'
                            style={{ transform: `translateX(${translateX}px)` }}
                        >
                            {atVenue
                                ? performers.map((performer, index) => (
                                      <li className='snap-start max-w-72' key={index}>
                                          <Link
                                              onClick={handleClick}
                                              prefetch={false}
                                              href={`/performers/${_slugify(performer.id, performer.name)}/venues/${_slugify(
                                                  performer.venue_id,
                                                  performer.venue_city,
                                                  performer.venue_name,
                                              )}`}
                                              key={index}
                                              title={`${performer.name} ${performer.venue_city}, ${performer.venue_state_province_short} - ${
                                                  performer.venue_name
                                              } | ${process.env.siteName ? process.env.siteName : 'MegaSeats'}`}
                                              className='w-[300px] lg:w-[282px]'
                                          >
                                              <div className='relative overflow-hidden rounded shadow-md w-[300px] lg:w-[282px] h-[150px]'>
                                                  <div className='absolute inset-0 bg-gray-200 animate-pulse'></div>
                                                  <div className='relative z-10 w-full h-full'>
                                                      <Image
                                                          fill
                                                          onError={handleImageError}
                                                          className='object-cover'
                                                          src={getPerformerImageWithFallback(performer.id)}
                                                          alt={performer.name}
                                                          priority={index < 2}
                                                      />
                                                  </div>
                                              </div>
                                              <h3 className='mt-2 text-base font-semibold text-gray-800 line-clamp-2'>{performer.name} Tickets</h3>
                                              {showEventsCount && (
                                                  <span className='text-sm font-normal text-gray-500 sm:font-medium'>{performer.eventCount}</span>
                                              )}
                                          </Link>
                                      </li>
                                  ))
                                : performers.map((performer, index) => (
                                      <li className='max-w-72' key={index}>
                                          <Link
                                              onClick={handleClick}
                                              title={`${performer.name} Tickets | ${process.env.siteName ? process.env.siteName : 'MegaSeats'}`}
                                              className='w-[300px] lg:w-[282px] snap-start'
                                              prefetch={false}
                                              href={`/performers/${_slugify(performer.id, performer.name)}`}
                                              key={index}
                                          >
                                              <div className='relative overflow-hidden rounded shadow-md w-[300px] lg:w-[282px] h-[150px]'>
                                                  <div className='absolute inset-0 bg-gray-200 animate-pulse'></div>
                                                  <div className='relative z-10 w-full h-full'>
                                                      <Image
                                                          fill
                                                          onError={handleImageError}
                                                          className='object-cover'
                                                          src={getPerformerImageWithFallback(performer.id)}
                                                          alt={performer.name}
                                                          priority={index < 2}
                                                      />
                                                  </div>
                                              </div>

                                              <h3 className='mt-2 text-base font-semibold text-gray-800 line-clamp-2'>{performer.name} Tickets</h3>
                                              {showEventsCount && (
                                                  <span className='text-sm font-normal text-gray-500 sm:font-medium'>{performer.eventCount}</span>
                                              )}
                                          </Link>
                                      </li>
                                  ))}
                        </ul>
                    </div>
                    {!hideLeftArrow && (
                        <button
                            className='hidden xl:flex justify-center items-center absolute -left-5 top-[60px] w-10 h-10 bg-white text-primary rounded-full shadow-md'
                            onClick={handleLeft}
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 256 512' fill='currentColor'>
                                <path d='M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z' />
                            </svg>
                        </button>
                    )}
                    {!hideRightArrow && (
                        <button
                            className='hidden xl:flex justify-center items-center absolute -right-5 top-[60px] w-10 h-10 bg-white text-primary rounded-full shadow-md'
                            onClick={handleRight}
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 256 512' fill='currentColor'>
                                <path d='M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z' />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}