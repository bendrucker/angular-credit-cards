'use strict'

import angular from 'angular'
import {cvc} from 'creditcards'
export default factory

factory.$inject = ['$parse']
function factory ($parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: (element, attributes) => {
      attributes.$set('maxlength', 4)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-csc')

      return (scope, element, attributes, ngModel) => {
        ngModel.$validators.ccCvc = (value) => {
          return cvc.isValid(value, $parse(attributes.ccType)(scope))
        }
        if (attributes.ccType) {
          scope.$watch(attributes.ccType, angular.bind(ngModel, ngModel.$validate))
        }
      }
    }
  }
}
