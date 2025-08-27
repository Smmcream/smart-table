import { makeIndex } from "./lib/utils.js";

export function initData(sourceData) {
    if (!sourceData?.purchase_records) {
        console.error("Invalid data format:", sourceData);
        return {
            getIndexes: async () => ({ sellers: [], customers: [] }),
            getRecords: async () => ({ total: 0, items: [] })
        };
    }

    // Если все правильно, создаются нужные индексы
    const sellers = makeIndex(sourceData.sellers, 'id', v => `${v.first_name} ${v.last_name}`);
    const customers = makeIndex(sourceData.customers, 'id', v => `${v.first_name} ${v.last_name}`);

    const allData = sourceData.purchase_records.map((item) => {
        const seller = sellers[item.seller_id] || 'Unknown Seller';
        const customer = customers[item.customer_id] || 'Unknown Customer';

        return {
            id: item.receipt_id,
            date: item.date,
            seller,
            customer,
            total: item.total_amount,
            ...item
        };
    });

    const getIndexes = async () => {
        return { 
            sellers: Object.values(sellers), 
            customers: Object.values(customers) 
        };
    };

    const getRecords = async (query = {}) => {
        let resultData = [...allData];

        // Поиск
        if (query.search) {
            const searchTerm = query.search.toLowerCase();
            resultData = resultData.filter(item => 
                item.date.toLowerCase().includes(searchTerm) ||
                item.seller.toLowerCase().includes(searchTerm) ||
                item.customer.toLowerCase().includes(searchTerm) ||
                item.total.toString().includes(searchTerm)
            );
        }

        // Здесь работает фильтр
        if (query.filter) {
            Object.entries(query.filter).forEach(([field, value]) => {
                if (value) {
                    resultData = resultData.filter(item => 
                        String(item[field] || '').toLowerCase().includes(value.toLowerCase())
                    );
                }
            });
        }

        // Здесь сортируем данные
        if (query.sort) {
            const [field, order] = query.sort.split(':');
            resultData.sort((a, b) => {
                const valA = a[field];
                const valB = b[field];

                if (order === 'asc') {
                    return valA > valB ? 1 : -1;
                } else {
                    return valA < valB ? 1 : -1;
                }
            });
        }

        const total = resultData.length;

        // Применяем пагинацию
        if (query.limit && query.page) {
            const limit = parseInt(query.limit);
            const page = parseInt(query.page);
            const startIndex = (page - 1) * limit;
            resultData = resultData.slice(startIndex, startIndex + limit);
        }

        return { total, items: resultData };
    };

    return { getIndexes, getRecords };
}