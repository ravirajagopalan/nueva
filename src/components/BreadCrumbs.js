import { classNames } from '../utility/helperFunctions'
import Link from 'next/link'

export default function BreadCrumbs({ breadCrumbs }) {
    if (!breadCrumbs || breadCrumbs.length <= 0) {
        return
    }

    return (
        <nav className='text-white pb-2'>
            <ol className='flex flex-wrap'>
                {breadCrumbs.map((path, index) => (
                    <li className='flex items-center' key={index}>
                        <Link
                            prefetch={false}
                            href={path.url}
                            className={classNames(
                                index + 1 == breadCrumbs.length && path.name.length > 20 ? 'line-clamp-1' : '',
                                'mr-2 text-2xs sm:text-xs font-semibold uppercase',
                            )}
                        >
                            {path.name}
                        </Link>
                        {index + 1 != breadCrumbs.length && <span className='font-semibold text-2xs sm:text-xs mr-2'>/</span>}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
