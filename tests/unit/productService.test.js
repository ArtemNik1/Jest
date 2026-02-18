const { addProduct, removeProduct, getProduct, updateProductStock, hasEnoughStock, getAllProducts, resetProducts } = require('../../src/productService');

beforeEach(() => {
  resetProducts();
});

describe('ProductService', () => {
  describe('addProduct_shouldExpectedResult_whenCondition', () => {
    test('addProduct_shouldThrow_whenDataIsNull', () => {
      expect(() => addProduct(null)).toThrow('Product data must be an object');
      expect(() => addProduct(undefined)).toThrow('Product data must be an object');
    });

    test('addProduct_shouldThrow_whenNameIsEmptyOrWhitespace', () => {
      expect(() => addProduct({ name: '', price: 10, stock: 0 })).toThrow(
        'Product name must be a non-empty string'
      );
      expect(() => addProduct({ name: '   ', price: 10, stock: 0 })).toThrow(
        'Product name must be a non-empty string'
      );
    });

    test('addProduct_shouldThrow_whenPriceIsZeroOrNegative', () => {
      expect(() => addProduct({ name: 'A', price: 0, stock: 0 })).toThrow(
        'Product price must be a positive number'
      );
      expect(() => addProduct({ name: 'A', price: -1, stock: 0 })).toThrow(
        'Product price must be a positive number'
      );
    });

    test('addProduct_shouldReturnProductWithId_whenValidData', () => {
      const result = addProduct({ name: 'Apple', price: 2.5, stock: 100 });
      expect(result).toMatchObject({ name: 'Apple', price: 2.5, stock: 100 });
      expect(typeof result.id).toBe('number');
    });
  });

  describe('getProduct_shouldExpectedResult_whenCondition', () => {
    test('getProduct_shouldReturnNull_whenIdIsUndefined', () => {
      expect(getProduct(undefined)).toBeNull();
      expect(getProduct(null)).toBeNull();
    });

  });

  describe('removeProduct_shouldExpectedResult_whenCondition', () => {
    test('removeProduct_shouldThrow_whenProductNotFound', () => {
      expect(() => removeProduct(999)).toThrow('Product with id 999 not found');
    });

  });

  describe('updateProductStock_shouldExpectedResult_whenCondition', () => {
    test('updateProductStock_shouldThrow_whenQuantityIsNegative', () => {
      const p = addProduct({ name: 'Z', price: 1, stock: 10 });
      expect(() => updateProductStock(p.id, -1)).toThrow(
        'Stock quantity must be a non-negative integer'
      );
    });

  });

  describe('hasEnoughStock_shouldExpectedResult_whenCondition', () => {
    test('hasEnoughStock_shouldReturnFalse_whenQuantityExceedsStock', () => {
      const p = addProduct({ name: 'Item', price: 1, stock: 3 });
      expect(hasEnoughStock(p.id, 4)).toBe(false);
      expect(hasEnoughStock(p.id, 3)).toBe(true);
    });
  });
});
