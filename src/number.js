'use strict';

var card      = require('creditcards').card;

module.exports = function () {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    controller: function () {
      this.setType = function (type) {
        this.$type = type;
      };
    },
    compile: function () {
      return function (scope, element, attributes, controllers) {
        var ngModelController = controllers[0];
        var ccNumberController = controllers[1];

        scope.$watch(function () {
          return ccNumberController.$type;
        }, function (type) {
          ngModelController.$type = type;
        });

        ngModelController.$parsers.unshift(function (number) {
          number = card.parse(number);
          var valid = card.luhn(number);
          ngModelController.$setValidity('ccNumber', valid);
          ccNumberController.setType(card.type(number));
          if (valid) return number;
        });
      };
    }
  };
};
