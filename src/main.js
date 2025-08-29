import './style.css';
import { initData } from './data.js';
import { initTable } from './components/table.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { initPagination } from './components/pagination.js';

// API
const api = initData();
console.log('API initialized');

// Таблица
const sampleTable = initTable(
    {
        tableTemplate: 'table',
        rowTemplate: 'row',
        before: ['search', 'header', 'filter'],
        after: ['pagination']
    },
    render
);

// Инициализация модулей
const applySearching = initSearching(['date', 'seller', 'customer', 'total']);
const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// Собираем все значения в один объект
function collectState() {
    const formData = new FormData(sampleTable.container);
    const state = Object.fromEntries(formData.entries());

    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage || 10),
        page: parseInt(state.page || 1)
    };
}

// Рендерим через функцию
async function render(action) {
    let state = collectState();
    let query = {};

    // Применяем модули к query
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    console.log('Final query:', query);

    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

// Ждем пока страница загрузится и запускаем приложение
document.addEventListener('DOMContentLoaded', async () => {
    const appContainer = document.querySelector('#app');
    appContainer.appendChild(sampleTable.container);

    // Получаем индексы и обновляем фильтры
    const indexes = await api.getIndexes();
    updateIndexes(indexes);

    render();
});