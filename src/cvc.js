'use strict';

var internals = {};

internals.validate = function (cvc) {
  return /^\d+$/.test(cvc) && cvc.length >= 3 && cvc.length <= 4;
};

module.exports = function () {
  return {
    restrict: 'AC',
    require: 'ngModel',
    link: function (scope, elements, attributes, controller) {
      attributes.$set('minlength', 3);
      attributes.$set('maxlength', 4);

      controller.$parsers.unshift(function (cvc) {
        cvc = cvc && cvc.toString();
        var valid = internals.validate(cvc);
        controller.$setValidity('ccCvc', valid);
        if (valid) return cvc.toString();
      });
    }
  }
};
