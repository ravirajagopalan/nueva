var mockHeaders = jest.fn(() => new Map([['ms-performer-id', '12345']]))
var mockCookies = jest.fn(() => ({ get: () => ({ value: '{}' }) }))
var mockNotFound = jest.fn(() => {
    throw new Error('not found')
})
var mockRevalidateTag = jest.fn()

jest.mock('next/headers', () => ({
    cookies: () => mockCookies(),
    headers: mockHeaders,
}))
jest.mock('next/navigation', () => ({
    notFound: mockNotFound,
}))
jest.mock('next/cache', () => ({
    revalidateTag: mockRevalidateTag,
}))

const performerList = require('../src/data/200_top_performers_by_order_rank.json')
// Create a mock performer from the actual data
const createMockPerformer = (name, id) => ({
    id: id || Math.floor(Math.random() * 10000),
    name,
    description: `Description for ${name}`,
    slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, ''),
})

// Create mock data from the first few performers
const mockPerformers = performerList.slice(0, 199).map((name, index) => createMockPerformer(name, 1000 + index))

// Mock the tn-events-service
jest.mock('tn-events-service', () => ({
    ItemPerformerService: {
        suggest: jest.fn().mockImplementation((query) => {
            // Find performers whose name or slug matches the query
            const results = mockPerformers.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.slug.includes(query.toLowerCase()))
            return Promise.resolve(results)
        }),
        findByIdDetail: jest.fn().mockImplementation((id) => {
            const performer = mockPerformers.find((p) => p.id === id) || mockPerformers[0]
            return Promise.resolve({ detail: performer })
        }),
        findAllById: jest.fn().mockImplementation((ids) => {
            const items = mockPerformers.filter((p) => ids.includes(p.id))
            return Promise.resolve({ items })
        }),
        findEventsDetailed: jest.fn().mockResolvedValue([]),
        findContentById: jest.fn().mockResolvedValue({}),
    },
}))

// Mock the logger
const mockWarn = jest.fn()
const mockError = jest.fn()

jest.mock('../src/utility/Logger', () => ({
    WLog: {
        warn: mockWarn,
        error: mockError,
    },
}))

// Mock getNumberFromString to throw an error to test slug resolution
jest.mock('../src/utility/helperFunctions', () => ({
    ...jest.requireActual('../src/utility/helperFunctions'),
    getNumberFromString: jest.fn().mockImplementation(() => {
        throw new Error('Not a number')
    }),
}))

const performerModule = require('../src/common/performer')
const { ItemPerformerService } = require('tn-events-service')

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks()

    // Reset default mocks
    mockHeaders.mockImplementation(() => new Map())
    mockRevalidateTag.mockImplementation(() => Promise.resolve())

    // Reset logger mocks
    mockWarn.mockClear()
    mockError.mockClear()

    // Reset ItemPerformerService mocks
    ItemPerformerService.suggest.mockReset()
    ItemPerformerService.findByIdDetail.mockReset()
    ItemPerformerService.findAllById.mockReset()
    ItemPerformerService.suggest.mockResolvedValue([]) // Default: no results
    ItemPerformerService.findByIdDetail.mockResolvedValue({
        detail: { id: 123, name: 'Test Performer', description: 'Test Description' },
    })
    ItemPerformerService.findAllById.mockResolvedValue({
        items: [{ id: 123, name: 'Test Performer' }],
    })
})

it('resolves performer_id from suggest(slugBase)', async () => {
    const testPerformer = performerList.find((name) => /[^a-z0-9\s]/i.test(name)) || 'U2'
    const expectedId = 123

    ItemPerformerService.suggest.mockResolvedValueOnce([{ id: expectedId, name: testPerformer }])

    const result = await performerModule.default({ performer: testPerformer })
    expect(result).toBeDefined()
    expect(ItemPerformerService.suggest).toHaveBeenCalledTimes(1)
})

