describe(`Page 200 Tests`, () => {
    const previewUrl = Cypress.env('HEAD_PREVIEW_URL') ?? 'http://localhost:3000'
    it(`Home page`, () => {
        cy.visit(`${previewUrl}`)
    })

    it(`Performer page`, () => {
        cy.visit(`${previewUrl}/performers/hamilton-68098`)
    })

    it(`Venue page`, () => {
        cy.visit(`${previewUrl}/venues/33`)
    })

    it(`Performer at Venue page`, () => {
        cy.visit(`${previewUrl}/performers/68098/venues/madison-square-garden-33`)
    })

    it(`Category page`, () => {
        cy.visit(`${previewUrl}/category/concerts`)
    })
})
