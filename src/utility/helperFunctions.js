// import { DLog, WLog } from './Logger'
import jwt from 'jsonwebtoken'
import { TypesenseService } from 'tn-events-service'
import { ImageUtils } from './ImageUtils'

var slugify = require('slugify')

export const testPerformerId = '999999'
export const hamiltonPerformerId = '68098'

export const apihost = {
    // For Development
    // holadelagupta: 'https://holadelagupta.ngrok.io/api',
    // holadelagupta_token: 'XLs6tscHO9v7kRgUTFoUALxtopsB9c3DTtD4aywVnvOn2om2OMTSeZDQCFLCpYeO',
    // For Production
    holadelagupta: 'https://holadelagupta-228119.appspot.com/api',
    holadelagupta_token: 'XLs6tscHO9v7kRgUTFoUALxtopsB9c3DTtD4aywVnvOn2om2OMTSeZDQCFLCpYeO',
    honolulu: process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ? 'https://develop.tn-backend.app' : 'https://tn-backend.app',
    dummy: 'https://2000800-dot-ticketnetwork-app-backend.ue.r.appspot.com/api',
}

export const domainConfig = {
    'https://www.megaseats.com': 'MegaSeats',
    'https://www.scorebig.com': 'ScoreBig',
    'https://www.ticketnetwork.com': 'TicketNetwork',
}

export const xWcid = '26205'
// export const datadogClientToken = 'pub4d046a62f51feeb290441c22f3b4ceff'

export const jwtSecret = 'ocEnAnDn8y'

export const defaultLocation = {
    address: `New York, NY, US`,
    countryCode: 'US',
    city: 'New York',
    regionCode: 'NY',
    latitude: 40.6943,
    longitude: -73.9249,
    postalCode: '10007',
}

export const promoDict = {
    HONEYSAVES: 0.9,
    NOFEES5: 0.95,
    NOFEES6: 0.94,
    NOFEES7: 0.93,
    NOFEES8: 0.92,
    NOFEES9: 0.91,
    NOFEES10: 0.9,
    TICKETNEWS: 0.9,
    NOFEES11: 0.89,
    NOFEES12: 0.88,
    NOFEES13: 0.87,
    NOFEES14: 0.86,
    NOFEES15: 0.85,
    FEEFREE14: 0.86,
    FEEFREE15: 0.85,
    NOFEES16: 0.84,
    NOFEES17: 0.83,
    NOFEES18: 0.82,
    NOFEES19: 0.81,
    NOFEES20: 0.8,
    NOFEES40: 0.6,
    CONTINUE16: 0.84,
    CONTINUE14: 0.86,
    SAVE15TODAY: 0.85,
    SAVE15NOW: 0.85,
    NFL2021: 0.85,
    LEAVETHEHOUSE: 0.85,
    SEEYOURFRIENDS: 0.85,
    'GB-NASCAR-NOW': 0.9,
    'GB-BROADWAY-NOW': 0.9,
    'GB-FEST-NOW': 0.9,
    'GB-MLB-NOW': 0.9,
    'GB-MUSIC-NOW': 0.9,
    MOMMYTEN: 0.9,
    KAYAK15: 0.85,
    KAYAK10: 0.9,
    TWEET15: 0.85,
    PAYPALGIVES: 0.85,
    PAYPALMEGA2020: 0.9,
    FAF2019: 0.8,
    ALSD20: 0.8,
}

export function isMobileDevice(userAgent) {
    if (!userAgent) {
        return false
    }
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export function getCurrentMonth() {
    const date = new Date()
    const month = date.toLocaleString('default', { month: 'long' })

    return month
}

export function getCurrentFullYear() {
    const date = new Date()
    const year = date.getFullYear()

    return year
}

export function timeFormat(date) {
    let d = new Date(date)
    let time = d.toLocaleString('default', { timeStyle: 'short' })
    return time
    // return string.replace(/\s/g, "");
}

export function dayFormat(date) {
    let d = new Date(date)
    let day = d.toLocaleString('default', { dateStyle: 'full' })
    return day.substring(0, 3)
}

export function dateFormat(date) {
    let d = new Date(date)
    let day = d.toLocaleString('default', { day: '2-digit' })
    return day
}

export function eventMonthFormat(date) {
    let d = new Date(date)
    let month = d.toLocaleString('default', { month: 'short' })
    return month
}

export function formatFullDateForMapsSlug(date) {
    let d = new Date(date)
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }
    const localeDate = d.toLocaleString('en-US', options)
    const arr = localeDate.split(',')
    let _date = arr[0].split('/').join('-')
    let _time = arr[1].split(':').join('-')

    return _date + _time
}

export function formatFullDate(date) {
    let d = new Date(date)
    const options = {
        timeStyle: 'short',
        dateStyle: 'full',
    }
    const localeDate = d.toLocaleString('en-US', options)

    return localeDate
}

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

export function _slugify(id, ...args) {
    let str = args.join(' ')
    str = str.replace('.', '')
    str = str.replace(':', '-')
    return slugify(`${str.toLowerCase()} ${id}`, '-')
}

export function slugifyPerformerName(performer_name, slug_detail, performer_id) {
    return slugify(`${performer_name.toLowerCase()} ${slug_detail} ${performer_id}`, '-')
}

export function capitalizeEachWord(sentence) {
    const words = sentence.split('-')

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }

    return words.join(' ')
}

