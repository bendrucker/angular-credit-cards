'use strict'

var card = require('creditcards').card
var array = require('cast-array')
var partial = require('ap').partial

module.exports = factory

factory.$inject = ['$parse', '$timeout']
function factory ($parse, $timeout) {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    controller: function () {
      this.type = null
      this.eagerType = null
    },
    compile: function ($element, $attributes) {
      $attributes.$set('pattern', '[0-9]*')
      $attributes.$set('xAutocompletetype', 'cc-number')

      return function ($scope, $element, $attributes, controllers) {
        var ngModel = controllers[0]
        var ccNumber = controllers[1]

        $scope.$watch($attributes.ngModel, function (number) {
          ngModel.$ccType = ccNumber.type = card.type(number)
        })

        function $viewValue () {
          return ngModel.$viewValue
        }

        function setCursorPostion (element, position) {
          $timeout(function () {
            if (element.setSelectionRange) {
              element.setSelectionRange(position, position)
            } else if (element.createTextRange) {
              var range = element.createTextRange()
              range.move('character', position)
              range.select()
            }
          }, 0)
        }

        if ($attributes.ccEagerType != null) {
          $scope.$watch($viewValue, function eagerTypeCheck (number) {
            number = card.parse(number)
            ngModel.$ccEagerType = ccNumber.eagerType = card.type(number, true)
          })
        }

        if ($attributes.ccType) {
          $scope.$watch($attributes.ccType, function () {
            ngModel.$validate()
          })
        }

        if ($attributes.ccFormat != null) {
          ngModel.$formatters.unshift(card.format)
          $element.on('input', function formatInput () {
            var input = $element.val()
            var previous = $viewValue()
            if (!input) return
            var element = $element[0]
            var formatted = card.format(card.parse(input))

            var selectionEnd = element.selectionEnd
            ngModel.$setViewValue(formatted)
            ngModel.$render()

            if (previous && previous.length < formatted.length) {
              selectionEnd = formatted.length
            }
            setCursorPostion(element, selectionEnd)
          })
        }

        ngModel.$parsers.unshift(card.parse)

        ngModel.$validators.ccNumber = function validateCcNumber (number) {
          return ngModel.$isEmpty(ngModel.$viewValue) || card.isValid(number)
        }

        ngModel.$validators.ccNumberType = function validateCcNumberType (number) {
          if (ngModel.$isEmpty(ngModel.$viewValue)) return true
          var type = $parse($attributes.ccType)($scope)
          if (!type) card.isValid(number)
          return array(type).some(partial(card.isValid, number))
        }
      }
    }
  }
}
