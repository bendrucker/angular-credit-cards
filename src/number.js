'use strict'

var card = require('creditcards').card

module.exports = factory

factory.$inject = ['$parse']
function factory ($parse) {
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
          if (element.setSelectionRange) {
            element.setSelectionRange(position, position)
          } else if (element.createTextRange) {
            var range = element.createTextRange()
            range.move('character', position)
            range.select()
          }
        }

        if ($attributes.ccEagerType != null) {
          $scope.$watch($viewValue, function eagerTypeCheck (number) {
            if (!number) return
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
          $scope.$watch($viewValue, function formatInput (input, previous) {
            if (!input) return
            var element = $element[0]
            var formatted = card.format(card.parse(input))

            ngModel.$setViewValue(formatted)
            var selectionEnd = element.selectionEnd
            ngModel.$render()
            if (formatted && !formatted.charAt(selectionEnd - 1).trim()) {
              if (previous && previous.length < input.length) {
                selectionEnd++
              } else {
                selectionEnd--
              }
            }
            setCursorPostion(element, selectionEnd)
          })
        }

        ngModel.$parsers.unshift(card.parse)

        ngModel.$validators.ccNumber = function validateCcNumber (number) {
          return card.isValid(number)
        }

        ngModel.$validators.ccNumberType = function validateCcNumberType (number) {
          return card.isValid(number, $parse($attributes.ccType)($scope))
        }
      }
    }
  }
}
