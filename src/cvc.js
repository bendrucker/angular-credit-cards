'use strict';

var cvc = require('creditcards').cvc;

module.exports = function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function (element, attributes) {
      attributes.$set('maxlength', 4);
      return function (scope, element, attributes, ngModelController) {
        ngModelController.$parsers.unshift(function (value) {
          var valid = cvc.isValid(value);
          ngModelController.$setValidity('ccCvc', valid);
          if (valid) return value;
        });
      };
    }
  };
};
