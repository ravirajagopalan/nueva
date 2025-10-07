import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

export default function BrokerLicense({ brokerLicenseOpen, setBrokerLicenseOpen }) {
    const brokerLicenses = window.Seatics.eventInfo.brokerLicenses || ['SOMETHING WENT WRONG']
    return (
        <>
            <Transition appear show={brokerLicenseOpen} as={Fragment}>
                <Dialog as='div' className='relative' style={{ zIndex: 100001 }} onClose={() => setBrokerLicenseOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black bg-opacity-25' />
                    </Transition.Child>

                    <div className='fixed inset-0 overflow-y-auto'>
                        <div className='flex min-h-full items-center justify-center p-4 text-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-t-lg bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                    {/* Dialog Title within a contrasting background for readability */}
                                    <div className='absolute top-0 left-0 right-0 bg-black px-4 py-2 flex items-center justify-between'>
                                        <Dialog.Title as='h3' className='text-center text-lg font-bold text-white'>
                                            Seller Licenses
                                        </Dialog.Title>
                                        <button
                                            type='button'
                                            className='rounded-md text-white focus:outline-none'
                                            onClick={() => setBrokerLicenseOpen(false)}
                                        >
                                            <XIcon className='h-6 w-6' aria-hidden='true' />
                                        </button>
                                    </div>
                                    {/* Table to display broker license details */}
                                    <div className='mt-6'>
                                        <div className='overflow-x-auto'>
                                            <table className='w-full text-sm text-left text-gray-500'>
                                                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                                                    <tr>
                                                        <th scope='col' className='px-6 py-3'>
                                                            License Numbers
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {brokerLicenses.map((license, index) => (
                                                        <tr key={index} className='bg-white border-b'>
                                                            <td className='px-6 py-4'>{license}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
