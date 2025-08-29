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

            if (typeof sellersData === 'object' && !Array.isArray(sellersData)) {
                sellersMap = sellersData;
            }

            if (typeof customersData === 'object' && !Array.isArray(customersData)) {
                customersMap = customersData;
            }

            return { 
                sellers: Object.values(sellersMap),
                customers: Object.values(customersMap)
            };

        } catch (error) {
            console.error('Error fetching indexes:', error);
            return { sellers: [], customers: [] };
        }
    };

    const getRecords = async (query = {}) => {
        try {
            const params = new URLSearchParams();
            
            console.log('Input query:', query);
            
            // Базовые параметры
            if (query.page) params.append('page', query.page.toString());
            if (query.limit) params.append('limit', query.limit.toString());
            
            // Делаем сортировку
            if (query.sort) {
                const [field, order] = query.sort.split(':');
                if (field && order) {
                    const serverOrder = order === 'asc' ? 'up' : order === 'desc' ? 'down' : order;
                    params.append('sort', `${field}:${serverOrder}`);
                }
            }
            
            // Сервер сам ищет по всем полям: дата, селлер и тд
            if (query.search) {
                params.append('search', query.search);
            }

            const url = `${BASE_URL}/records?${params}`;
            console.log('Request URL:', url);

            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Server data received:', data);

            const items = data.items.map(item => {
                const sellerName = sellersMap[item.seller_id] || `Seller ${item.seller_id}`;
                const customerName = customersMap[item.customer_id] || `Customer ${item.customer_id}`;

                return {
                    id: item.receipt_id,
                    date: item.date,
                    seller: sellerName,
                    customer: customerName,
                    total: item.total_amount
                };
            });

            return {
                total: data.total,
                items: items
            };

        } catch (error) {
            console.error('Error in getRecords:', error);
            return { total: 0, items: [] };
        }
    };

    return { getIndexes, getRecords };
}