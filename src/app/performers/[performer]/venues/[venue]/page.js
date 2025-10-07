import PerformerVenue, { generatePerformerVenueMetadata } from '../../../../../common/performerVenue'

import { getDescription, getTitle } from '../../../../../utility/helperFunctions'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

const currentDomain = 'https://www.megaseats.com'

export async function generateMetadata({ params: { performer, venue } }) {
    const metadata = await generatePerformerVenueMetadata(performer, venue, currentDomain, getTitle, getDescription)
    return metadata
}

export default function Handler({ params: { performer, venue } }) {
    return <PerformerVenue performer={performer} venue={venue} currentDomain={currentDomain} />
}
