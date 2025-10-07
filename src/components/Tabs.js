'use client'

import { Tab } from '@headlessui/react'

import { classNames } from '../utility/helperFunctions'
import Event from './Event'

export default function Tabs({ tabs, title }) {
    return (
        <>
            <div className='mb-10'>
                <h2 className='text-2xl font-extrabold text-[#111111] sm:hidden'>{title}</h2>
                <Tab.Group>
                    <div className='flex flex-col lg:flex-row overflow-scroll scrollbar-hide justify-start items-start lg:items-center gap-2 sm:gap-6'>
                        <h2 className='text-2xl font-extrabold text-[#111111] hidden sm:block'>{title}</h2>
                        <Tab.List className='flex flex-1 items-center justify-start gap-2'>
                            {tabs.map((tab, i) => (
                                <Tab
                                    key={i}
                                    className={({ selected }) =>
                                        classNames(
                                            'w-auto px-4 py-1 rounded-full text-sm focus:outline-none whitespace-nowrap',
                                            selected
                                                ? 'bg-[#DA183B33] text-[#DA183B] font-semibold'
                                                : 'text-[#808080] border border-[#E2E2E2] hover:bg-[#DA183B33] hover:text-[#DA183B] hover:border-[#DA183B33]',
                                        )
                                    }
                                >
                                    {tab.name}
                                </Tab>
                            ))}
                        </Tab.List>
                    </div>
                    <Tab.Panels className='mt-4'>
                        {tabs.map((events, idx) => (
                            <Tab.Panel key={idx}>
                                <ul className=''>
                                    {events.list.map((event, index) => (
                                        <Event event={event} isFeedsEvent={true} key={index} />
                                    ))}
                                </ul>
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </>
    )
}