export function toTitleCase(str) {
    if (!str) return ''
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

export function isPerformerEvenOrOdd(performer_id) {
    if (performer_id % 2 == 1) {
        return 1 // ODD
    }

    return 0
}

export function venueToSlug(venue) {
    const venue_id = venue.venue_id
    let slug = slugifyPerformerName(venue.venue_name, '', venue_id)
    return slug
}

export function performerToSlug(performer) {
    const performer_id = performer.performer_id

    let canonical_url
    let slug = slugifyPerformerName(performer.performer_name, '', performer_id)
    return `performers/${slug}`
}

export function getCurrentTimeStamp() {
    return Math.floor(Date.now() / 1000)
}

export function getUrlParameter(url, name) {
    try {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
        var results = regex.exec(url)
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
    } catch (e) {
        return null
    }
}

export function searchToSlug(performer) {
    const performer_id = performer.id

    return slugifyPerformerName(performer.name, '', performer_id)
}

export function getNumberFromString(str) {
    const numbers = str.match(/(\d[\d\.]*)/g)
    return numbers.pop()
}

export function replaceBetween(start, end, origin, insertion) {
    return origin.substring(0, start + 1) + insertion + origin.substring(end)
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
export function getBrowserName() {
    /**
     * check for the browser instead
     * if Safari display Apple Pay & Google Pay
     * else only Google Pay
     */

    let userAgent = navigator.userAgent
    let browserName

    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = 'chrome'
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = 'firefox'
    } else if (userAgent.match(/safari/i)) {
        browserName = 'safari'
    } else if (userAgent.match(/opr\//i)) {
        browserName = 'opera'
    } else if (userAgent.match(/edg/i)) {
        browserName = 'edge'
    } else {
        browserName = 'No browser detection'
    }

    return browserName

    // var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // // Windows Phone must come first because its UA also contains "Android"
    // if (/windows phone/i.test(userAgent)) {
    //     return "windows";
    // }

    // if (/android/i.test(userAgent)) {
    //     return "android";
    // }

    // // iOS detection from: http://stackoverflow.com/a/9039885/177710
    // if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    //     return "ios";
    // }

    // return "unknown";
}

export function detectDeviceAndBrowser() {
    // Detect device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isTablet = /iPad/i.test(navigator.userAgent)
    const isDesktop = !isMobile && !isTablet

    // Detect browser
    const userAgent = navigator.userAgent
    const isChrome = /Chrome/i.test(userAgent)
    const isFirefox = /Firefox/i.test(userAgent)
    const isEdge = /Edge/i.test(userAgent)
    const isSafari = /Safari/i.test(userAgent) && !isChrome
    const isIE = /MSIE|Trident/i.test(userAgent)

    // Detect operating system
    const isAppleOS = /(iPhone|iPad|iPod)/.test(userAgent)
    const isNonAppleOS = !isAppleOS

    // Return the detected information
    return {
        isMobile,
        isTablet,
        isDesktop,
        isChrome,
        isFirefox,
        isEdge,
        isSafari,
        isIE,
        isAppleOS,
        isNonAppleOS,
    }
}

export function confirmApplePaySupport() {
    try {
        if (window.ApplePaySession && ApplePaySession.supportsVersion(3) && ApplePaySession.canMakePayments()) {
            // This device supports version 3 of Apple Pay.
            return true
        }
    } catch (error) {
        console.log('Failed to make ApplePay Session')
        return false
    }

    return false
}

/**
 * Convert event time to UTC by given params and compare it with now() then return the result
 * @param {event_local_timestamp} eventTime
 * @param {venue_time_zone_offset} eventTimeZone
 * @returns boolean
 */
export function compareEventLocalTimeWithUTC(eventTime, eventTimeZone) {
    if (!eventTime) {
        // WLog.warn('eventTime is undefined', 'compareEventLocalTimeWithUTC')
    }
    if (!eventTimeZone) {
        // WLog.warn('eventTimeZone is undefined', 'compareEventLocalTimeWithUTC')
    }

    let eventTimeInUTC = (eventTime - eventTimeZone * 3600) * 1000
    const utcTimeStamp = new Date().getTime()

    return eventTimeInUTC < utcTimeStamp
}

/**
 * Check if events date is in the past
 * @param {Event} event
 * @returns boolean
 */
export function isEventStale(event) {
    const conditions = ['T', ':', '-', '+']

    if (!event.detail) {
        // WLog.warn('Event is missing detail property', 'isEventStale', { event: event })
        return false
    }

    // if event venue_time_zone_offset doesn't exist then data is stale (Old version of api)
    if (!('venue_time_zone_offset' in event.detail)) {
        // WLog.warn('venue_time_zone_offset field is not in event detail', 'isEventStale', { eventId: event.id, eventDetail: event.detail })
        return true
    }

    if (!event.detail.event_local_timestamp || !event.detail.venue_time_zone_offset) {
        // WLog.warn('event_local_timestamp or venue_time_zone_offset is undefined or missing', 'isEventStale', { eventDetail: event.detail })
        return false
    }

    const { event_local_timestamp, venue_time_zone_offset } = event.detail
    if (typeof event_local_timestamp == 'string' && conditions.some((c) => event_local_timestamp.includes(c))) {
        // WLog.warn('event_local_timestamp is not in the right format as unixtime', 'isEventStale', { eventLocalTimestamp: event_local_timestamp })
        return false
    }

    return compareEventLocalTimeWithUTC(event_local_timestamp, venue_time_zone_offset)
}

/**
 * Convert lastUpdated to UTC and add 12 hours and compare it with now() then return the result
 * @param {lastUpdated} eventTime
 * @param {venue_time_zone_offset} eventTimeZone
 * @returns boolean
 */
export function compareLastUpdated(eventTime, eventTimeZone) {
    if (!eventTime) {
        // WLog.warn('eventTime is undefined', 'comparePerformerLastUpdated')
    }
    let lastUpdatedInUTC = (eventTime - eventTimeZone * 3600 + 3600) * 1000
    const utcTimeStamp = new Date().getTime()

    return lastUpdatedInUTC < utcTimeStamp
}

/**
 * Checks if performer's lastUpdated value is up to datetime
 * @param {Partial<Detail>} performer
 * @returns boolean
 */
export function isPerformerEventsUpToDate(performer_detail) {
    if (!performer_detail.lastUpdated) {
        // Log a warning if lastUpdated value is missing
        // WLog.warn('lastUpdated value is missing in the performer object', 'isPerformerEventsUpToDate', { performerDetail: performer_detail })
        return false
    }

    const isUpToDate = compareLastUpdated(performer_detail.lastUpdated, -4)

    if (!isUpToDate) {
        // Log an info message if the performer's lastUpdated value is up to date
        // WLog.info('Performer events are up to date.', 'isPerformerEventsUpToDate', { lastUpdated: performer_detail.lastUpdated })
    } else {
        // Log an error if the performer's lastUpdated value is not up to date
        // WLog.warn('Performer events are not up to date', 'isPerformerEventsUpToDate', { lastUpdated: performer_detail.lastUpdated })
    }

    return isUpToDate
}

/**
 * Checks if performer's lastUpdated value is up to datetime
 * @param {Partial<Detail>} performer
 * @returns boolean
 */
export function isVenueEventsUpToDate(venue) {
    if (!venue.detail.lastUpdated) {
        // Log a warning if lastUpdated value is missing
        // WLog.warn('lastUpdated value is missing in the venue object', 'isPerformerEventsUpToDate', { venue })
        return false
    }

    const isUpToDate = compareLastUpdated(venue.detail.lastUpdated, -4)

    if (!isUpToDate) {
        // Log an info message if the performer's lastUpdated value is up to date
        // WLog.info('Venue events are up to date.', 'isPerformerEventsUpToDate', { lastUpdated: venue.detail.lastUpdated })
    } else {
        // Log an error if the performer's lastUpdated value is not up to date
        // WLog.warn('Venue events are not up to date', 'isPerformerEventsUpToDate', { lastUpdated: venue.detail.lastUpdated })
    }

    return isUpToDate
}

export async function getTopPerformers(q, topN = 3, threshold = 0.1) {
    const performerRes = await TypesenseService.typesenseSearch('Performer', {
        q: q,
        query_by: 'performer_name',
        sort_by: '_text_match:desc,order_rank:asc',
        per_page: 10,
    })
    let totalOrders = 0
    let performers = []

    for (const performer of performerRes.hits) {
        totalOrders += performer.document.performer_orders_t12
        performers.push(performer)
    }

    if (performers.length === 0) {
        return []
    }

    performers.sort((a, b) => b.document.performer_orders_t12 - a.document.performer_orders_t12)

    return performers.slice(0, topN).filter((performer) => performer.document.performer_orders_t12 / totalOrders >= threshold)
}

export function formatPriceStringWithCommas(priceString) {
    try {
        const parts = priceString.split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        return parts.join('.')
    } catch (error) {
        // WLog.error('something went wrong formatting price in checkout', 'formatPriceStringWithCommas', { price: priceString, error })
    }

    return priceString
}

export function formatPriceNumberWithCommas(number) {
    if (isNaN(number)) {
        return number
    }

    try {
        const parts = number.toString().split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        return parts.join('.')
    } catch (error) {
        // WLog.error('something went wrong formatting price in checkout', 'formatPriceNumberWithCommas', { price: number, error })
    }

    return number
}

export const trackEntityClick = async (entityType, entityId, token) => {
    const url = `${apihost.honolulu}/CustomerActivity/track`
    const timestamp = new Date().toISOString()

    const payload = {
        entityType,
        entityId,
        timestamp,
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Wcid': '26205',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    }

    try {
        const response = await fetch(url, options)
        if (!response.ok) {
            console.error(`Error: ${response.statusText}`)
        } else {
            console.log('Successfully tracked customer activity.')
        }
    } catch (error) {
        console.error('Failed to track customer activity:', error)
    }
}
export function trackPaymentFailing(type, custom) {
    try {
        if (!custom) {
            custom = 'unknown'
        }
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
            event: `${type}-failed`,
            function: custom,
        })
    } catch (e) {
        // DLog.error('Something went wrong in tracking the payment failing', 'trackPaymentFailing', {
        //     error: e,
        //     trackingType: type,
        //     trackingCustom: custom,
        // })
    }
}

export function trackAction(action, trackingValue = null) {
    try {
        window.dataLayer = window.dataLayer || []
        const payload = { event: action }
        if (trackingValue) {
            payload.trackingValue = trackingValue
        }
        window.dataLayer.push(payload)
    } catch (e) {
        // DLog.error(`Something went wrong while ${action}`, 'trackAction', { error: e })
    }
}

export function trackSetEmail() {
    try {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ event: 'checkout_set_email' })
    } catch (e) {
        // DLog.error('something went wrong tracking setting email', 'trackSetEmail', { error: e })
    }
}

