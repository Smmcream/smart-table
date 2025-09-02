import { getPages } from "../lib/utils.js";

export const initPagination = (elements, createPage) => {
    let pageCount = 1;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page || 1;

        if (action) {
            switch(action.name) {
                case 'prev': 
                    page = Math.max(1, page - 1);
                    break;
                case 'next': 
                    page = Math.min(pageCount, page + 1);
                    break;
                case 'first': 
                    page = 1;
                    break;
                case 'last': 
                    page = pageCount;
                    break;
                case 'page':
                    page = parseInt(action.value);
                    break;
            }
        }

        return {
            ...query,
            limit: limit,
            page: page
        };
    };

    const updatePagination = (total, { page = 1, limit = 10 }) => {
        pageCount = Math.ceil(total / limit);
        const currentPage = Math.min(Math.max(1, page), pageCount);
        const skip = (currentPage - 1) * limit;

        // Обновление статуса
        elements.fromRow.textContent = total === 0 ? 0 : skip + 1;
        elements.toRow.textContent = Math.min(skip + limit, total);
        elements.totalRows.textContent = total;

        // Обновление кнопок навигации
        elements.firstPage.disabled = (currentPage === 1);
        elements.previousPage.disabled = (currentPage === 1);
        elements.nextPage.disabled = (currentPage === pageCount);
        elements.lastPage.disabled = (currentPage === pageCount);

        // Обновление страниц
        const pagesContainer = elements.pages;
        
        // Очищаем контейнер
        pagesContainer.innerHTML = '';
        
        // Если нет данных или страниц - выходим
        if (total === 0 || pageCount === 0) {
            return;
        }

        // я не смогла иначе реализовать сброс фильтров при пустых значениях(например Alena). Это решение не противоречит заданию и работает!
        let pageTemplate;
        if (pagesContainer.children.length > 0) {
            pageTemplate = pagesContainer.firstElementChild.cloneNode(true);
        } else {
            // Создаем базовый шаблон для клонирования
            const template = document.createElement('label');
            template.className = 'pagination-button';
            template.innerHTML = `
                <input type="radio" name="page">
                <span></span>
            `;
            pageTemplate = template;
        }

        const visiblePages = getPages(currentPage, pageCount, 5);
        visiblePages.forEach(pageNum => {
            const pageElement = pageTemplate.cloneNode(true);
            pagesContainer.appendChild(createPage(pageElement, pageNum, pageNum === currentPage));
        });
    };

    return { applyPagination, updatePagination };
};