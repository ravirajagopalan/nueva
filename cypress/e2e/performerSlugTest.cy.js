describe('Performers Page Tests', () => {
    const previewUrl = Cypress.env('HEAD_PREVIEW_URL') ?? 'http://localhost:3000'

    const performers = [
        { name: 'Taylor Swift', slug: 'taylor-swift', id: '17393' },
        { name: 'Maroon 5', slug: 'maroon-5', id: '627' },
        { name: '3 Doors Down', slug: '3-doors-down', id: '2' },
        { name: 'Sum 41', slug: 'sum-41', id: '983' },
        { name: 'Five Finger Death Punch', slug: 'five-finger-death-punch', id: '23663' },
    ]

    // Testing with slugResolver set to false
    describe('With slugIdResolver=false', () => {
        performers.forEach(({ name, slug }) => {
            it(`Navigates to the ${name} Performer page with slugIdResolver=false and checks for the title`, () => {
                cy.visit(`${previewUrl}/performers/${slug}-tickets?slugIdResolver=false`)
                cy.get('[data-testid=performerTitle]').should('contain', name)
            })
        })
    })

    // Testing without slugResolver in the query parameters
    describe('Without slugResolver in the query', () => {
        performers.forEach(({ name, slug, id }) => {
            it(`Navigates to the ${name} Performer page without slugIdResolver and checks for the title`, () => {
                cy.visit(`${previewUrl}/performers/${slug}-${id}`)
                cy.get('[data-testid=performerTitle]').should('contain', name)
            })
        })
    })
})
