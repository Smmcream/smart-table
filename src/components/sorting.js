import {sortMap} from "../lib/utils.js";

export const initSorting = (columns) => {
    let field = null;
    let order = 'none';

    return (data, state, action) => {
        if (action?.dataset?.field) {
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            columns.forEach(col => {
                if (col.dataset.field !== field) col.dataset.value = 'none';
            });
        }

        columns.forEach(col => {
            if (col.dataset.value !== 'none') {
                field = col.dataset.field;
                order = col.dataset.value;
            }
        });

        if (order === 'none') return data;

        return [...data].sort((a, b) => {
            const valA = a[field];
            const valB = b[field];
            return order === 'asc' ? 
                valA > valB ? 1 : -1 : 
                valA < valB ? 1 : -1;
        });
    };
};