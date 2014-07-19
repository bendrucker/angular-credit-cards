'use strict';

var expiration = require('creditcards').expiration;
var angular    = require('angular');

module.exports = function () {
  return {
    restrict: 'AE',
    require: ['?^form'],
    controller: ['$element', function (element) {
      var nullFormCtrl = {
        $setValidity: angular.noop
      };
      var parentForm = element.inheritedData('$formController') || nullFormCtrl;

      var exp = {};
      this.set = function (key, value) {
        exp[key] = value;
        this.$setValidity(
          typeof exp.month !== 'undefined' &&
          exp.year &&
          expiration.isFuture(exp.month, exp.year)
        );
      };

      this.$setValidity = function (valid) {
        parentForm.$setValidity('ccExp', valid, element);
      };
    }]
  };
};

var nullCcExpCtrl = {
  set: angular.noop
};

module.exports.month = function () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function (element, attributes) {
      attributes.$set('maxlength', 2);
      attributes.$set('pattern', '[0-9]*');

      return function (scope, element, attributes, controllers) {
        var ngModelCtrl = controllers[0];
        var ccExpCtrl = controllers[1] || nullCcExpCtrl;
        ngModelCtrl.$parsers.unshift(function (month) {
          month = expiration.month.parse(month);
          var valid = expiration.month.isValid(month);
          ngModelCtrl.$setValidity('ccExpMonth', valid);
          if (!valid) month = void 0;
          ccExpCtrl.set('month', month);
          return month;
        });
      };
    }
  };
};

module.exports.year = function () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function (element, attributes) {
      attributes.$set('maxlength', 2);
      attributes.$set('pattern', '[0-9]*');

      return function (scope, element, attributes, controllers) {
        var ngModelCtrl = controllers[0];
        var ccExpCtrl = controllers[1] || nullCcExpCtrl;
        ngModelCtrl.$parsers.unshift(function (year) {
          year = expiration.year.parse(year, true);
          var valid = expiration.year.isValid(year) && expiration.year.isFuture(year);
          ngModelCtrl.$setValidity('ccExpYear', valid);
          if (!valid) year = void 0;
          ccExpCtrl.set('year', year);
          return year;
        });
      };
    }
  };
};
