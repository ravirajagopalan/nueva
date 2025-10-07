'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { classNames } from '../utility/helperFunctions'
import BreadCrumbs from './BreadCrumbs'

const Links = [
    { tag: 'events', name: 'Events', url: '#events' },
    { tag: 'bio', name: 'Bio', url: '#bio' },
    { tag: 'faq', name: 'FAQs', url: '#faq' },
    { tag: 'history', name: 'History', url: '#history' },
]

export default function Banner({ banner, breadCrumbs, showBio, showFaq, showHistory }) {
    const router = useRouter()
    const [currentTag, setCurrentTag] = useState('events')

    const shouldShowLink = (tag) => {
        switch (tag) {
            case 'faq':
                return showFaq
            case 'bio':
                return showBio
            case 'history':
                return showHistory
            default:
                return true
        }
    }

    const visibleLinks = Links.filter((link) => shouldShowLink(link.tag))

    const handleLinkClick = (link) => {
        setCurrentTag(link.tag)
        router.push(link.url, undefined, { shallow: true })
    }

    const handleImageError = (e) => {
        e.target.remove()
    }

    return (
        <div className='relative overflow-hidden bg-[#111111] -ml-[calc(50vw-50%)] -mr-[calc(50vw-50%)]'>
            <div className='relative flex flex-col items-start justify-start max-w-[1200px] mx-auto h-[420px] lg:h-[500px] blur lg:blur-none'>
                <Image alt='Spotlights on a stage' className='object-cover' fill src={'/banner_home.webp'} />
                {/* <!-- Left gradient --> */}
                <div className='absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#111111] to-transparent'></div>
                {/* <!-- Right gradient --> */}
                <div className='absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#111111] to-transparent'></div>
            </div>
            <div className='absolute inset-0 bg-[#111111]/60'>
                <div className='relative max-w-[1200px] mx-auto flex flex-col lg:flex-row lg:items-center h-full px-2 lg:px-4 py-2'>
                    {breadCrumbs && (
                        <div className='lg:hidden'>
                            <BreadCrumbs breadCrumbs={breadCrumbs} />
                        </div>
                    )}
                    <div className='order-1 lg:order-2 sm:flex-1'>
                        <div className='relative overflow-hidden rounded-md w-[380px] lg:w-[500px] h-[150px] lg:h-[250px]'>
                            <Image
                                fill
                                onError={handleImageError}
                                className='object-cover object-top'
                                src={banner.img}
                                alt={`Image of ${banner.title}`}
                                priority
                            />
                        </div>
                    </div>
                    <div className='sm:flex-1 flex flex-col justify-between lg:justify-center gap-6 h-full order-2 lg:order-1'>
                        <div className='w-full sm:w-4/5'>
                            {breadCrumbs && (
                                <div className='hidden lg:block mb-2'>
                                    <BreadCrumbs breadCrumbs={breadCrumbs} />
                                </div>
                            )}
                            <h1 data-testid='performerTitle' className='text-white text-3xl lg:text-[40px] font-semibold mb-2 line-clamp-2'>
                                {banner.title} <span className='font-light'>Tickets</span>
                            </h1>
                            <h2 className='text-white text-sm lg:text-lg font-light'>
                                <span>
                                    {`No Buyer Fees ${
                                        banner.title.length < 30 ? `on ${banner.title} Tickets` : `on ${banner.title.slice(0, 25)}.. Tickets`
                                    } and Up to 30% Off Compared to Competitors. `}
                                    <Link prefetch={false} href='/page/stubhub-reviews-fees-vs-megaseats-app'>
                                        <span className='font-bold cursor-pointer whitespace-nowrap'>Learn More →</span>
                                    </Link>
                                </span>
                            </h2>
                        </div>
                        <div className='flex gap-10'>
                            {visibleLinks.map((link, index) => (
                                <button onClick={() => handleLinkClick(link)} href={`${link.url}`} key={index}>
                                    <span
                                        className={classNames(
                                            currentTag == link.tag ? 'font-semibold border-b-2 border-white pb-2' : '',
                                            'text-white text-xl',
                                        )}
                                    >
                                        {link.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
