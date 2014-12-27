'use strict';

var cvc = require('creditcards').cvc;

module.exports = function ($parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function (element, attributes) {
      attributes.$set('maxlength', 4);
      attributes.$set('pattern', '[0-9]*');
      return function (scope, element, attributes, ngModelController) {
        ngModelController.$validators.ccCvc = function (value) {
          return cvc.isValid(value, $parse(attributes.ccType)(scope));
        };
        scope.$watch(attributes.ccType, function () {
          ngModelController.$validate();
        });
      };
    }
  };
};
module.exports.$inject = ['$parse'];