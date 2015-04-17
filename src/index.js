'use strict'

import angular from 'angular'
import creditcards from 'creditcards'
import number from './number'
import {default as ccExp, ccExpMonth, ccExpYear} from './expiration'
import cvc from './cvc'

export default angular
  .module('credit-cards', [])
  .value('creditcards', creditcards)
  .directive('ccNumber', number)
  .directive('ccExp', ccExp)
  .directive('ccExpMonth', ccExpMonth)
  .directive('ccExpYear', ccExpYear)
  .directive('ccCvc', cvc)
  .name
