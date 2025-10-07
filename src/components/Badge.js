export default function Badge({ data }) {
    const { type, label } = data
    return (
        <>
            {type === 'hotEvent' && (
                <div className='inline-flex items-center rounded-full border border-[#EDEDED] px-2 py-1 text-[10px] font-bold text-[#111111] whitespace-nowrap'>
                    <span className='inline-flex justify-center items-center text-white bg-[#FFA126] rounded-full w-2.5 h-2.5 mr-1'>
                        <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 448 512' fill='currentColor' className='w-1.5 h-1.5'>
                            <path d='M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z' />
                        </svg>
                    </span>
                    <span>{label}</span>
                </div>
            )}
            {type === 'belowFaceValue' && (
                <div className='inline-flex items-center rounded-full border border-[#EDEDED] px-2 py-1 text-[10px] font-bold text-[#111111] whitespace-nowrap'>
                    <span className='inline-flex justify-center items-center text-white bg-[#6ad340] rounded-full w-2.5 h-2.5 mr-1'>
                        <svg fill='currentColor' viewBox='0 0 24 24' className='w-2 h-2' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM8.5,6.5a2,2,0,1,1-2,2A2,2,0,0,1,8.5,6.5Zm.207,10.207a1,1,0,1,1-1.414-1.414l8-8a1,1,0,1,1,1.414,1.414ZM15.5,17.5a2,2,0,1,1,2-2A2,2,0,0,1,15.5,17.5Z' />
                        </svg>
                    </span>
                    <span>{label}</span>
                </div>
            )}
            {type === 'peopleViewing' && (
                <div className='inline-flex items-center rounded-full border border-[#EDEDED] px-2 py-1 text-[10px] font-bold text-[#111111] whitespace-nowrap'>
                    <span className='inline-flex justify-center items-center text-cyan-400 mr-1'>&#9679;</span>
                    <span>{label}</span>
                </div>
            )}
            {type === 'ticketLeft' && (
                <div className='inline-flex items-center rounded-full bg-[#DA183B1D] border border-[#DA183B1D] px-2 py-1 text-[10px] font-bold text-[#111111] whitespace-nowrap'>
                    <span className='inline-flex justify-center items-center text-[#DA183B] mr-1'>&#9679;</span>
                    <span>{label}</span>
                </div>
            )}
        </>
    )
}
