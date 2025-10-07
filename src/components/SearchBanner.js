import Image from 'next/image'
import BreadCrumbs from './BreadCrumbs'
import SearchBannerInput from './SearchBannerInput'

import bannerImage from '../assets/images/banner_home.webp'

export default function SearchBanner({ title, isH1, subTitle, currentQuery, breadCrumbs, SearchInput }) {

    return (
        <div className='relative -ml-[calc(50vw-50%)] -mr-[calc(50vw-50%)] bg-[#111111] h-[301px] sm:h-[336px]'>
            <div className='relative max-w-[1200px] mx-auto'>
                <div className='flex items-center justify-center h-[301px] sm:h-[336px]'>
                    <Image className='object-cover' fill src={bannerImage} alt='Banner Background Image' priority />
                    {/* <!-- Left gradient --> */}
                    <div className='absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#111111] to-transparent'></div>
                    {/* <!-- Right gradient --> */}
                    <div className='absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#111111] to-transparent'></div>
                </div>
                <div className='absolute inset-0 bg-[#111111]/60'>
                    {breadCrumbs && (
                        <div className='pl-4 lg:pt-4'>
                            <BreadCrumbs breadCrumbs={breadCrumbs} />
                        </div>
                    )}
                    <div className='relative flex flex-col items-center justify-center h-full -mt-8'>
                        {title ? (
                            <h1 className='mb-6 text-lg sm:text-3xl text-center text-white font-bold'>{title}</h1>
                        ) : isH1 ? (
                            <h1 className='mb-6 text-lg sm:text-3xl text-center text-white font-bold'>No Buyer Fees. Big Savings. MEGA Fun.</h1>
                        ) : (
                            <p className='mb-6 text-lg sm:text-3xl text-center text-white font-bold'>No Buyer Fees. Big Savings. MEGA Fun.</p>
                        )}
                        <div className='w-11/12 lg:w-9/12 xl:w-2/3 sm:px-8'>
                            <SearchInput currentQuery={currentQuery} CustomUI={SearchBannerInput} />
                        </div>
                        {subTitle && <h2 className='mx-2 mt-4 text-base text-center text-white sm:text-lg sm:mx-0 sm:mt-6'>{subTitle}</h2>}
                    </div>
                </div>
            </div>
        </div>
    )
}
