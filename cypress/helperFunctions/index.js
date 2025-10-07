const isStale = (date) => {
    const now = new Date()
    return date.getTime() < now.getTime()
}

export const api = {
    host: 'https://qf9a5hm84vwldntop-1.a1.typesense.net',
    headers: {
        'x-typesense-api-key': 'tHkA4A0JMICb2pPlOc7UbmnkRZCi2OKE',
        'Content-Type': 'application/json',
    },
}

export const removeStaleEvent = async () => {
    const url = `${api.host}/collections/MockEvent/documents/6359385`
    const options = {
        method: 'DELETE',
        headers: api.headers,
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}

export const createStaleEvent = async () => {
    const url = `${api.host}/collections/MockEvent/documents`
    const options = {
        method: 'POST',
        headers: api.headers,
        body: '{"address":"Moody Center ATX, Austin, TX","average_ticket_price":254.6446,"badges":[{"label":"39 People Viewing Right Now","type":"peopleViewing"}],"child_category":"Rap / Hip Hop","date":"Apr 17","day":"SAT","event_cart_d1":8,"event_id":6359385,"event_local_timestamp":1713355200,"event_mpv_d1":39,"event_name":"Mock Test Event","event_orders_d1":0,"event_orders_d7":2,"event_orders_h1":0,"event_orders_t12":23,"grandchild_category":"-","id":"6359385","lastUpdated":1713335200,"location":[40.6943,-73.9249],"major_category":"Concerts","max_ticket_price":1380,"min_ticket_price":68,"name":"MockTestPerformer","parent_category":"Concerts","performer_id":999999,"performer_ids":[999999],"performer_names":["MockTestPerformer"],"performer_orders_t12":5938,"performers":[{"performer_id":999999,"performer_name":"MockTestPerformer","performer_orders_t12":5938}],"ticket_groups_available":728,"ticket_groups_below_facevalue":44,"ticket_groups_create_count":520,"ticket_groups_update_count":769,"ticket_groups_with_facevalue":667,"tickets_available":3846,"time":"06:00 AM","total_inventory_value":965725.6,"venue_city":"Austin","venue_country_short":"US","venue_id":33,"venue_name":"Madison Square Garden","venue_state_province_short":"NY","venue_street_address1":"New York","venue_time_zone_offset":-4,"venue_zip_code":"10121","year":"2024"}',
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}

export const expectEventToBeStale = (bool) => {
    cy.log('Checking if stale events exist...')
    cy.get('[data-testid="eventDate"]').then((date) => {
        const firstEventDate = new Date(date?.[0].textContent)
        cy.expect(isStale(firstEventDate)).to.be.equal(bool)
    })
}
