export function initData() {
    const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

    let sellersMap = {};
    let customersMap = {};

    const getIndexes = async () => {
        try {
            const [sellersResponse, customersResponse] = await Promise.all([
                fetch(`${BASE_URL}/sellers`),
                fetch(`${BASE_URL}/customers`)
            ]);

            const sellersData = await sellersResponse.json();
            const customersData = await customersResponse.json();

            sellersMap = sellersData;
            customersMap = customersData;

            return { 
                sellers: Object.values(sellersMap),
                customers: Object.values(customersMap)
            };

        } catch (error) {
            return { sellers: [], customers: [] };
        }
    };

    const getRecords = async (query = {}) => {
        try {
            const params = new URLSearchParams();
            
            if (query.page) params.append('page', query.page);
            if (query.limit) params.append('limit', query.limit);
            
            if (query.sort) {
                const [field, order] = query.sort.split(':');
                if (field && order) {
                    const serverOrder = order === 'asc' ? 'up' : 'down';
                    params.append('sort', `${field}:${serverOrder}`);
                }
            }
            
            if (query.search) {
                params.append('search', query.search);
            }

            const url = `${BASE_URL}/records?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                return { total: 0, items: [] };
            }
            
            const data = await response.json();

            const items = data.items.map(item => ({
                id: item.receipt_id,
                date: item.date,
                seller: sellersMap[item.seller_id] || `Seller ${item.seller_id}`,
                customer: customersMap[item.customer_id] || `Customer ${item.customer_id}`,
                total: item.total_amount
            }));

            return {
                total: data.total,
                items: items
            };

        } catch (error) {
            return { total: 0, items: [] };
        }
    };

    return { getIndexes, getRecords };
}