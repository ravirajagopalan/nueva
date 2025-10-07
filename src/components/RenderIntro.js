function DefaultIntro({ intro, venue_name }) {
    return (
        <div id='intro-section' className='py-3'>
            <div className='pt-4 mb-10'>
                <h2 className='text-xl font-semibold mb-1 sm:mb-2'>{`About ${venue_name}`}</h2>
                {intro.split('\n').map((line, i) => (
                    <p key={i} className='text-gray-500 mb-2'>
                        {line}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default function RenderIntro({ CustomComponent, intro, venDetail, ...props }) {
    if (!intro) return

    const venueName = venDetail?.venue_name ?? ' '

    return CustomComponent ? (
        <CustomComponent intro={intro} venue_name={venueName} {...props} />
    ) : (
        <DefaultIntro intro={intro} venue_name={venueName} />
    )
}