export const trackPurchase = function (total, quantity, type, billingAddress, email, orderDetail) {
    // Initialize default values
    let event_date = ''
    let event_location = ''
    let section = ''
    let row = ''
    let important_notes = ''
    let order_status = ''
    let order_date = ''
    let order_id = ''
    let delivery_method = ''
    let payment_method = ''

    // Iterate through orderDetail to find necessary properties
    try {
        orderDetail.forEach((detail) => {
            switch (detail.entityType) {
                case 'date':
                    event_date = `${detail.data.month} ${detail.data.day}, ${detail.data.time}`
                    break
                case 'header':
                    if (detail.data.title === 'Event Location') {
                        event_location = orderDetail[orderDetail.indexOf(detail) + 1].data.title
                    }
                    break
                case 'row':
                    switch (detail.data.title) {
                        case 'Section':
                            section = detail.data.value
                            break
                        case 'Row':
                            row = detail.data.value
                            break
                        case 'Order Status':
                            order_status = detail.data.value
                            break
                        case 'Order Date':
                            order_date = detail.data.value
                            break
                        case 'Order Id':
                            order_id = detail.data.value
                            break
                    }
                    break
                case 'rowSubtitle':
                    if (detail.data.title === 'Important Notes') {
                        important_notes = detail.data.subtitle
                    }
                    if (detail.data.title === 'eTicket') {
                        delivery_method = detail.data.title
                    }
                    if (detail.data.title === 'Method') {
                        payment_method = detail.data.subtitle
                    }
                    break
            }
        })
    } catch (e) {
        // DLog.error('Something went wrong while iterating order details in tracking the purchase', 'trackPurchase', {
        //     error: e,
        //     total,
        //     quantity,
        //     type,
        //     billingAddress,
        //     email,
        //     orderDetail,
        // })
    }

    try {
        // Initialize dataLayer event
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
            event: 'dataLayer-receipt-initialized',
            event_date: event_date,
            event_location: event_location,
            section: section,
            row: row,
            ticket_quantity: quantity,
            important_notes: important_notes,
            order_status: order_status,
            order_date: order_date,
            order_id: order_id,
            ticket_request_id: order_id,
            order_total: total,
            sale_total: total,
            // Same as sale_total because Shipping should not be allowed
            sale_total_without_shipping: total,
            delivery_method: delivery_method,
            payment_method: payment_method,
            used_payment_method_types: type,
            billing_name: billingAddress.name,
            billing_street_1: billingAddress.address1,
            billing_city: billingAddress.city,
            billing_state: billingAddress.state,
            billing_country: billingAddress.countryCode,
            billing_zip: billingAddress.postalCode,
            billing_phone: billingAddress.phoneNumber,
            website_customer_email: email,
            phet: total * 0.095 * 1000,
        })
    } catch (e) {
        // DLog.error('Something went wrong while tracking the purchase', 'trackPurchase', {
        //     error: e,
        //     total,
        //     quantity,
        //     type,
        //     billingAddress,
        //     email,
        //     orderDetail,
        // })
    }
}

