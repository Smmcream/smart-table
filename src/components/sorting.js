import { sortMap } from "../lib/utils.js";

export const initSorting = (columns) => {
    return (query, state, action) => {
        let field = null;
        let order = 'none';

        // Обрабатываем сортировку
        if (action?.name === 'sort' && action?.dataset?.field) {
            const currentValue = action.dataset.value || 'none';
            const nextValue = sortMap[currentValue];

            action.dataset.value = nextValue;
            
            console.log('Sort action:', {
                field: action.dataset.field,
                current: currentValue,
                next: nextValue
            });
            
            // Сохраняем состоение в кнопку
            action.dataset.value = nextValue;
            
            // Сбрасываем другие кнопки
            columns.forEach(col => {
                if (col !== action) col.dataset.value = 'none';
            });

            field = action.dataset.field;
            order = nextValue;
        }
        
        // Сохранение состояния сортировки между перерисовками
        if (!field) {
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        if (field && order !== 'none') {
            return {
                ...query,
                sort: `${field}:${order}`
            };
        }
        
        // Если сортировка отключена, удаляем параметр
        const { sort, ...restQuery } = query;
        return restQuery;
    };

};