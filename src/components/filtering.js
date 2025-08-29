export function initFiltering(elements) {
    const updateIndexes = (indexes) => {
        const sellerSelect = elements.searchBySeller;
        if (sellerSelect?.tagName === 'SELECT') {
            // Сохраняем выбранное значение продавца, чтобы не потерять его при обновлении
            const selectedValue = sellerSelect.value;
            
            // Очищаем список и добавляем пустую опцию (чтобы можно было выбрать "ничего")
            sellerSelect.innerHTML = '<option value="">—</option>';
            
            // Добавляем всех продавцов в список
            indexes.sellers.forEach(seller => {
                const option = document.createElement('option');
                option.value = seller;
                option.textContent = seller;
                sellerSelect.appendChild(option);
            });
            
            // Восстанавливаем выбранное значение, если оно было
            if (selectedValue) {
                sellerSelect.value = selectedValue;
            }
        }
    };

    const applyFiltering = (query, state, action) => {
        if (action?.name === 'clear') {
            const field = action.dataset.field; 
            const input = elements[`searchBy${field.charAt(0).toUpperCase() + field.slice(1)}`]; // Находим нужный input
            if (input) {
                input.value = '';
                // Если очищается диапазон по total, очищаем оба поля
                if (field === 'total') {
                    elements.totalFrom.value = '';
                    elements.totalTo.value = '';
                }
            }
            return query;
        }

        // Собираем все поисковые слова и/или фразы
        let searchTerms = [];
        
        // Добавляем основной поисковый запрос, если есть
        if (state.search) {
            searchTerms.push(state.search);
        }
        
        // Добавляем фильтры по дате, клиенту, селлеру и тотал
        if (elements.searchByDate?.value) searchTerms.push(elements.searchByDate.value);
        if (elements.searchByCustomer?.value) searchTerms.push(elements.searchByCustomer.value);
        if (elements.searchBySeller?.value) searchTerms.push(elements.searchBySeller.value);
        if (elements.totalFrom?.value) searchTerms.push(`>=${elements.totalFrom.value}`);
        if (elements.totalTo?.value) searchTerms.push(`<=${elements.totalTo.value}`);

        // Объединяем все фильтры в одну строку поиска
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