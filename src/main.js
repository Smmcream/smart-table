import './style.css';
import { initData } from './data.js';
import { initTable } from './components/table.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { initPagination } from './components/pagination.js';

const api = initData();

const sampleTable = initTable(
    {
        tableTemplate: 'table',
        rowTemplate: 'row',
        before: ['search', 'header', 'filter'],
        after: ['pagination']
    },
    render
);

const applySearching = initSearching('search');
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

function collectState() {
    const formData = new FormData(sampleTable.container);
    const state = Object.fromEntries(formData.entries());
    
    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage || 10),
        page: parseInt(state.page || 1)
    };
}

async function render(action) {
    try {
        let state = collectState();
        let query = {};

        query = applySearching(query, state, action);
        query = applyFiltering(query, state, action);
        query = applySorting(query, state, action);
        query = applyPagination(query, state, action);

        const { total, items } = await api.getRecords(query);
        
        updatePagination(total, query);
        sampleTable.render(items);
        
    } catch (error) {
        console.error('Render error:', error);
        updatePagination(0, { page: 1, limit: 10 });
        sampleTable.render([]);
    }
}

async function initApp() {
    try {
        const indexes = await api.getIndexes();
        updateIndexes(indexes);
        render();
    } catch (error) {
        console.error('Init error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.querySelector('#app');
    appContainer.appendChild(sampleTable.container);
    initApp();
});