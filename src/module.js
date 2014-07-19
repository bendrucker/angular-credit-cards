'use strict';

require('angular')
  .module('credit-cards', [])
  .value('creditCards', require('creditcards'))
  .directive('ccNumber', require('./number'))
  .directive('ccExp', require('./expiration'))
  .directive('ccExpMonth', require('./expiration').month)
  .directive('ccExpYear', require('./expiration').year)
  .directive('ccCvc', require('./cvc'));

module.exports = 'credit-cards';