export const trackCartInitiated = function (data, paymentType, event, promo) {
    try {
        window.dataLayer = window.dataLayer || []
        const totalPrice = data.totalPrice.value
        const quantity = data.quantitySelected
        const serviceFeeItem = data.lineItems.find((item) => item.key === 'Service Fee')
        let serviceFee = 0 // default value
        if (serviceFeeItem) {
            serviceFee = parseFloat(serviceFeeItem.value.replace('$', ''))
        }
        window.cart_product_total = totalPrice
        window.cart_wholesale_unit_price = totalPrice
        window.cart_ticket_quantity = quantity
        window.cart_fee_total = serviceFee
        window.cart_sale_total_without_shipping = totalPrice
        window.cart_event_id = event.id
        window.cart_event_datetime = event.detail?.event_local_timestamp
        window.cart_event_category = ''
        window.cart_event_location = `${event.detail?.venue_city}, ${event.detail?.venue_state_province_short}, ${event.detail?.venue_country_short}`
        window.cart_event_name = event.name
        window.cart_ticket_group_id = ticket.id
        window.cart_venue_id = event.detail?.venue_id
        window.cart_venue_name = event.detail?.venue_name
        window.cart_promo_code = promo
        try {
            window.dataLayer.push({
                event: 'checkout_variable_initialized',
                paymentType,
            })
        } catch (e) {
            // DLog.error('Something went wrong while checkout_variable_initialized', 'trackCartInitiated', {
            //     error: e,
            //     data,
            //     paymentType,
            //     event,
            //     promo,
            // })
        }
    } catch (e) {
        // DLog.error('Something went wrong while tracking cart initiated', 'trackCartInitiated', {
        //     error: e,
        //     data,
        //     paymentType,
        //     event,
        //     promo,
        // })
    }
}

export function queryArgProvider(id) {
    return {
        q: '*',
        per_page: 1,
        filter_by: `id:=${id}`,
    }
}

export async function SearchesGet(q, displayEventsAndCities) {
    var queryArgs = [
        {
            q,
            query_by: 'performer_name',
            sort_by: '_text_match:desc,order_rank:asc',
            per_page: displayEventsAndCities ? 5 : 6,
            include_fields: 'performer_id,performer_name',
        },
        {
            q,
            query_by: 'venue_name',
            sort_by: '_text_match:desc,events_available:desc',
            per_page: displayEventsAndCities ? 3 : 6,
            include_fields: 'venue_id,venue_name',
        },
    ]
    if (displayEventsAndCities) {
        queryArgs.push(
            {
                q,
                query_by: 'city,state_name',
                sort_by: '_text_match:desc,population:desc',
                query_by_weights: '5,1',
                per_page: 3,
                include_fields: 'id,city,state_id',
            },
            {
                q,
                query_by: 'event_name,venue_name',
                sort_by: '_text_match:desc,performer_orders_t12:desc,event_local_timestamp:asc',
                per_page: 3,
                include_fields:
                    'event_id,event_name,venue_name,venue_city,venue_country_short,venue_state_province_short,venue_country_short,event_local_timestamp,day,date,address',
            },
        )
    }
    let performers = []
    let venues = []
    let events = []
    let cities = []
    const promises = [
        TypesenseService.typesenseSearch('Performer', queryArgs[0], null, null, true),
        TypesenseService.typesenseSearch('Venue', queryArgs[1], null, null, true),
    ]
    if (displayEventsAndCities) {
        promises.push(
            TypesenseService.typesenseSearch('USCity', queryArgs[2], null, null, true),
            TypesenseService.typesenseSearch('Event', queryArgs[3], null, null, true),
        )
    }
    const formattedData = await Promise.all(promises).then(async function (promiseRes) {
        performers = await TypesenseService.createPerformersFromTypeSenseHits(promiseRes[0].hits)
        venues = TypesenseService.createVenuesFromTypeSenseHits(promiseRes[1].hits)
        if (displayEventsAndCities) {
            events = TypesenseService.createEventsFromTypeSenseHits(promiseRes[3].hits)
            cities = promiseRes[2].hits.map((city) => {
                return {
                    name: city.document.city,
                    state: city.document.state_id,
                    id: city.document.id,
                }
            })
        }
        return {
            performers,
            venues,
            cities,
            events,
        }
    })
    return formattedData
}

