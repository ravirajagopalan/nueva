# Performer Module Test Suite

This document provides detailed documentation for the Performer module test suite. The test suite verifies the functionality of the Performer module, focusing on slug resolution, ID lookup, and metadata generation.

## Table of Contents
- [Test Setup](#test-setup)
- [Test Cases](#test-cases)
- [Mock Data](#mock-data)
- [Test Utilities](#test-utilities)
- [Running Tests](#running-tests)

## Test Setup

The test suite uses Jest as the testing framework and includes the following mocks:

- `next/headers` - Mocks for handling HTTP headers and cookies
- `next/navigation` - Mocks for navigation functionality
- `next/cache` - Mocks for caching functionality
- `tn-events-service` - Mocks for the ItemPerformerService
- Custom logger - Mocks for logging functionality

## Test Cases

### 1. Performer Slug and ID Resolution

Tests the core functionality of resolving performer IDs from slugs and deslugged names.

**Test Cases:**
- `returns the same id for slug and deSlug` - Verifies consistent ID resolution for both slug and deslugged formats
- `resolves performer_id from suggest(slugBase)` - Tests direct slug-based lookup
- `resolves performer_id from suggest(deSlug) fallback` - Tests fallback to deslugged name when direct lookup fails
- `calls notFound if no performer found` - Verifies proper error handling when no performer is found

### 2. Slug Processing

Tests the handling of different slug formats and edge cases.

**Test Cases:**
- `strips "-tickets" from performer slug` - Ensures proper handling of common URL patterns
- `falls back to deSlug if slugBase fails` - Verifies fallback mechanism works as expected

### 3. Header-based Resolution

Tests the resolution of performer IDs from HTTP headers.

**Test Cases:**
- `uses ms-performer-id header if present` - Verifies header-based resolution takes precedence

### 4. Metadata Generation

Tests the generation of performer metadata.

**Test Cases:**
- `generatePerformerMetadata resolves performer_id from suggest` - Tests basic metadata generation
- `generatePerformerMetadata falls back to deSlug` - Tests fallback mechanism in metadata generation
- `generatePerformerMetadata calls notFound if not found` - Tests error handling in metadata generation
- `correctly resolves slugs with special characters` - Verifies handling of special characters in slugs

## Mock Data

The test suite uses a set of mock performers with the following structure:

```javascript
{
  id: number,          // Unique identifier
  name: string,        // Performer name
  description: string, // Performer description
  slug: string         // URL-friendly slug
}
```

## Test Utilities

### `createMockPerformer(name, id)`
Creates a mock performer object with the given name and ID.

### `resolvePerformerId(performer, suggest)`
Helper function for testing slug resolution.

### Mock Implementations

- `ItemPerformerService.suggest` - Mocks the suggestion service
- `ItemPerformerService.findByIdDetail` - Mocks the performer detail lookup
- `ItemPerformerService.findAllById` - Mocks batch performer lookup
- `ItemPerformerService.findEventsDetailed` - Mocks event lookup
- `ItemPerformerService.findContentById` - Mocks content lookup

## Running Tests

To run the test suite:

```bash
npm run test:unit
```

To run a specific test file:

```bash
npm test src/common/performer.logic.test.js
npm test src/common/performer.metadata.test.js
npm test src/common/performer.slug.test.js
```

To run tests with coverage, use the following command:

```bash
npx jest --coverage
```

This will generate a coverage report showing which parts of your code are covered by tests.
## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on the state from other tests.
2. **Clear Assertions**: Each test should have clear, specific assertions.
3. **Descriptive Names**: Test names should clearly describe what is being tested.
4. **Mock Data**: Use the provided mock data utilities to ensure consistency.
5. **Error Cases**: Always test both success and error scenarios.

## Maintenance

When modifying the Performer module:
1. Update relevant test cases
2. Add new test cases for new functionality
3. Ensure all tests pass before merging changes
4. Update this documentation if the test structure changes significantly
