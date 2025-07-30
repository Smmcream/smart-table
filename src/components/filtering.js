export function initFiltering(elements, indexes) {
    // Заполнение select
    Object.keys(indexes).forEach(name => {
        const select = elements[name];
        select.innerHTML = '<option value="">Все</option>';
        indexes[name].forEach(value => {
            select.append(new Option(value, value));
        });
    });

    return (data, state, action) => {
        if (action?.name === 'clear') {
            const field = action.dataset.field;
            const input = elements[field] || 
                         action.closest('.filter-group')?.querySelector('input, select');
            if (input) input.value = '';
        }

        return data.filter(row => {
            return Object.entries(state).every(([key, value]) => {
                if (!value) return true;
                if (key === 'searchBySeller') return row.seller === value;
                if (key === 'searchByCustomer') return row.customer === value;
                if (key === 'searchByDateFrom') return new Date(row.date) >= new Date(value);
                if (key === 'searchByDateTo') return new Date(row.date) <= new Date(value);
                return true;
            });
        });
    };
}