export async function jsonpParser(q) {
    let token = ''
    try {
        const currentTimeInSeconds = Math.floor(Date.now() / 1000)
        const payload = { id: 'TICKET_SERVICES', signed: String(currentTimeInSeconds) }
        const secret = jwtSecret.toString('utf-8')
        token = await jwt.sign(payload, secret, { algorithm: 'HS256' })
    } catch (error) {
        console.log('Failed generating jwt token for suggester.showsearcher', error)
    }

    return new Promise((resolve, reject) => {
        try {
            window.suggestions = {
                receive: function (data) {
                    if (data && data.performers) {
                        // Create a new array to store modified performers
                        const modifiedPerformers = data.performers.map((performer) => ({
                            name: performer.text, // Change 'text' to 'name'
                            id: performer.data, // Change 'data' to 'id'
                        }))
                        const modifiedVenues = data.venues.map((venue) => ({
                            name: venue.text, // Change 'text' to 'name'
                            id: venue.data, // Change 'data' to 'id'
                        }))

                        const modifiedData = {
                            performers: modifiedPerformers,
                            venues: modifiedVenues,
                        }
                        resolve(modifiedData)
                    } else {
                        reject(new Error('No performers or Venues data found'))
                    }
                },
            }

            try {
                // Make the API call with the callback function
                var script = document.createElement('script')
                script.src = `https://suggester.showsearcher.com/get-suggestions?t=${token}&query=${q}&callback=suggestions.receive`

                document.getElementsByTagName('head')[0].appendChild(script)
            } catch (error) {
                console.log('Failed on calling suggester.showsearcher', error)
            }
        } catch (e) {
            reject(new Error('Error using suggester showsearcher', e))
        }
    })
}

// Utility function to parse IDs
export function getIdFromInput(input, notFoundCallback) {
    let id = -1

    try {
        id = getNumberFromString(input) // Assuming this function handles string parsing
    } catch (e) {
        console.error('Error parsing ID:', e)
    }

    if (id === -1) {
        console.log('ID was -1', id)
        notFoundCallback()
    }

    return id
}

export function FormatTicketPriceWithCommas(prize) {
    return prize.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export const createTicketDescription = (event, template, hostName) => {
    return template
        .replace(/\$\{event\.name\}/g, event.name)
        .replace(/\$\{event\.address\}/g, event.address)
        .replace(/\$\{event\.day\}/g, event.day)
        .replace(/\$\{event\.time\}/g, event.time)
        .replace(/\$\{hostName\}/g, hostName)
}

//urlTemplate MEGASEATS AND SCOREBIG: '${currentDomain}/tickets/${_slugify(event.id, event.name, event.address, event.day, event.date)}',
//urlTemplate TICKET NETWORK: '${currentDomain}/tickets/${event.id}/${_slugify(event.name, event.address, event.day, event.date)}',
export function slugifyTicketUrl({ venueName, eventName, day, date, yearInNumber }) {
    const url = slugify(`${eventName}-tickets-${day}-${date}-${yearInNumber}-${venueName}`, { lower: true })
    return url
}
export const createUrl = (event, currentDomain) => {
    switch (currentDomain) {
        case 'https://www.ticketnetwork.com':
            return `${currentDomain}/tickets/${event.id}/${slugify(
                `${event.name}-tickets-${event.day}-${event.date}-${event.year}-${event.detail.venue_name}`,
                {
                    lower: true,
                },
            )}`
        default:
            return `${currentDomain}/tickets/${_slugify(event.id, event.name, event.address, event.day, event.date)}`
    }
}

export function structuredDataGenerator(events, image, performer_name, performer_detail, currentDomain, type) {
    const hostName = domainConfig[currentDomain]

    let structuredDataDescriptionTemplate = 'Buy No Fees ${event.name} tickets at ${event.address} on ${event.day} ${event.time} at MegaSeats'

    if (process.env.structuredDataDescriptionTemplate) {
        structuredDataDescriptionTemplate = process.env.structuredDataDescriptionTemplate
    }

    // ? Structured Data Preparation Starts
    let structuredData = {
        events: [],
    }
    let snippet = []

    for (const event of events) {
        try {
            let eventDateISO = ''
            let eventDateStr = ''
            try {
                eventDateISO = new Date(event.detail.event_local_timestamp * 1000).toISOString().split('.')[0]
                eventDateStr = eventDateISO.split('T')[0]
            } catch (e) {}
            let itemPrice = Math.round((event.detail.total_inventory_value / event.detail.tickets_available) * 0.8)
            let performer_parent = ''

            if (type === 'venue') {
                performer_parent = event.detail.parent_category.toUpperCase()
            } else if (type === 'category') {
                performer_parent = event.detail.parent_category.toUpperCase()
            } else {
                performer_parent = performer_detail.parent
            }
            let eventType = 'Event'

            let performerType = ''

            if (performer_parent == 'THEATRE' || performer_parent == 'THEATER') {
                performerType = 'PerformingGroup'
                eventType = 'TheaterEvent'
            } else if (performer_parent == 'CONCERTS') {
                performerType = 'MusicGroup'
                eventType = 'MusicEvent'
            } else if (performer_parent == 'SPORTS') {
                performerType = 'SportsTeam'
                eventType = 'SportsEvent'
            }

            const performerSnippets = []
            if (type === 'venue') {
                for (const performer of event.detail.performers) {
                    performerSnippets.push({
                        name: `${performer.performer_name}`,
                        '@context': 'https://schema.org',
                        '@type': `${performerType}`,
                        image: getPerformerImageWithFallback(performer_detail.performer_id),
                    })
                }
            } else {
                performerSnippets.push({
                    name: `${performer_name}`,
                    '@context': 'https://schema.org',
                    '@type': `${performerType}`,
                    image: getPerformerImageWithFallback(performer_detail?.performer_id),
                })
            }

            snippet.push({
                '@context': 'https://schema.org',
                '@type': `${eventType}`,
                startDate: eventDateISO,
                endDate: eventDateStr,
                eventStatus: 'https://schema.org/EventScheduled',
                name: `${event.name}`,
                description: createTicketDescription(event, structuredDataDescriptionTemplate, hostName),
                image: `${image}`,
                eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                url: createUrl(event, currentDomain),
                location: {
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: `${event.detail.venue_street_address1}`,
                        postalCode: `${event.detail.venue_zip_code}`,
                        addressLocality: `${event.detail.venue_city}`,
                        addressRegion: `${event.detail.venue_state_province_short}`,
                        addressCountry: event.detail.venue_country_short === 'US' ? 'US' : 'Canada',
                    },
                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: `${event.detail.location[0]}`,
                        longitude: `${event.detail.location[1]}`,
                    },
                    '@context': 'https://schema.org',
                    '@type': 'EventVenue',
                    name: `${event.detail.venue_name}`,
                },
                offers: {
                    '@type': 'AggregateOffer',
                    availability: 'https://schema.org/InStock',
                    name: 'Resale',
                    priceCurrency: 'USD',
                    validFrom: eventDateISO,
                    validThrough: eventDateStr,
                    url: createUrl(event, currentDomain),
                    lowPrice: `${itemPrice.toFixed(2)}`,
                    highPrice: `${itemPrice.toFixed(2)}`,
                    price: `${itemPrice.toFixed(2)}`,
                    '@context': 'https://schema.org',
                },
                performer: performerSnippets,
                doorTime: event.time,
            })
        } catch (e) {
            console.log(e)
        }
    }
    if (snippet.length > 0) {
        structuredData.events.push(...snippet)
    }
    return structuredData
}

