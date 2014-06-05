'use strict';

require('angular')
  .module('credit-cards', [])
  .value('creditCard', require('creditcard'))
  .directive('ccNumber', [
    'creditCard',
    require('./number')
  ])
  // .directive('ccExpiration'), require('./expiration'))
  .directive('ccExpirationMonth', require('./expiration').month)
  .directive('ccExpirationYear', require('./expiration').year)
  .directive('ccCvc', require('./cvc'));

module.exports = 'credit-cards';
