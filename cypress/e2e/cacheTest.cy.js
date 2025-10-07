import { expectEventToBeStale, removeStaleEvent } from '../helperFunctions'

describe('Testing Cache / Revalidation behavior on performer page', () => {
    const previewUrl = Cypress.env('HEAD_PREVIEW_URL') ?? 'http://localhost:3000'
    it('Should properly handle stale events with revalidateTag', async () => {
        cy.task('performEventCreation')

        cy.viewport('macbook-15')
        cy.visit(`${previewUrl}/performers/999999`).then(async () => {
            expectEventToBeStale(true)

            await removeStaleEvent()

            cy.visit(`${previewUrl}/performers/999999`).then(async () => {
                expectEventToBeStale(false)
            })
        })
    })
})
