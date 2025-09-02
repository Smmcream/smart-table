export function initData() {
    const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

    let sellersMap = {};
    let customersMap = {};
    let lastResult;
    let lastQuery;

    const getIndexes = async () => {
        try {
            if (Object.keys(sellersMap).length === 0 || Object.keys(customersMap).length === 0) {
                const [sellersResponse, customersResponse] = await Promise.all([
                    fetch(`${BASE_URL}/sellers`),
                    fetch(`${BASE_URL}/customers`)
                ]);

                if (!sellersResponse.ok || !customersResponse.ok) {
                    throw new Error('Failed to fetch indexes');
                }

                const sellersData = await sellersResponse.json();
                const customersData = await customersResponse.json();

                console.log('Sellers data:', sellersData);
                console.log('Customers data:', customersData);

                // СЕРВЕР ВОЗВРАЩАЕТ ПРОСТОЙ ОБЪЕКТ {id: name} - сохраняем как есть
                sellersMap = sellersData;
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
            
            // Пагинация
            if (query.page) params.append('page', query.page);
            if (query.limit) params.append('limit', query.limit);
            
            // Сортировка
            if (query.sort) {
                params.append('sort', query.sort);
            }
            
            // Поиск
            if (query.search) {
                params.append('search', query.search);
            }
            
            // Фильтрация
            if (query.filter) {
                Object.entries(query.filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== '') {
                        params.append(`filter[${key}]`, value);
                    }
                });
            }

            const url = `${BASE_URL}/records?${params}`;
            console.log('Fetching records from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Records response:', data);

            // Извлекаем items из ответа
            let itemsArray = data.items || data;
            if (data.data) {
                itemsArray = data.data;
            }

            if (!Array.isArray(itemsArray)) {
                console.error('Invalid items format:', itemsArray);
                return { total: 0, items: [] };
            }

            // Преобразование данных для таблицы
            const items = itemsArray.map(item => {
                const sellerName = sellersMap[item.seller_id] || `Seller ${item.seller_id}`;
                const customerName = customersMap[item.customer_id] || `Customer ${item.customer_id}`;
                
                return {
                    id: item.receipt_id || item.id,
                    date: item.date,
                    seller: sellerName,
                    customer: customerName,
                    total: item.total_amount || item.total
                };
            });

            return {
                total: data.total || items.length,
                items: items
            };

        } catch (error) {
            console.error('Error fetching records:', error);
            return { total: 0, items: [] };
        }
    };

    return { getIndexes, getRecords };
}