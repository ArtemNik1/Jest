const products = new Map();
let nextId = 1;

function addProduct(data) {
  if (data == null || typeof data !== 'object') {
    throw new Error('Product data must be an object');
  }
  const { name, price, stock } = data;
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('Product name must be a non-empty string');
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price <= 0) {
    throw new Error('Product price must be a positive number');
  }
  const stockValue = stock !== undefined ? Number(stock) : 0;
  if (!Number.isInteger(stockValue) || stockValue < 0) {
    throw new Error('Product stock must be a non-negative integer');
  }
  const id = nextId++;
  const product = { id, name: name.trim(), price, stock: stockValue };
  products.set(id, { ...product });
  return product;
}

function removeProduct(id) {
  if (id == null || typeof id !== 'number' || Number.isNaN(id)) {
    throw new Error('Product id must be a valid number');
  }
  if (!products.has(id)) {
    throw new Error(`Product with id ${id} not found`);
  }
  products.delete(id);
  return true;
}

function getProduct(id) {
  if (id == null || typeof id !== 'number' || Number.isNaN(id)) {
    return null;
  }
  const p = products.get(id);
  return p ? { ...p } : null;
}

function updateProductStock(id, quantity) {
  if (id == null || typeof id !== 'number' || Number.isNaN(id)) {
    throw new Error('Product id must be a valid number');
  }
  const q = Number(quantity);
  if (!Number.isInteger(q) || q < 0) {
    throw new Error('Stock quantity must be a non-negative integer');
  }
  const product = products.get(id);
  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }
  product.stock = q;
  return { ...product };
}

function hasEnoughStock(productId, quantity) {
  const product = getProduct(productId);
  if (!product) return false;
  const q = Number(quantity);
  if (!Number.isInteger(q) || q <= 0) return false;
  return product.stock >= q;
}

function getAllProducts() {
  return Array.from(products.values()).map((p) => ({ ...p }));
}

function resetProducts() {
  products.clear();
  nextId = 1;
}

module.exports = {
  addProduct,
  removeProduct,
  getProduct,
  updateProductStock,
  hasEnoughStock,
  getAllProducts,
  resetProducts,
};
