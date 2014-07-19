'use strict';

var card      = require('creditcards').card;

module.exports = function () {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    scope: {
      ccType: '='
    },
    controller: function () {
      this.setType = function (type) {
        this.$type = type;
      };
    },
    compile: function (element, attributes) {
      attributes.$set('pattern', '[0-9]*');

      return function (scope, element, attributes, controllers) {
        var ngModelController = controllers[0];
        var ccNumberController = controllers[1];

        scope.$watch(function () {
          return ccNumberController.$type;
        }, function (type) {
          ngModelController.$type = type;
        });

        scope.$watch('ccType', function (type) {
          ngModelController.$setViewValue(ngModelController.$viewValue);
          ccNumberController.setType(type);
        });

        ngModelController.$parsers.unshift(function (number) {
          number = card.parse(number);
          var valid = card.isValid(number, scope.ccType);
          ngModelController.$setValidity('ccNumber', card.luhn(number));
          ngModelController.$setValidity('ccNumberType', valid);
          if (!scope.ccType) ccNumberController.setType(card.type(number));
          if (valid) return number;
        });
      };
    }
  };
};
