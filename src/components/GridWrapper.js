import React from 'react'
export default function GridWrapper({ children, layoutType }) {
    const [leftSlot, rightSlot] = React.Children.toArray(children)

    return (
        <>
            {layoutType === 'two-columns' ? (
                // Two-column layout for TicketNetwork
                <div className='bg-secondary'>
                    <div className='py-3 max-content-w'>
                        <div className='flex items-start justify-between w-full gap-4'>
                            <div className='w-full md:w-2/3'>{leftSlot}</div>
                            <div className='hidden w-1/3 md:flex-col md:flex md:gap-3'>{rightSlot}</div>
                        </div>
                    </div>
                </div>
            ) : (
                // One-column layout for MegaSeats and ScoreBig
                <div>
                    <div>{leftSlot}</div>
                </div>
            )}
        </>
    )
}
