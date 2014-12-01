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
          ngModelController.$validate();
          ccNumberController.setType(type);
        });

        ngModelController.$parsers.unshift(function (number) {
          if (!scope.ccType) ccNumberController.setType(card.type(number));
          return card.parse(number);
        });
        ngModelController.$validators.ccNumber = card.luhn;
        ngModelController.$validators.ccNumberType = function (number) {
          return card.isValid(number, scope.ccType);
        };
      };
    }
  };
};
