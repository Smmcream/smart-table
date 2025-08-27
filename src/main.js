import './style.css';
import { data as sourceData } from './data/dataset_1.js';
import { initData } from './data.js';
import { initTable } from './components/table.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { initPagination } from './components/pagination.js';

// API
const api = initData(sourceData);
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

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);
  sampleTable.render(items);
}

// Импорт нашего датасета
async function loadDataset(datasetNumber) {
  try {
    const module = await import(`./data/dataset_${datasetNumber}.js`);
    const apiNew = initData(module.data);

    // Обновляем API
    Object.assign(api, apiNew);

    // Получаем новые индексы и обновляем фильтры
    const indexes = await api.getIndexes();
    updateIndexes(indexes);

    render();
  } catch (error) {
    console.error('Error loading dataset:', error);
  }
}

// Ждем пока страница загрузится и запускаем приложение
document.addEventListener('DOMContentLoaded', async () => {
  const appContainer = document.querySelector('#app');

  // Переключатель данных из трех датасетов для удобной сортировки
  const switcherContainer = document.createElement('div');
  switcherContainer.className = 'dataset-switcher';
  switcherContainer.innerHTML = `
        <button data-dataset="1">Dataset_1</button>
        <button data-dataset="2">Dataset_2</button>
        <button data-dataset="3">Dataset_3</button>
      `;

  switcherContainer.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => loadDataset(btn.dataset.dataset));
  });

  appContainer.appendChild(switcherContainer);
  appContainer.appendChild(sampleTable.container);

  // Здесь получаем индексы и обновляем фильтры
  const indexes = await api.getIndexes();
  updateIndexes(indexes);

  render();
});