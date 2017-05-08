'use strict'

var creditcards = require('creditcards')
var number = require('./number')
var cvc = require('./cvc')
var expiration = require('./expiration')

module.exports = angular // eslint-disable-line no-undef
  .module('credit-cards', [])
  .value('creditcards', creditcards)
  .directive('ccNumber', number)
  .directive('ccExp', expiration)
  .directive('ccExpMonth', expiration.month)
  .directive('ccExpYear', expiration.year)
  .directive('ccCvc', cvc)
  .name
