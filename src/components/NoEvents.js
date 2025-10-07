export default function NoEvents({ title, subTitle }) {
    return (
        <div className='flex flex-col justify-start pb-4'>
            <p className='text-lg lg:text-2xl font-bold text-gray-800'>{title}</p>
            <p className='text-xs lg:text-lg font-medium text-gray-800 mt-2 pl-4'>{subTitle}</p>
        </div>
    )
}
