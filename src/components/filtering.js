export function initFiltering(elements) {
    const updateIndexes = (indexes) => {
        const sellerSelect = elements.searchBySeller;
        if (sellerSelect) {
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
            return query;
        }

        let searchTerms = [];
        
        // Основной поиск
        if (state.search) searchTerms.push(state.search);
        
        // ПРОСТО ЗНАЧЕНИЯ - сервер сам ищет по всем полям
        if (state.date) searchTerms.push(state.date);
        if (state.customer) searchTerms.push(state.customer);
        if (state.seller) searchTerms.push(state.seller);
        
        // Диапазон total на клиенте
        if (searchTerms.length > 0) {
            return {
                ...query,
                search: searchTerms.join(' ')
            };
        }

        return query;
    };

    return { updateIndexes, applyFiltering };
}