/**
 * Gets the title of the page based on the object passed.
 * @param {*} object has information about the performer, venue, city and so on.
 * @returns {String} the title of the page.
 */
export function getTitle(object) {
    const titleObjects = [
        {
            properties: ['name', 'date', 'year', 'time', 'venue_name', 'venue_city', 'performer_main'],
            titles: [
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15 | MegaSeats No Fees Tickets`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15 | MegaSeats No Fees Tickets`,
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15 | MegaSeats No Fees Tickets`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15 | MegaSeats No Fees Tickets`,
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15 | No Fees Tickets`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15 | No Fees Tickets`,
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15 | No Fees`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15 | No Fees`,
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo Code NOFEES15`,
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo NOFEES15`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Promo NOFEES15`,
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Code NOFEES15`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use Code NOFEES15`,
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use NOFEES15`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Use NOFEES15`,
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} NOFEES15`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} NOFEES15`,
                `15% Off ${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Tickets`,
                `15% Off ${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Tickets`,
                `${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Tickets`,
                `${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Tickets`,
                `${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Tix`,
                `${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time} Tix`,
                `${object.name} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time}`,
                `${object.performer_main} ${object.venue_name} Tickets ${object.date} ${object.year} ${object.time}`,
            ],
        },
        {
            properties: ['performer_name', 'venue_city', 'venue_name'],
            titles: [
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets - ${object.venue_name} | Use Promo Code NOFEES15 | MegaSeats No Fees Tickets`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets - ${object.venue_name} | Use Promo Code NOFEES15 | No Fees Tickets`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets - ${object.venue_name} | Use Promo Code NOFEES15 | No Fees`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets - ${object.venue_name} | Use Promo Code NOFEES15`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets Use Promo Code NOFEES15 | MegaSeats No Fees Tickets`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets Use Promo Code NOFEES15 | No Fees Tickets`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets Use Promo Code NOFEES15 | No Fees`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets Use Promo Code NOFEES15`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets Use Promo NOFEES15`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets Use Code NOFEES15`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets Use NOFEES15`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets NOFEES15`,
                `15% Off ${object.performer_name} in ${object.venue_city} Tickets`,
            ],
        },
        {
            properties: ['performer_name', 'parent', 'performer_id'],
            titles: [
                `15% Off ${object.performer_name}${
                    object.parent === 'CONCERTS' && object.performer_id % 2 == 0 ? ' Tour ' : ''
                } Tickets Use Promo Code NOFEES15 | MegaSeats No Fees Tickets`,
                `15% Off ${object.performer_name}${
                    object.parent === 'CONCERTS' && object.performer_id % 2 == 0 ? ' Tour ' : ''
                } Tickets Use Promo Code NOFEES15 | No Fees Tickets`,
                `15% Off ${object.performer_name}${
                    object.parent === 'CONCERTS' && object.performer_id % 2 == 0 ? ' Tour ' : ''
                } Tickets Use Promo Code NOFEES15 | No Fees`,
                `15% Off ${object.performer_name}${
                    object.parent === 'CONCERTS' && object.performer_id % 2 == 0 ? ' Tour ' : ''
                } Tickets Use Promo Code NOFEES15`,
                `15% Off ${object.performer_name}${
                    object.parent === 'CONCERTS' && object.performer_id % 2 == 0 ? ' Tour ' : ''
                } Tickets Use Promo NOFEES15`,
                `15% Off ${object.performer_name}${
                    object.parent === 'CONCERTS' && object.performer_id % 2 == 0 ? ' Tour ' : ''
                } Tickets Use Code NOFEES15`,
                `15% Off ${object.performer_name}${
                    object.parent === 'CONCERTS' && object.performer_id % 2 == 0 ? ' Tour ' : ''
                } Tickets Use NOFEES15`,
                `15% Off ${object.performer_name}${object.parent === 'CONCERTS' && object.performer_id % 2 == 0 ? ' Tour ' : ''} Tickets NOFEES15`,
                `15% Off ${object.performer_name}${object.parent === 'CONCERTS' && object.performer_id % 2 == 0 ? ' Tour ' : ''} Tickets`,
                `${object.performer_name} Tickets`,
                `${object.performer_name} Tix`,
                `${object.performer_name}`,
            ],
        },
        {
            properties: ['venue_name', 'venue_city', 'venue_state_long', 'venue_state'],
            titles: [
                `15% Off ${object.venue_name} ${object.venue_city} Tickets & Events Use Promo Code NOFEES15 | MegaSeats No Fees Tickets`,
                `15% Off ${object.venue_name} Tickets & Events Use Promo Code NOFEES15 | MegaSeats No Fees Tickets`,
                `15% Off ${object.venue_name} ${object.venue_city} Tickets & Events Use Promo Code NOFEES15 | No Fees Tickets`,
                `15% Off ${object.venue_name} Tickets & Events Use Promo Code NOFEES15 | No Fees Tickets`,
                `15% Off ${object.venue_name} ${object.venue_city} Tickets & Events Use Promo Code NOFEES15 | No Fees`,
                `15% Off ${object.venue_name} Tickets & Events Use Promo Code NOFEES15 | No Fees`,
                `15% Off ${object.venue_name} ${object.venue_city} Tickets & Events Use Promo Code NOFEES15`,
                `15% Off ${object.venue_name} Tickets & Events Use Promo Code NOFEES15`,
                `15% Off ${object.venue_name} ${object.venue_city} Tickets & Events Use Promo NOFEES15`,
                `15% Off ${object.venue_name} Tickets & Events Use Promo NOFEES15`,
                `15% Off ${object.venue_name} ${object.venue_city} Tickets & Events Use Code NOFEES15`,
                `15% Off ${object.venue_name} Tickets & Events Use Code NOFEES15`,
                `15% Off ${object.venue_name} ${object.venue_city} Tickets & Events Use NOFEES15`,
                `15% Off ${object.venue_name} Tickets & Events Use NOFEES15`,
                `15% Off ${object.venue_name} ${object.venue_city} Tickets & Events NOFEES15`,
                `15% Off ${object.venue_name} Tickets & Events NOFEES15`,
                `15% Off ${object.venue_name} ${object.venue_city} Tickets & Events`,
                `15% Off ${object.venue_name} Tickets & Events`,
                `15% Off ${object.venue_name} ${object.venue_city} Tickets`,
                `15% Off ${object.venue_name} Tickets`,
                `${object.venue_name} Tickets`,
                `${object.venue_name} Tix`,
                `${object.venue_name}`,
            ],
        },
    ]

    for (let titleObject of titleObjects) {
        if (titleObject.properties.every((prop) => object.hasOwnProperty(prop))) {
            for (let title of titleObject.titles) {
                if (title.length < 65) {
                    return title
                }
            }
            return titleObject.titles[titleObject.titles.length - 1]
        }
    }

    throw new Error('Invalid input object')
}

/**
 * Gets the description of the page based on the object passed.
 * @param {*} object has information about the performer, venue, city and so on.
 * @returns description of the page
 */
export function getDescription(object) {
    const descriptionObjects = [
        {
            properties: ['name', 'date', 'year', 'time', 'address', 'venue_name', 'performer_name'],
            descriptions: [
                `Get Cheap ${object.name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF Use Code NOFEES15 100% Guaranteed Tickets with No Fees and Free Shipping`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF Use Code NOFEES15 100% Guaranteed Tickets with No Fees and Free Shipping`,
                `Get Cheap ${object.name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF Use Code NOFEES15 No Fees and Free Shipping`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF Use Code NOFEES15 No Fees and Free Shipping`,
                `Get Cheap ${object.name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF Use Code NOFEES15`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF Use Code NOFEES15`,
                `Get Cheap ${object.name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF Use NOFEES15`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF Use NOFEES15`,
                `Get Cheap ${object.name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF NOFEES15`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} 15% OFF NOFEES15`,
                `Get Cheap ${object.name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} No Fees`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} No Fees`,
                `Get Cheap ${object.name} Tickets - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} No Fees`,
                `Get Cheap ${object.performer_name} Tickets - Limited Time Offer! Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} No Fees`,
                `Get Cheap ${object.name} Tickets Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} No Fees`,
                `Get Cheap ${object.performer_name} Tickets Event happening on ${object.date} ${object.year} ${object.time} at ${object.address} No Fees`,
                `Get ${object.name} Tickets Event happening on ${object.date} ${object.year} ${object.time} at ${object.address}`,
                `Get ${object.performer_name} Tickets Event happening on ${object.date} ${object.year} ${object.time} at ${object.address}`,
                `Get ${object.name} Tickets Event happening on ${object.date} ${object.year} ${object.time} at ${object.venue_name}`,
                `Get ${object.performer_name} Tickets Event happening on ${object.date} ${object.year} ${object.time} at ${object.venue_name}`,
                `Get ${object.name} Tix Event happening on ${object.date} ${object.year} ${object.time} ${object.venue_name}`,
                `Get ${object.performer_name} Tix Event happening on ${object.date} ${object.year} ${object.time} ${object.venue_name}`,
            ],
        },
        {
            properties: ['performer_name', 'venue_city', 'venue_name', 'venue_state_province_short'],
            descriptions: [
                `Get Cheap ${object.performer_name} at ${object.venue_city} Tickets Before They're Gone - Limited Time Offer! At ${object.venue_name} 15% OFF Use Code NOFEES15 - 100% Guaranteed Tickets with No Fees and Free Shipping`,
                `Get Cheap ${object.performer_name} at ${object.venue_city} Tickets Before They're Gone - Limited Time Offer! At ${object.venue_name} 15% OFF Use Code NOFEES15 - No Fees and Free Shipping`,
                `Get Cheap ${object.performer_name} at ${object.venue_city} Tickets Before They're Gone - Limited Time Offer! At ${object.venue_name} 15% OFF Use Code NOFEES15 - No Fees`,
                `Get Cheap ${object.performer_name} at ${object.venue_city} Tickets Before They're Gone - Limited Time Offer! At ${object.venue_name} 15% OFF Use Code NOFEES15`,
                `Get Cheap ${object.performer_name} at ${object.venue_city} Tickets Before They're Gone - Limited Time Offer! At ${object.venue_name} 15% OFF Use NOFEES15`,
                `Get Cheap ${object.performer_name} at ${object.venue_city} Tickets Before They're Gone - Limited Time Offer! At ${object.venue_name} 15% OFF NOFEES15`,
                `Get Cheap ${object.performer_name} at ${object.venue_city} Tickets Before They're Gone - Limited Time Offer! At ${object.venue_name} No Fees`,
                `Get Cheap ${object.performer_name} at ${object.venue_city} Tickets Before They're Gone - Limited Time Offer!`,
                `Get ${object.performer_name} ${object.venue_city} Tickets`,
                `Get ${object.performer_name} ${object.venue_city} Tickets`,
                `Get ${object.performer_name} ${object.venue_city} Tix`,
            ],
        },
        {
            properties: ['performer_name'],
            descriptions: [
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! 15% OFF Use Code NOFEES15 - 100% Guaranteed Tickets with No Fees and Free Shipping`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! 15% OFF Use Code NOFEES15 - No Fees and Free Shipping`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! 15% OFF Use Code NOFEES15 - No Fees`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! 15% OFF Use Code NOFEES15`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! 15% OFF Use NOFEES15`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! 15% OFF NOFEES15`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer! No Fees`,
                `Get Cheap ${object.performer_name} Tickets Before They're Gone - Limited Time Offer!`,
                `Get ${object.performer_name} Tickets`,
                `Get ${object.performer_name} Tickets`,
                `Get ${object.performer_name} Tix`,
            ],
        },
        {
            properties: ['venue_name'],
            descriptions: [
                `Get Cheap ${object.venue_name} Tickets & Events Before They're Gone - Limited Time Offer! 15% OFF Use Code NOFEES15 - 100% Guaranteed Tickets with No Fees and Free Shipping`,
                `Get Cheap ${object.venue_name} Tickets & Events Before They're Gone - Limited Time Offer! 15% OFF Use Code NOFEES15 - No Fees and Free Shipping`,
                `Get Cheap ${object.venue_name} Tickets & Events Before They're Gone - Limited Time Offer! 15% OFF Use Code NOFEES15 - No Fees`,
                `Get Cheap ${object.venue_name} Tickets & Events Before They're Gone - Limited Time Offer! 15% OFF Use Code NOFEES15`,
                `Get Cheap ${object.venue_name} Tickets & Events Before They're Gone - Limited Time Offer! 15% OFF Use NOFEES15`,
                `Get Cheap ${object.venue_name} Tickets & Events Before They're Gone - Limited Time Offer! 15% OFF NOFEES15`,
                `Get Cheap ${object.venue_name} Tickets & Events Before They're Gone - Limited Time Offer! No Fees`,
                `Get Cheap ${object.venue_name} Tickets & Events Before They're Gone - Limited Time Offer!`,
                `Get ${object.venue_name} Tickets & Events`,
                `Get ${object.venue_name} Tickets & Events`,
                `Get ${object.venue_name} Tix & Events`,
                `Get ${object.venue_name} Tix`,
            ],
        },
    ]

    for (let descriptionObj of descriptionObjects) {
        if (descriptionObj.properties.every((prop) => object.hasOwnProperty(prop))) {
            for (let description of descriptionObj.descriptions) {
                if (description.length < 170) {
                    return description
                }
            }
            return descriptionObj.descriptions[descriptionObj.descriptions.length - 1]
        }
    }

    throw new Error('Invalid input object')
}

export function distanceCalc(lat1, lon1, lat2, lon2) {
    const R = 6371

    const toRadians = (degree) => degree * (Math.PI / 180)

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
}

export function getCID(cookies, document) {
    const gbUserId = cookies?.['gb-user-id']
    if (gbUserId) {
        return gbUserId
    }

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const cid = document?.cookie
                ?.match(/_ga=(.+?);/)?.[1]
                ?.split('.')
                ?.slice(-2)
                ?.join('.')

            if (cid) {
                return cid
            }
        }, 20)
    }

    return null
}

