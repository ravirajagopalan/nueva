import { useEffect, useState } from 'react'
import { TypesenseService } from 'tn-events-service'
import { getCategoryImage } from '../utility/helperFunctions'

function capitalizeFirstLetter(str) {
    return str.toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
}

function extractCategoriesFromString(filterByString) {
    const parts = filterByString.split(' && ')

    const categories = {
        parent: '',
        child: '',
        grandchild: '',
    }

    parts.forEach((part) => {
        const [key, value] = part.split(':=')

        if (key === 'parent') {
            categories.parent = value.trim()
        } else if (key === 'child') {
            categories.child = value.trim()
        } else if (key === 'grandchild') {
            categories.grandchild = value.trim()
        }
    })

    return categories
}

export default function RecommendedPerformers({ isOpen, recentSearches }) {
    const [recommendedPerformers, setRecommendedPerformers] = useState([])

    // Step 1: Find Categories of performers
    async function findPerformerCategories(performerIdString, tag) {
        const queryArg = {
            q: '*',
            filter_by: `id:=[${performerIdString}]`,
            include_fields: 'parent, child, grandchild',
        }

        const performerRes = await TypesenseService.typesenseSearch('Performer', queryArg, tag)
        return performerRes
    }

    // Step 2: Sort the categories
    function extractCategories(performerRes) {
        if (!performerRes) return
        const hits = performerRes.hits
        const countMap = new Map()

        hits.forEach((hit) => {
            let { parent, child, grandchild } = hit.document

            parent = capitalizeFirstLetter(parent)
            child = capitalizeFirstLetter(child)
            grandchild = capitalizeFirstLetter(grandchild)

            const key = `${parent} > ${child} > ${grandchild}`

            if (countMap.has(key)) {
                countMap.set(key, countMap.get(key) + 1)
            } else {
                countMap.set(key, 1)
            }
        })

        const result = Array.from(countMap.entries()).map(([key, count]) => {
            const [parent, child, grandchild] = key.split(' > ')
            return { count, parent, child, grandchild }
        })

        return result
    }

    // Step 3: Get feed arguements
    function createQueryArguments(results) {
        return results.map((item) => {
            let filterBy = `parent:=${item.parent}`

            if (item.child && item.child !== '-') {
                filterBy += ` && child:=${item.child}`
            }

            if (item.grandchild && item.grandchild !== '-') {
                filterBy += ` && grandchild:=${item.grandchild}`
            }

            return {
                queryArguments: {
                    q: '*',
                    per_page: item.count,
                    filter_by: filterBy,
                    sort_by: 'performer_orders_t12:desc',
                    include_fields: 'performer_id, performer_name',
                },
            }
        })
    }

    // Step 4: Find performers by query arguements:
    async function fetchPerformerData(queryArgumentsList) {
        const searchPromises = queryArgumentsList.map(({ queryArguments }) =>
            TypesenseService.typesenseSearch('Performer', queryArguments, queryArguments.filter_by.trim()),
        )

        const results = await Promise.all(searchPromises)

        return results
    }

    function processPerformerResults(results, queryArgumentsList) {
        const unifiedResults = []
        const uniquePerformerIds = new Set()
        results.forEach((performerRes, index) => {
            const { queryArguments } = queryArgumentsList[index]
            const extractedCategories = extractCategoriesFromString(queryArguments.filter_by)

            const categoryPathPicture = getCategoryImage(
                extractedCategories.parent.toLocaleLowerCase() || '-',
                extractedCategories.child.toLocaleLowerCase() || '-',
                extractedCategories.grandchild.toLocaleLowerCase() || '-',
            )

            performerRes.hits.forEach((hit) => {
                const { performer_id, performer_name } = hit.document

                if (!uniquePerformerIds.has(performer_id)) {
                    uniquePerformerIds.add(performer_id)

                    unifiedResults.push({
                        id: performer_id,
                        name: performer_name,
                        pathPicture: TypesenseService.getPerformerImage(performer_id),
                        categoryPathPicture: categoryPathPicture,
                    })
                }
            })
        })

        return unifiedResults
    }

    async function Main() {
        if (!recentSearches) return
        try {
            const performerIdString = recentSearches.map((performer) => performer.id).join(',')
            const tag = `search-recommended-${performerIdString}`

            const performerRes = await findPerformerCategories(performerIdString, tag)
            const results = extractCategories(performerRes)
            const arguements = createQueryArguments(results)
            const performerData = await fetchPerformerData(arguements)
            const suggestedPerformers = processPerformerResults(performerData, arguements)
            setRecommendedPerformers(suggestedPerformers)
        } catch (e) {
            console.log('ERROR WHILE GETTING SUGGESTIONS:', e)
        }
    }

    useEffect(() => {
        if (!isOpen) return
        Main()
    }, [isOpen])

    return (
        <>
            {recommendedPerformers.length > 0 && (
                <div className='mx-auto mt-4 bg-white'>
                    <div className='flex items-center'>
                        <svg className='w-6 h-6 text-gray-500' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'>
                            <path d='M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z' />
                        </svg>
                        <h2 className='text-lg ml-2 font-semibold text-gray-800'>Recommended For You!</h2>
                    </div>

                    <div className='grid grid-cols-2 py-2'>
                        {recommendedPerformers.map((performer) => {
                            return (
                                <div
                                    key={performer.id}
                                    onClick={() => selectPerformer(performer)}
                                    className='flex items-center py-2 px-4 w-full text-left border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200'
                                >
                                    {/* <PerformerPicture performer={performer} /> TODO: Use the same fallback mechanism as other components. */}
                                    <div className='ml-4'>
                                        <p className='text-gray-800 font-black'>{performer.name}</p>
                                        <p className='text-sm text-gray-600'>{performer.eventCount}</p>
                                        {performer.minPrice && <p className='text-sm text-gray-600'>From ${performer.minPrice}</p>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}
