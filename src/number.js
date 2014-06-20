'use strict';

var angular   = require('angular');
var internals = {};

internals.className = function (type) {
  return 'cc-' + type.toLowerCase().replace(' ', '-');
};

module.exports = function (creditCard) {
  return {
    restrict: 'AC',
    require: ['ngModel', 'ccNumber'],
    controller: ['$element', function (element) {
      this.setType = function (type) {
        var previous = this.type;
        var current = this.type = type;
        if (previous === current) {
          return;
        }
        else {
          if (previous) {
            element.removeClass(internals.className(previous));
          }
          if (current) {
            element.addClass(internals.className(current));
          }
        }
      };
    }],
    compile: function () {
      return {
        post: function (scope, element, attributes, controllers) {
          var ngModelController = controllers[0];
          var ccNumberController = controllers[1];

          scope.$watch(function () {
            return ccNumberController.type;
          }, function (type) {
            ngModelController.cardType = type;
          });

          ngModelController.$parsers.unshift(function (number) {
            var valid = creditCard.validate(number);
            ngModelController.$setValidity('ccNumber', valid);
            ccNumberController.setType(creditCard.cardscheme(number));
            if (valid) return creditCard.format(number);
          });
        }
      };
    }
  };
};