it('resolves performer_id from suggest(deSlug) fallback', async () => {
    const testPerformer = mockPerformers.find((p) => p.name.includes(' '))
    const slug = testPerformer.slug
    const deSlug = testPerformer.name.toLowerCase()
    // First call returns [], second returns the performer
    ItemPerformerService.suggest.mockImplementation(async (query) => {
        if (query === slug) return []
        if (query === deSlug) return [testPerformer]
        return []
    })
    const result = await performerModule.default({ performer: slug })
    expect(result).toBeDefined()
    expect(ItemPerformerService.suggest).toHaveBeenCalledTimes(2)
    expect(ItemPerformerService.suggest).toHaveBeenCalledWith(slug)
    expect(ItemPerformerService.suggest).toHaveBeenCalledWith(deSlug)
})

it('calls notFound if no performer found', async () => {
    const testPerformer = 'nonexistent-performer'
    const deSlug = 'nonexistent performer'
    ItemPerformerService.suggest.mockImplementation(() => Promise.resolve([]))
    await expect(performerModule.default({ performer: testPerformer })).rejects.toThrow('not found')
    expect(ItemPerformerService.suggest).toHaveBeenCalledTimes(2)
    expect(ItemPerformerService.suggest).toHaveBeenNthCalledWith(1, testPerformer)
    expect(ItemPerformerService.suggest).toHaveBeenNthCalledWith(2, deSlug)
    expect(mockNotFound).toHaveBeenCalled()
})

it('strips "-tickets" from performer slug', async () => {
    const testPerformer = mockPerformers[0]

    ItemPerformerService.suggest.mockResolvedValueOnce([testPerformer])

    await performerModule.default({ performer: `${testPerformer.slug}-tickets` })

    expect(ItemPerformerService.suggest).toHaveBeenCalledWith(testPerformer.slug)
})

it('uses ms-performer-id header if present', async () => {
    const performerId = '12345'
    mockHeaders.mockImplementationOnce(() => new Map([['ms-performer-id', performerId]]))
    ItemPerformerService.findByIdDetail.mockResolvedValueOnce({
        detail: { id: parseInt(performerId), name: 'Test Performer' },
    })
    await performerModule.default({ performer: 'Random' })
    expect(ItemPerformerService.suggest).not.toHaveBeenCalled()
    expect(ItemPerformerService.findByIdDetail).toHaveBeenCalledWith(parseInt(performerId), false, `performer-detail-${performerId}`)
})

it('correctly resolves slugs with special characters', async () => {
    const testPerformer = mockPerformers.find((p) => /[^a-z0-9\s]/i.test(p.name)) || mockPerformers[0]
    const slugBase = testPerformer.slug
    const slug = `${slugBase}-tickets`

    ItemPerformerService.suggest.mockImplementation(async (query) => {
        if (query === slugBase) return [testPerformer]
        return []
    })
    ItemPerformerService.findByIdDetail.mockResolvedValue({
        detail: testPerformer,
    })
    mockHeaders.mockImplementation(() => new Map())

    // Store and mock getPerformerDetail if needed
    const originalGetPerformerDetail = performerModule.getPerformerDetail
    try {
        performerModule.getPerformerDetail = jest.fn().mockImplementation(async (id, _customImage, tag) => {
            return ItemPerformerService.findByIdDetail(id, _customImage, tag)
        })

        const result = await performerModule.generatePerformerMetadata(
            slug,
            'https://example.com',
            (detail) => `${detail.name} Tickets`,
            (detail) => `Buy tickets for ${detail.name}`,
            (detail) => `https://example.com/performers/${detail.name.toLowerCase().replace(/ /g, '-')}`,
            true,
        )

        expect(ItemPerformerService.suggest).toHaveBeenCalledWith(slugBase)
        expect(ItemPerformerService.findByIdDetail).toHaveBeenCalledWith(testPerformer.id, false, undefined)
        expect(result).toBeDefined()
        expect(result.title).toBe(`${testPerformer.name} Tickets`)
    } finally {
        performerModule.getPerformerDetail = originalGetPerformerDetail
    }
})
