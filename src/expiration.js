'use strict'

import angular from 'angular'
import {expiration} from 'creditcards'
const {month, year, isPast} = expiration
import {partialRight} from 'ap'

export default function ccExp () {
  return {
    restrict: 'AE',
    require: 'ccExp',
    controller: CcExpController,
    link: (scope, element, attributes, ccExp) => {
      ccExp.$watch()
    }
  }
}

CcExpController.$inject = ['$scope', '$element']
function CcExpController ($scope, $element) {
  const nullFormCtrl = {
    $setValidity: angular.noop
  }
  const parentForm = $element.inheritedData('$formController') || nullFormCtrl
  const ngModel = {
    year: {},
    month: {}
  }
  this.setMonth = (monthCtrl) => {
    ngModel.month = monthCtrl
  }
  this.setYear = (yearCtrl) => {
    ngModel.year = yearCtrl
  }
  function setValidity ({month, year}) {
    const valid = !!month && !!year && !isPast(month, year)
    parentForm.$setValidity('ccExp', valid, $element)
  }
  this.$watch = function $watchExp () {
    $scope.$watch(() => {
      return {
        month: ngModel.month.$modelValue,
        year: ngModel.year.$modelValue
      }
    }, setValidity, true)
  }
}

const nullCcExp = {
  setMonth: angular.noop,
  setYear: angular.noop
}

export function ccExpMonth () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: (element, attributes) => {
      attributes.$set('maxlength', 2)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-exp-month')

      return (scope, element, attributes, [ngModel, ccExp]) => {
        ccExp = ccExp || nullCcExp
        ccExp.setMonth(ngModel)
        ngModel.$parsers.unshift(month.parse)
        ngModel.$validators.ccExpMonth = month.isValid
      }
    }
  }
}

export function ccExpYear () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: (element, attributes) => {
      const fullYear = attributes.fullYear !== undefined
      attributes.$set('maxlength', fullYear ? 4 : 2)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-exp-year')

      return (scope, element, attributes, [ngModel, ccExp]) => {
        ccExp = ccExp || nullCcExp
        ccExp.setYear(ngModel)
        ngModel.$parsers.unshift(partialRight(year.parse, !fullYear))
        ngModel.$formatters.unshift((value) => {
          return value ? year.format(value, !fullYear) : ''
        })
        ngModel.$validators.ccExpYear = (value) => {
          return year.isValid(value) && !year.isPast(value)
        }
      }
    }
  }
}
