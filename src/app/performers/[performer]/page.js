/**
 * breadCrumbsHome is poisonous
 */

import Performers, { generatePerformerMetadata } from '../../../common/performer'
import { getDescription, getTitle } from '../../../utility/helperFunctions'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

const currentDomain = 'https://www.megaseats.com'

export async function generateMetadata(query) {
    const { performer } = query.params
    const { slugIdResolver } = query.searchParams
    const _slugIdResolver = slugIdResolver === 'false' ? false : slugIdResolver

    const metadata = await generatePerformerMetadata(performer, currentDomain, getTitle, getDescription, _slugIdResolver)
    return metadata
}

export default async function Handler(query) {
    const currentDomain = 'https://www.ticketnetwork.com'

    const { performer } = query.params
    const { customContentCollection, revertTitle, breadCrumbsHasPath, urlHasId, slugIdResolver } = query.searchParams

    const _revertTitle = revertTitle === 'true' ? true : revertTitle
    const _breadCrumbsHasPath = breadCrumbsHasPath === 'true' ? true : breadCrumbsHasPath
    const _urlHasId = urlHasId === 'false' ? false : urlHasId
    const _slugIdResolver = slugIdResolver === 'false' ? false : slugIdResolver

    return (
        <Performers
            _customContentCollection={customContentCollection}
            revertTitle={_revertTitle}
            breadCrumbsHasPath={_breadCrumbsHasPath}
            urlHasId={_urlHasId}
            slugIdResolver={_slugIdResolver}
            performer={performer}
            currentDomain={currentDomain}
        />
    )
}
