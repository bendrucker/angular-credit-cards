'use strict';

require('angular').module('credit-cards')
  .value('creditCard', require('creditcard'))
  .directive('creditCardNumber', [
    'creditCard'
    require('./number')
  ])
  .directive('creditCardExpiration'), require('./expiration'))
  .directive('creditCardExpirationMonth', require('./expiration').month),
  .directive('creditCardExpirationYear', require('./expiration').year)
  .directive('creditCardCvc', require('./cvc'));

module.exports = 'credit-cards';
