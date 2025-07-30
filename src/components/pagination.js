import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    return (data, state, action) => {
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let page = state.page;

        if (action) switch(action.name) {
            case 'prev': page = Math.max(1, page - 1); break;
            case 'next': page = Math.min(pageCount, page + 1); break;
            case 'first': page = 1; break;
            case 'last': page = pageCount; break;
            case 'page': page = parseInt(action.value); break;
        }

        // Обновление статуса
        const skip = (page - 1) * rowsPerPage;
        fromRow.textContent = skip + 1;
        toRow.textContent = Math.min(skip + rowsPerPage, data.length);
        totalRows.textContent = data.length;

        // Отрисовка кнопок
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNum => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNum, pageNum === page);
        }));

        return data.slice(skip, skip + rowsPerPage);
    };
};