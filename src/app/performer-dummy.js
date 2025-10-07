import { revalidateTag } from 'next/cache'
import { ItemPerformerService } from 'tn-events-service'

export default async function PerformerDummyMonkey({ performer }) {
    const data = await ItemPerformerService.findDummyEventsDetailed(performer, null, null, null, 2, 2, performer)
    console.log(data)

    if (data.cache === 'revalidate') {
        revalidateTag(data.tag);
    }

    return (
        <>
            <p>Hello {performer} {JSON.stringify(data)}</p>
        </>
    )
}
