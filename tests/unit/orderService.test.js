const productService = require('../../src/productService');
const orderService = require('../../src/orderService');

const { addProduct, getProduct, resetProducts } = productService;
const { createOrder, addItemToOrder, removeItemFromOrder, calculateOrderTotal, validateOrder, getOrder, resetOrders } =
  orderService;

beforeEach(() => {
  resetProducts();
  resetOrders();
});

describe('OrderService', () => {
  describe('addItemToOrder_shouldExpectedResult_whenCondition', () => {
    test('addItemToOrder_shouldThrow_whenInsufficientStock', () => {
      const p = addProduct({ name: 'Limited', price: 5, stock: 2 });
      const order = createOrder();
      addItemToOrder(order.id, p.id, 2);
      expect(() => addItemToOrder(order.id, p.id, 1)).toThrow('Insufficient stock');
    });

    test('addItemToOrder_shouldThrow_whenOrderNotFound', () => {
      const p = addProduct({ name: 'A', price: 1, stock: 10 });
      expect(() => addItemToOrder(999, p.id, 1)).toThrow('Order with id 999 not found');
    });

    test('addItemToOrder_shouldThrow_whenQuantityNotPositive', () => {
      const p = addProduct({ name: 'A', price: 1, stock: 10 });
      const order = createOrder();
      expect(() => addItemToOrder(order.id, p.id, 0)).toThrow('Quantity must be a positive integer');
      expect(() => addItemToOrder(order.id, p.id, -1)).toThrow('Quantity must be a positive integer');
    });
  });

  describe('calculateOrderTotal_shouldExpectedResult_whenCondition', () => {
    test('calculateOrderTotal_shouldReturnCorrectSum_whenMultipleItems', () => {
      const p1 = addProduct({ name: 'A', price: 10, stock: 5 });
      const p2 = addProduct({ name: 'B', price: 2.5, stock: 10 });
      const order = createOrder();
      addItemToOrder(order.id, p1.id, 2);
      addItemToOrder(order.id, p2.id, 4);
      expect(calculateOrderTotal(order.id)).toBe(30);
    });
  });

  describe('removeItemFromOrder_shouldExpectedResult_whenCondition', () => {
    test('removeItemFromOrder_shouldThrow_whenProductNotInOrder', () => {
      const p = addProduct({ name: 'A', price: 1, stock: 10 });
      const order = createOrder();
      addItemToOrder(order.id, p.id, 1);
      const p2 = addProduct({ name: 'B', price: 1, stock: 10 });
      expect(() => removeItemFromOrder(order.id, p2.id)).toThrow(
        `Product ${p2.id} not found in order ${order.id}`
      );
    });
  });

  describe('validateOrder_shouldExpectedResult_whenCondition', () => {
    test('validateOrder_shouldReturnValidFalse_whenStockInsufficientForAnyItem', () => {
      const p = addProduct({ name: 'X', price: 1, stock: 1 });
      const order = createOrder();
      addItemToOrder(order.id, p.id, 1);
      productService.updateProductStock(p.id, 0); // уменьшаем остаток после добавления в заказ
      const result = validateOrder(order.id);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toMatch(/requested 1.*available 0/);
    });
  });

  describe('getOrder_shouldExpectedResult_whenCondition', () => {
    test('getOrder_shouldReturnNull_whenOrderIdIsInvalid', () => {
      expect(getOrder(undefined)).toBeNull();
      expect(getOrder(null)).toBeNull();
    });
  });
});
