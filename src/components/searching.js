export function initSearching(searchFields) {
    return (query, state) => {
        const term = (state.search || '').trim();
        if (!term) return query;

        return {
            ...query,
            search: term
        };
    };
}