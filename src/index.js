'use strict';

module.exports = (window.angular || require('angular'))
  .module('credit-cards', [])
  .value('creditcards', require('creditcards'))
  .directive('ccNumber', require('./number'))
  .directive('ccExp', require('./expiration'))
  .directive('ccExpMonth', require('./expiration').month)
  .directive('ccExpYear', require('./expiration').year)
  .directive('ccCvc', require('./cvc'))
  .name;
