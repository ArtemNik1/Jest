const { getProduct, hasEnoughStock } = require('./productService');

const orders = new Map();
let nextOrderId = 1;

function createOrder() {
  const id = nextOrderId++;
  const order = { id, items: [] };
  orders.set(id, { id, items: [] });
  return { ...order, items: [...order.items] };
}

function addItemToOrder(orderId, productId, quantity) {
  if (orderId == null || typeof orderId !== 'number' || Number.isNaN(orderId)) {
    throw new Error('Order id must be a valid number');
  }
  if (productId == null || typeof productId !== 'number' || Number.isNaN(productId)) {
    throw new Error('Product id must be a valid number');
  }
  const q = Number(quantity);
  if (!Number.isInteger(q) || q <= 0) {
    throw new Error('Quantity must be a positive integer');
  }
  const order = orders.get(orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  const product = getProduct(productId);
  if (!product) {
    throw new Error(`Product with id ${productId} not found`);
  }
  if (!hasEnoughStock(productId, q)) {
    throw new Error(`Insufficient stock for product ${productId}. Available: ${product.stock}, requested: ${q}`);
  }
  const existing = order.items.find((i) => i.productId === productId);
  if (existing) {
    const newQty = existing.quantity + q;
    if (!hasEnoughStock(productId, newQty)) {
      throw new Error(`Insufficient stock for product ${productId}. Available: ${product.stock}, requested: ${newQty}`);
    }
    existing.quantity = newQty;
  } else {
    order.items.push({ productId, quantity: q, unitPrice: product.price });
  }
  return { id: order.id, items: order.items.map((i) => ({ ...i })) };
}

function removeItemFromOrder(orderId, productId) {
  if (orderId == null || typeof orderId !== 'number' || Number.isNaN(orderId)) {
    throw new Error('Order id must be a valid number');
  }
  if (productId == null || typeof productId !== 'number' || Number.isNaN(productId)) {
    throw new Error('Product id must be a valid number');
  }
  const order = orders.get(orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  const idx = order.items.findIndex((i) => i.productId === productId);
  if (idx === -1) {
    throw new Error(`Product ${productId} not found in order ${orderId}`);
  }
  order.items.splice(idx, 1);
  return { id: order.id, items: order.items.map((i) => ({ ...i })) };
}

function calculateOrderTotal(orderId) {
  if (orderId == null || typeof orderId !== 'number' || Number.isNaN(orderId)) {
    throw new Error('Order id must be a valid number');
  }
  const order = orders.get(orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return Math.round(total * 100) / 100;
}

function validateOrder(orderId) {
  if (orderId == null || typeof orderId !== 'number' || Number.isNaN(orderId)) {
    throw new Error('Order id must be a valid number');
  }
  const order = orders.get(orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  const errors = [];
  for (const item of order.items) {
    if (!hasEnoughStock(item.productId, item.quantity)) {
      const product = getProduct(item.productId);
      const available = product ? product.stock : 0;
      errors.push(`Product ${item.productId}: requested ${item.quantity}, available ${available}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

function getOrder(orderId) {
  if (orderId == null || typeof orderId !== 'number' || Number.isNaN(orderId)) {
    return null;
  }
  const order = orders.get(orderId);
  return order ? { id: order.id, items: order.items.map((i) => ({ ...i })) } : null;
}

function resetOrders() {
  orders.clear();
  nextOrderId = 1;
}

module.exports = {
  createOrder,
  addItemToOrder,
  removeItemFromOrder,
  calculateOrderTotal,
  validateOrder,
  getOrder,
  resetOrders,
};
