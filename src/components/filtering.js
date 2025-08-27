export function initFiltering(elements) {
  const updateIndexes = (indexes) => {
    // Здесь заполняются продавцы
    const sellerSelect = elements.searchBySeller;
    if (sellerSelect?.tagName === 'SELECT') {
      const selectedValue = sellerSelect.value;

      sellerSelect.innerHTML = '<option value="">All</option>';
      indexes.sellers.forEach((seller) => {
        const option = new Option(seller, seller);
        sellerSelect.add(option);
      });

      if (selectedValue) {
        sellerSelect.value = selectedValue;
      }
    }
  };

  const applyFiltering = (query, state, action) => {
    // Чистим фильтры через clear, вроде корректно
    if (action?.name === 'clear') {
      const field = action.dataset.field;
      const input =
        elements[field] ||
        action.closest('.filter-group')?.querySelector('input, select');
      if (input) input.value = '';
    }

    // Создаем объект для фильтров
    const filters = {};

    // Проверяем данные фильтра
    Object.keys(elements).forEach((key) => {
      const element = elements[key];
      if (
        element &&
        ['INPUT', 'SELECT'].includes(element.tagName) &&
        element.value
      ) {
        const filterField = element.name;
        filters[filterField] = element.value;
      }
    });

    // Добавляем фильтры к query, если есть
    if (Object.keys(filters).length > 0) {
      return {
        ...query,
        filter: filters,
      };
    }

    return query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}