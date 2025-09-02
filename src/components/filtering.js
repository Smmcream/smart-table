export function initFiltering(elements) {
    const updateIndexes = (indexes) => {
        console.log('Updating indexes:', indexes); 
        
        const sellerSelect = elements.searchBySeller;
        if (sellerSelect && indexes.sellers) {
            const selectedValue = sellerSelect.value;
            sellerSelect.innerHTML = '<option value="">—</option>';
            
            indexes.sellers.forEach(seller => {
                const option = document.createElement('option');
                option.value = seller;
                option.textContent = seller;
                sellerSelect.appendChild(option);
            });
            
            if (selectedValue) {
                sellerSelect.value = selectedValue;
            }
        }
    };

    const applyFiltering = (query, state, action) => {
        if (action?.name === 'clear') {
    const field = action.dataset.field;
    
    if (field === 'total') {
        elements.totalFrom.value = '';
        elements.totalTo.value = '';
    } else {
        const input = elements[`searchBy${field.charAt(0).toUpperCase() + field.slice(1)}`];
        if (input) input.value = '';
    }
    return {};
}

        // Добавляем фильтры в query для сервера
        const filter = {};
        
        // Фильтрация по дате
        if (state.date) {
            filter['date'] = state.date;
        }
        
        // Фильтрация по клиенту
        if (state.customer) {
            filter['customer'] = state.customer;
        }
        
        // Фильтрация по продавцу
        if (state.seller && state.seller !== '—') {
            filter['seller'] = state.seller;
        }
        
        // Фильтрация по диапазону total
        if (state.totalFrom || state.totalTo) {
            if (state.totalFrom) filter['totalFrom'] = parseFloat(state.totalFrom);
            if (state.totalTo) filter['totalTo'] = parseFloat(state.totalTo);
        }

        // Если есть какие-то фильтры, добавляем их в query
        if (Object.keys(filter).length > 0) {
            return {
                ...query,
                filter: filter
            };
        }
        
        // Если фильтров нет, удаляем параметр filter из query
        const { filter: _, ...restQuery } = query;
        return restQuery;
    };

    return { updateIndexes, applyFiltering };
}