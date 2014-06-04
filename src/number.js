'use strict';

module.exports = function (creditCard) {
  return {
    restrict: 'AC',
    require: 'ngModel',
    link: function (scope, element, attributes, controller) {
      controller.$parsers.unshift(function (number) {
        var valid = creditCardNumber.validateCardNumber(number);
        controller.$setValidity('creditCardNumber', valid);
        if (valid) return creditCard.format(number);
      });
    }
  };
};
