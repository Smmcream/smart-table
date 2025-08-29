import { sortMap } from "../lib/utils.js";

export const initSorting = (columns) => {
    return (query, state, action) => {
        if (action?.name === 'sort' && action?.dataset?.field) {
            const currentValue = action.dataset.value || 'none';
            const nextValue = sortMap[currentValue];
            
            console.log('Sort action:', {
                field: action.dataset.field,
                current: currentValue,
                next: nextValue
            });
            
            // Сбрасываем другие кнопки
            columns.forEach(col => {
                if (col !== action) col.dataset.value = 'none';
            });

            if (nextValue === 'none') {
                // Удаляем сортировку
                const { sort, ...restQuery } = query;
                return restQuery;
            }

            // Возвращаем корректный формат 
            return {
                ...query,
                sort: `${action.dataset.field}:${nextValue}`
            };
        }
        return query;
    };
};