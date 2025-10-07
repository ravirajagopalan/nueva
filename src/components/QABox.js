export default function QABox({ data }) {
    if (!data) return
    return (
        <div id='venue-tip' className='max-content-w'>
            {/**DESKTOP */}
            <div
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '4rem',
                    maxWidth: '800px',
                    marginBottom: '2rem',
                }}
                className='hidden lg:flex flex-col items-center px-4 py-3 shadow-md border rounded-lg'
            >
                <h2 className='text-black text-lg font-bold mb-2 text-center leading-tight'>{data[0]}</h2>
                <p className='text-black text-sm font-medium text-center leading-tight'>{data[1]} </p>
            </div>
            {/**MOBILE */}
            <div className='flex flex-col lg:hidden px-4 py-4 shadow-md border rounded-lg'>
                <h2 className='text-black text-xs font-bold mb-2 text-start leading-tight'>{data[0]}</h2>
                <p className='text-black text-[10px] font-medium text-start leading-tight'>{data[1]} </p>
            </div>
        </div>
    )
}
