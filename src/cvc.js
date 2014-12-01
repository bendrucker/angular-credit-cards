'use strict';

var cvc = require('creditcards').cvc;

module.exports = function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ccType: '='
    },
    compile: function (element, attributes) {
      attributes.$set('maxlength', 4);
      attributes.$set('pattern', '[0-9]*');
      return function (scope, element, attributes, ngModelController) {
        ngModelController.$validators.ccCvc = function (value) {
          return cvc.isValid(value, scope.ccType);
        };
        scope.$watch('ccType', function () {
          ngModelController.$validate();
        });
      };
    }
  };
};
