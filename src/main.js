/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    return purchase.quantity * ((purchase["sale_price"] - purchase["sale_price"] * (purchase["discount"] / 100)) - _product["purchase_price"]);
   // @TODO: Расчет выручки от операции
}

// Все продажи продавца
function getSellerSales(data, sellerId) {
   const sales = data["purchase_records"];

   return sales.filter(sale => sale["seller_id"] === sellerId);
}

// Выручка продавца
function calculateSellerRevenue(sales) {
    let revenue = 0;

    for (let sale of sales) {
        revenue += sale["total_amount"];
    }

    return revenue;
}

// Прибыль продавца (выручка - расходы)
function calculateSellerProfit(sales, products) {
    let profit = 0;

    for (let sale of sales) {
        for (let item of sale.items) {
            profit += calculateSimpleRevenue(item, products.find(product => product.sku === item.sku));
        }
    }

    return profit;
}

// Топ-10 товаров продавца
function getTopProducts(sales) {
    const topProducts = []

    for (let sale of sales) {
        for (let item of sale.items) {
            if (!topProducts.find(value => value.sku === item.sku)) {
                topProducts.push(
                    {
                        sku: item.sku,
                        count: 1
                    }
                );
            }
            else {
                topProducts.find(value => value.sku === item.sku).count++;
            }
        }
    }

    topProducts.sort((prev, next) => next.count - prev.count);
    return topProducts.slice(0, 10);
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller, profit) {
    if (index === 0) {
        return profit * 0.15;
    }
    else if (index === 1 || index === 2) {
        return profit * 0.1;
    }
    else if (total - index === 1) {
        return 0;
    }
    else {
        return profit * 0.05
    }
}

function getSellersStats(data) {
    const sellersStats = [];

    for (let seller of data.sellers) {
        const salesRecords = getSellerSales(data, seller.id);

        const sellerRecord = {
            seller_id: seller.id,
            name: `${seller.first_name} ${seller.last_name}`,
            revenue: +calculateSellerRevenue(salesRecords).toFixed(2),
            profit: +calculateSellerProfit(salesRecords, data.products).toFixed(2),
            sales_count: salesRecords.length,
            top_products: getTopProducts(salesRecords),
            bonus: undefined 
        };

        sellersStats.push(sellerRecord);
    }

    sellersStats.sort((prev, next) => next.profit - prev.profit);

    for (let seller of sellersStats) {
        // let profit = seller.profit;
        let bonus = calculateBonusByProfit(
            sellersStats.indexOf(seller),
            sellersStats.length,
            data.sellers.find(value => value["seller_id"] === seller.id),
            seller.profit
        );

        seller.bonus = +bonus.toFixed(2);
    }

    return sellersStats;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    if (data && options) {
        const sellersStats = getSellersStats(data);

        return sellersStats;
    }
    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
