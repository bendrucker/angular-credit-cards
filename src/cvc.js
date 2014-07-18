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
        ngModelController.$parsers.unshift(function (value) {
          var valid = cvc.isValid(value, scope.ccType);
          ngModelController.$setValidity('ccCvc', valid);
          if (valid) return value;
        });
        scope.$watch('ccType', function () {
          ngModelController.$setViewValue(ngModelController.$viewValue);
        });
      };
    }
  };
};
