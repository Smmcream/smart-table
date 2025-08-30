import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
    
    // Клонируем основной шаблон таблицы
    const root = cloneTemplate(tableTemplate);
    
    // Добавляем шаблон before/after
    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // Обработка событий
    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => setTimeout(onAction));
    root.container.addEventListener('submit', e => {
        e.preventDefault();
        onAction(e.submitter);
    });

    // Функция рендеринга данных
    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            
            // Теперь заполняем ячеййки данными
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    const el = row.elements[key];
                    if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
                        el.value = item[key];
                    } else {
                        el.textContent = item[key];
                    }
                }
            });
            
            return row.container;
        });
        
        // Меняем строки в таблице
        root.elements.rows.replaceChildren(...nextRows);
    };

    return { ...root, render };
}