function formatImagePath(str) {
    if (!str) {
        return ''
    }
    let targetStr = str
    targetStr = targetStr.toLowerCase().replace(' / ', '-')
    return targetStr
}

export const getPerformerImageWithFallback = (id) => {
    return `https://www.ticketnetwork.com/e/images?performer_id=${id}&use_performer_image=true`
}

export function getCategoryImage(parent, child, grandchild) {
    try {
        const imagePath =
            grandchild && grandchild !== '-'
                ? `${formatImagePath(parent)}/${formatImagePath(child)}/${formatImagePath(grandchild)}`
                : `${formatImagePath(parent)}/${formatImagePath(child)}`
        if (imagePath in ImageUtils) {
            const category_id = ImageUtils[imagePath]
            return `https://ticketnetwork.s3.amazonaws.com/auto-resized/responsive-images/category/${category_id}/${category_id}-1-300x300.jpg`
        } else {
            return ''
        }
    } catch (e) {
        console.log('getCategoryImage: ERROR:', e)
    }
}

// Helper to check if an image exists (returns 200)
export async function getVenueImage(venDetail) {
    const urls = [
        `https://ticketnetwork.s3.amazonaws.com/auto-resized/responsive-images/venue/${venDetail.id}/${venDetail.id}-1200x628.png`,
        `https://scorebig-brand.s3.amazonaws.com/images/venue/${venDetail.id}/${venDetail.id}-1200x1200.jpg`,
    ]
    for (const url of urls) {
        try {
            const res = await fetch(url, { method: 'HEAD' })
            if (res.ok) {
                return url
            }
        } catch (e) {}
    }
    // fallback generic
    return 'https://scorebig-brand.s3.amazonaws.com/images/venue/generic/generic-v1-1200x628.jpg'
}