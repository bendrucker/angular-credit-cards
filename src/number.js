'use strict';

var card = require('creditcards').card;

module.exports = function ($parse) {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    controller: function () {
      this.type = null;
      this.eagerType = null;
    },
    compile: function (element, attributes) {
      attributes.$set('pattern', '[0-9]*');

      return function (scope, element, attributes, controllers) {
        var ngModelController = controllers[0];
        var ccNumberController = controllers[1];

        scope.$watch(attributes.ngModel, function (number) {
          ngModelController.$ccType = ccNumberController.type = card.type(number);
        });

        function $viewValue () {
          return ngModelController.$viewValue;
        }
        if (typeof attributes.ccEagerType !== 'undefined') {
          scope.$watch($viewValue, function eagerTypeCheck (number) {
            if (!number) return;
            number = card.parse(number);
            ngModelController.$ccEagerType = ccNumberController.eagerType = card.type(number, true);
          });
        }

        scope.$watch(attributes.ccType, function (type) {
          ngModelController.$validate();
        });

        ngModelController.$parsers.unshift(function (number) {
          return card.parse(number);
        });
        ngModelController.$validators.ccNumber = function (number) {
          return card.isValid(number);
        };
        ngModelController.$validators.ccNumberType = function (number) {
          return card.isValid(number, $parse(attributes.ccType)(scope));
        };
      };
    }
  };
};
module.exports.$inject = ['$parse'];
