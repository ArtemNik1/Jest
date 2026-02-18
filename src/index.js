const productService = require('./productService');
const orderService = require('./orderService');

module.exports = {
  ...productService,
  ...orderService,
};
