import { getPages } from "../lib/utils.js"; 
 
export const initPagination = ( 
    { pages, fromRow, toRow, totalRows }, 
    createPage 
) => { 
    let pageCount = 1; 
 
    const applyPagination = (query, state, action) => { 
        const limit = state.rowsPerPage;  
        let currentPage = state.page || 1;  
 
        if (action) { 
            switch (action.name) { 
                case 'prev': 
                    currentPage = Math.max(1, currentPage - 1); // Перейти на предыдущую страницу 
                    break; 
                case 'next': 
                    currentPage = Math.min(pageCount, currentPage + 1); // На следующую 
                    break; 
                case 'first': 
                    currentPage = 1; // Первая страница 
                    break; 
                case 'last': 
                    currentPage = pageCount; // Последняя страница 
                    break; 
                case 'page': 
                    currentPage = parseInt(action.value); // Перейти на выбранную страницу 
                    break; 
            } 
        } 
 
        return { 
            ...query, 
            limit: limit, 
            page: currentPage, 
        }; 
    }; 
 
    const updatePagination = (total, { page = 1, limit = 10 }) => { 
        // Обновляем число страниц 
        pageCount = Math.ceil(total / limit); 
        const skip = (page - 1) * limit;  
 
        // Здесь показываем номера строк, которые сейчас видим 
        fromRow.textContent = total === 0 ? 0 : skip + 1; 
        toRow.textContent = Math.min(skip + limit, total); 
        totalRows.textContent = total;  
 
        // А тут создаем список страниц для навигации 
        const visiblePages = getPages(page, pageCount, 5); 
        pages.replaceChildren( 
            ...visiblePages.map((pageNum) => { 
                const el = pages.firstElementChild.cloneNode(true); 
                return createPage(el, pageNum, pageNum === page); 
            }) 
        ); 
    }; 
 
    return { applyPagination, updatePagination }; 
}; 