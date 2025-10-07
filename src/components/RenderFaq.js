function DefaulFaq({ venDetail, priceFaq, faq }) {
    return (
        <div id='faq-section' className='pt-4 mb-10'>
            <h2 className='text-xl font-semibold mb-1 sm:mb-2'>{`Frequently Asked Questions About ${venDetail.venue_name} Events`}</h2>
            {priceFaq.map((question, index) => (
                <div
                    itemScope
                    itemType='https://schema.org/Question'
                    itemProp='mainEntity'
                    key={index}
                    className='flex flex-col pt-5 sm:pt-7 items-left lg:w-[60%]'
                >
                    <h3 itemProp='name' className='text-lg font-semibold'>
                        {question.question}
                    </h3>
                    <div itemScope itemType='https://schema.org/Answer' itemProp='acceptedAnswer'>
                        <p itemProp='text' className='text-gray-500'>
                            {question.answer}
                        </p>
                    </div>
                </div>
            ))}
            {faq.map((question, index) => (
                <div
                    itemScope
                    itemType='https://schema.org/Question'
                    itemProp='mainEntity'
                    key={index}
                    className='flex flex-col pt-5 sm:pt-7 items-left lg:w-[60%]'
                >
                    <h3 itemProp='name' className='text-lg font-semibold'>
                        {question.question}
                    </h3>
                    <div itemScope itemType='https://schema.org/Answer' itemProp='acceptedAnswer'>
                        <p itemProp='text' className='text-gray-500'>
                            {question.answer}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function RenderFaq({ CustomComponent, venDetail, priceFaq, faq }) {
    if (!faq || !priceFaq) return

    return CustomComponent ? (
        <CustomComponent venDetail={venDetail} priceFaq={priceFaq} faq={faq} />
    ) : (
        <DefaulFaq faq={faq} priceFaq={priceFaq} venDetail={venDetail} />
    )
}
