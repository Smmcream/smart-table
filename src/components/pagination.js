import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  // Клонируем шаблон страницы и удаляем оригинал
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount = 1;

  // Обработка действий пагинации
  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let currentPage = state.page || 1;

    if (action) {
      switch (action.name) {
        case 'prev':
          currentPage = Math.max(1, currentPage - 1);
          break;
        case 'next':
          currentPage = Math.min(pageCount, currentPage + 1);
          break;
        case 'first':
          currentPage = 1;
          break;
        case 'last':
          currentPage = pageCount;
          break;
        case 'page':
          currentPage = parseInt(action.value);
          break;
      }
    }

    return {
      ...query,
      limit: limit,
      page: currentPage,
    };
  };

  // Обновление отображения пагинации
  const updatePagination = (total, { page = 1, limit = 10 }) => {
    // Расчет общего количества страниц
    pageCount = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Обновляем статус отображения строк
    fromRow.textContent = total === 0 ? 0 : skip + 1;
    toRow.textContent = Math.min(skip + limit, total);
    totalRows.textContent = total;

    // Генерируем кнопки страниц
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNum) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNum, pageNum === page);
      })
    );
  };

  return {
    applyPagination,
    updatePagination,
  };
};