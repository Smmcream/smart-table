export function initSearching(searchFields) {
    return (data, state) => {
        const term = (state.search || '').toLowerCase();
        if (!term) return data;

        return data.filter(row => {
            return searchFields.some(field => {
                const value = String(row[field] || '').toLowerCase();
                return value.includes(term);
            });
        });
    };
}