export function processFormData(formData) {
    return Object.fromEntries(formData.entries());
}

export function cloneTemplate(templateId) {
    const template = document.getElementById(templateId);
    const clone = template.content.firstElementChild.cloneNode(true);
    const elements = Array.from(clone.querySelectorAll('[data-name]'))
        .reduce((acc, el) => ({...acc, [el.dataset.name]: el}), {});
    return {container: clone, elements};
}

export const sortMap = {
    'none': 'asc',
    'asc': 'desc',
    'desc': 'none'
};

export function getPages(current, total, visibleCount = 5) {
    let start = Math.max(1, current - Math.floor(visibleCount/2));
    let end = Math.min(total, start + visibleCount - 1);
    return Array.from({length: end - start + 1}, (_, i) => start + i);
}

export const makeIndex = (arr, field, fn) => 
    arr.reduce((acc, item) => ({...acc, [item[field]]: fn(item)}), {});