// Import the performer list first
const performerList = require('../src/data/200_top_performers_by_order_rank.json')

var mockHeaders = jest.fn(() => new Map()) // Default: no ms-performer-id
var mockNotFound = jest.fn(() => {
    throw new Error('not found')
})
const mockRevalidateTag = jest.fn()

jest.mock('next/headers', () => ({
    headers: mockHeaders,
}))
jest.mock('next/navigation', () => ({
    notFound: mockNotFound,
}))
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

// Import the performer module after mocking
const performerModule = require('../src/common/performer')
const { ItemPerformerService } = require('tn-events-service')

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks()

    // Default: no ms-performer-id header for normal lookup logic
    mockHeaders.mockImplementation(() => new Map())
    mockRevalidateTag.mockImplementation(() => Promise.resolve())

    // Reset logger mocks
    mockWarn.mockClear()
    mockError.mockClear()

    // Reset ItemPerformerService mocks
    ItemPerformerService.suggest.mockReset()
    ItemPerformerService.findByIdDetail.mockReset()
    ItemPerformerService.findAllById.mockReset()
    ItemPerformerService.suggest.mockResolvedValue([])
    ItemPerformerService.findByIdDetail.mockResolvedValue({
        detail: { id: 123, name: 'Test Performer', description: 'Test Description' },
    })
    ItemPerformerService.findAllById.mockResolvedValue({
        items: [{ id: 123, name: 'Test Performer' }],
    })
})

it('generatePerformerMetadata resolves performer_id from suggest', async () => {
    // Find a performer with special characters or use the first one
    const testPerformer = mockPerformers.find((p) => /[^a-z0-9\s]/i.test(p.name)) || mockPerformers[0]
    const slug = `${testPerformer.slug}-tickets`

    // Ensure headers do NOT include ms-performer-id
    mockHeaders.mockImplementation(() => new Map())

    // Mock the suggest to return our test performer
    ItemPerformerService.suggest.mockResolvedValueOnce([testPerformer])

    // Mock findByIdDetail to return the test performer
    ItemPerformerService.findByIdDetail.mockResolvedValue({ detail: testPerformer })

    const result = await performerModule.generatePerformerMetadata(
        slug,
        'https://test.com',
        (detail) => `${detail.name} title`,
        () => 'description',
        (detail) => `https://test.com/performers/${detail.slug}`,
    )

    expect(ItemPerformerService.suggest).toHaveBeenCalledWith(testPerformer.slug)
    expect(result.title).toBe(`${testPerformer.name} title`)
})

it('generatePerformerMetadata falls back to deSlug', async () => {
    const testPerformer = mockPerformers.find((p) => p.name.includes(' ')) || mockPerformers[0]
    const slugBase = testPerformer.slug
    const deSlug = testPerformer.name.toLowerCase()
    const slug = `${slugBase}-tickets`

    // Ensure headers do NOT include ms-performer-id
    mockHeaders.mockImplementation(() => new Map())

    // First call with slug returns empty, second call with deSlug returns the performer
    ItemPerformerService.suggest.mockImplementation(async (query) => {
        if (query === slugBase) {
            return []
        }
        if (query === deSlug) {
            return [testPerformer]
        }
        return []
    })

    // Mock findByIdDetail to return the test performer
    ItemPerformerService.findByIdDetail.mockResolvedValue({ detail: testPerformer })

    const result = await performerModule.generatePerformerMetadata(
        slug,
        'https://test.com',
        (detail) => `${detail.name} title`,
        () => 'description',
        (detail) => `https://test.com/performers/${detail.slug}`,
    )

    expect(ItemPerformerService.suggest).toHaveBeenNthCalledWith(1, slugBase)
    expect(ItemPerformerService.suggest).toHaveBeenNthCalledWith(2, deSlug)
    expect(result.title).toBe(`${testPerformer.name} title`)
})

it('generatePerformerMetadata calls notFound if not found', async () => {
    // Use a non-existent slug
    const slug = 'non-existent-performer-tickets'
    const slugBase = 'non-existent-performer'
    const deSlug = 'non existent performer'

    // Ensure headers do NOT include ms-performer-id
    mockHeaders.mockImplementation(() => new Map())

    // Mock suggest to return empty array for both calls
    ItemPerformerService.suggest.mockImplementation(async () => {
        return []
    })

    await expect(
        performerModule.generatePerformerMetadata(
            slug,
            'https://test.com',
            () => 'title',
            () => 'description',
            () => 'https://test.com/performers/test',
        ),
    ).rejects.toThrow('not found')

    expect(ItemPerformerService.suggest).toHaveBeenNthCalledWith(1, slugBase)
    expect(ItemPerformerService.suggest).toHaveBeenNthCalledWith(2, deSlug)
    expect(mockNotFound).toHaveBeenCalled()
})