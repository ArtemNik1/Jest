const productService = require('../../src/productService');
const orderService = require('../../src/orderService');

const { addProduct, getProduct, updateProductStock, resetProducts } = productService;
const {
  createOrder,
  addItemToOrder,
  removeItemFromOrder,
  calculateOrderTotal,
  validateOrder,
  getOrder,
  resetOrders,
} = orderService;

beforeEach(() => {
  resetProducts();
  resetOrders();
});

describe('Functional: Order flow', () => {
  test('createProducts_createOrder_addItems_calculateTotal_validate_removeItem_shouldReflectCorrectState', () => {
    const p1 = addProduct({ name: 'Apple', price: 1.5, stock: 10 });
    const p2 = addProduct({ name: 'Bread', price: 2, stock: 5 });

    const order = createOrder();
    expect(getOrder(order.id)).toEqual({ id: order.id, items: [] });

    addItemToOrder(order.id, p1.id, 3);
    addItemToOrder(order.id, p2.id, 2);
    expect(getOrder(order.id).items).toHaveLength(2);

    const total = calculateOrderTotal(order.id);
    expect(total).toBe(1.5 * 3 + 2 * 2);

    let validation = validateOrder(order.id);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);

    removeItemFromOrder(order.id, p2.id);
    expect(getOrder(order.id).items).toHaveLength(1);
    expect(calculateOrderTotal(order.id)).toBe(1.5 * 3);

    removeItemFromOrder(order.id, p1.id);
    expect(getOrder(order.id).items).toHaveLength(0);
    expect(calculateOrderTotal(order.id)).toBe(0);
  });

  test('createProduct_addToOrder_reduceStock_validateOrder_shouldReportInsufficientStock', () => {
    const p = addProduct({ name: 'Single', price: 10, stock: 5 });
    const order = createOrder();
    addItemToOrder(order.id, p.id, 3);
    expect(calculateOrderTotal(order.id)).toBe(30);

    updateProductStock(p.id, 1); // остаток стал 1, в заказе запрошено 3
    const result = validateOrder(order.id);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('requested 3') && e.includes('available 1'))).toBe(
      true
    );
  });
});
