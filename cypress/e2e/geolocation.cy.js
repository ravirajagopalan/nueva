describe(`Geolocation test`, () => {
  const previewUrl = Cypress.env('HEAD_PREVIEW_URL') ?? 'http://localhost:3000'
  const urlToTest = previewUrl + '/performers/hamilton-68098'
  const locationData = {
      address: 'New York, NY, US',
      countryCode: 'US',
      city: 'New York',
      regionCode: 'NY',
      latitude: 40.6943,
      longitude: -73.9249,
      postalCode: '10007',
  }
  const cookieData = encodeURIComponent(JSON.stringify(locationData))

  it(`Should show nearby events with location header only`, () => {
      const options = {
          url: urlToTest,
          headers: {
              'ms-location': JSON.stringify(locationData),
          },
      }
      cy.visit(options)
      cy.contains('Events Nearby').should('be.visible')
      cy.contains('Events Nearby').parent().find('ul').should('exist')
      cy.contains('Events Nearby').parent().find('ul').children().should('have.length.of.at.least', 1)
  })

  it(`Should show nearby events with location cookie only.`, () => {
      cy.setCookie('_location', cookieData)

      cy.visit(urlToTest)
      cy.contains('Events Nearby').should('be.visible')
      cy.contains('Events Nearby').parent().find('ul').should('exist')
      cy.contains('Events Nearby').parent().find('ul').children().should('have.length.of.at.least', 1)
  })

  it(`Should show nearby events with both location header and cookie.`, () => {
      cy.setCookie('_location', cookieData)

      const options = {
          url: urlToTest,
          headers: {
              'ms-location': JSON.stringify(locationData),
          },
      }
      cy.visit(options)
      cy.contains('Events Nearby').should('be.visible')
      cy.contains('Events Nearby').parent().find('ul').should('exist')
      cy.contains('Events Nearby').parent().find('ul').children().should('have.length.of.at.least', 1)
  })

    it(`Shouldn't show nearby events - no location cookie or header`, () => {
        cy.visit(urlToTest)
        cy.contains('Events Nearby').should('not.exist')

    })
})

// Example ms-location:

// {"address":"New York, NY, US","countryCode":"US","city":"New York","regionCode":"NY","latitude":40.6943,"longitude":-73.9249,"postalCode":"10007"}

// Example _location

// %7B%22address%22%3A%22New%20York%2C%20NY%2C%20US%22%2C%22countryCode%22%3A%22US%22%2C%22city%22%3A%22New%20York%22%2C%22regionCode%22%3A%22NY%22%2C%22latitude%22%3A40.6943%2C%22longitude%22%3A-73.9249%2C%22postalCode%22%3A%2210007%22%7D
