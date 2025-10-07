import Category, { generateCategoryMetadata } from '../../../common/category'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

const currentDomain = 'https://www.megaseats.com'

export async function generateMetadata({ params: { category } }) {
    const metadata = await generateCategoryMetadata(category, currentDomain)
    return metadata
}

export default function Handler({ params: { category } }) {
    return <Category category={category} />
}
