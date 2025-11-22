/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    const discount =   1 - (purchase.discount / 100);
    return purchase["sale_price"] * purchase.quantity * discount;
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
            const product = products.find(product => product.sku === item.sku);
            profit += calculateSimpleRevenue(item, product) - product["purchase_price"] * item.quantity;
        }
    }

    return profit;
}

// Топ-10 товаров продавца
function getTopProducts(sales) {
    const topProducts = [];

    for (let sale of sales) {
        for (let item of sale.items) {
            if (!topProducts.find(value => value.sku === item.sku)) {
                topProducts.push(
                    {
                        sku: item.sku,
                        quantity: item.quantity
                    }
                );
            }
            else {
                topProducts.find(value => value.sku === item.sku).quantity += item.quantity;
            }
        }
    }

    topProducts.sort((prev, next) => next.quantity - prev.quantity);
    return topProducts.slice(0, 10);
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */

function calculateBonusByProfit(index, total, seller) {
    if (index === 0) {
        return seller.profit * 0.15;
    }
    else if (index === 1 || index === 2) {
        return seller.profit * 0.1;
    }
    else if (total - index === 1) {
        return 0;
    }
    else {
        return seller.profit * 0.05
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
        let bonus = calculateBonusByProfit(
            sellersStats.indexOf(seller),
            sellersStats.length,
            seller
        );

        seller.bonus = +bonus.toFixed(2);
    }

    return sellersStats;
}

function checkData(data, options) {
    if ((!data || !options) || (data.length === 0 || options.length === 0)) {
        throw new Error("Некорректные данные!");
    }
    else {
        for (let item of Object.values(data)) {
            if (!item || (item.length === 0)) { 
                throw new Error("Некорректные данные!");
            }
        }
    }
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    checkData(data, options);

    const sellersStats = getSellersStats(data);

    return sellersStats;
    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
