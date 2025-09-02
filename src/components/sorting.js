import { sortMap } from "../lib/utils.js";

export const initSorting = (columns) => {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // Обработка действия сортировки
            const currentValue = action.dataset.value || 'none';
            const nextValue = sortMap[currentValue];
            
            action.dataset.value = nextValue;
            field = action.dataset.field;
            order = nextValue;

            // Сброс других колонок
            columns.forEach(column => {
                if (column !== action) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // Восстановление состояния из query
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        // Формирование параметра сортировки
        if (field && order !== 'none') {
            return {
                ...query,
                sort: `${field}:${order}`
            };
        } else {
            // Удаляем сортировку если не активна
            const { sort, ...restQuery } = query;
            return restQuery;
        }
    };
};