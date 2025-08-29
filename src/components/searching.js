export function initSearching(searchField) {
    return (query, state, action) => {
        const searchValue = state[searchField] || '';
        if (searchValue.trim()) {
            return { ...query, search: searchValue.trim() };
        }
        return query;
    };
}