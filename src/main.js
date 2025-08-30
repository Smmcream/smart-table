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
        search: state.search || '',
        rowsPerPage: parseInt(state.rowsPerPage || 10),
        page: parseInt(state.page || 1),
        date: state.date || '',
        customer: state.customer || '',
        seller: state.seller || '',
        totalFrom: state.totalFrom || '',
        totalTo: state.totalTo || ''
    };
}

async function render(action) {
    let state = collectState();
    let query = {};

    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query);
    
    let filteredItems = items;
    
    //фильтруем по конкретным полям на клиенте
    if (state.date) {
        filteredItems = filteredItems.filter(item => item.date.includes(state.date));
    }
    if (state.customer) {
        filteredItems = filteredItems.filter(item => item.customer.includes(state.customer));
    }
    if (state.seller) {
        filteredItems = filteredItems.filter(item => item.seller.includes(state.seller));
    }
    if (state.totalFrom || state.totalTo) {
        filteredItems = filteredItems.filter(item => {
            const itemTotal = parseFloat(item.total);
            const from = state.totalFrom ? parseFloat(state.totalFrom) : 0;
            const to = state.totalTo ? parseFloat(state.totalTo) : Number.MAX_SAFE_INTEGER;
            return itemTotal >= from && itemTotal <= to;
        });
    }

    updatePagination(filteredItems.length, query);
    sampleTable.render(filteredItems);
}

async function initApp() {
    const indexes = await api.getIndexes();
    updateIndexes(indexes);
    render();
}

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.querySelector('#app');
    appContainer.appendChild(sampleTable.container);
    initApp();
});