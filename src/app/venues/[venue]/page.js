import Venues, { generateVenueMetadata } from '../../../common/venues'

import { getDescription, getTitle } from '../../../utility/helperFunctions'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

const currentDomain = 'https://www.megaseats.com'

export async function generateMetadata({ params: { venue } }) {
    const meta = await generateVenueMetadata(venue, currentDomain, getTitle, getDescription)
    return meta
}

export default async function Handler({ params: { venue } }) {
    return <Venues venue={venue} currentDomain={currentDomain} />
}
