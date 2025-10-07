const performerList = require('../src/data/200_top_performers_by_order_rank.json');

async function resolvePerformerId(performer, suggest) {
    let slugBase = performer.replace('-tickets', '');
    let retPerformers = await suggest(slugBase);
    if (retPerformers.length > 0) {
        return retPerformers[0].id;
    }
    const deSlug = slugBase.replace(/-/g, ' ');
    const fallbackPerformers = await suggest(deSlug);
    if (fallbackPerformers.length > 0) {
        return fallbackPerformers[0].id;
    }
    throw new Error('not found');
}

describe('Performer slug and deSlug resolution', () => {
    it('returns the same id for slug and deSlug', async () => {
        for (const performer of performerList.slice(0, 200)) {
            const id = Math.floor(Math.random() * 10000);
            const suggest = jest.fn(async (query) => {
                if (query === performer.replace(/ /g, '-') || query === performer.replace(/-/g, ' ')) {
                    return [{ id, name: performer }];
                }
                return [];
            });
            const slug = performer.replace(/ /g, '-');
            const idFromSlug = await resolvePerformerId(slug, suggest);
            const deSlug = performer.replace(/-/g, ' ');
            const idFromDeSlug = await resolvePerformerId(deSlug, suggest);
            expect(idFromSlug).toBe(idFromDeSlug);
        }
    });
});