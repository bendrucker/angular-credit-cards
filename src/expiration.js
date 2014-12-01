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
          !!exp.month &&
          !!exp.year &&
          !expiration.isPast(exp.month, exp.year)
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
          ccExpCtrl.set('month', month);
          return month;
        });
        ngModelCtrl.$validators.ccExpMonth = expiration.month.isValid;
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
          ccExpCtrl.set('year', year);
          return year;
        });
        ngModelCtrl.$validators.ccExpYear = function (year) {
          return expiration.year.isValid(year) && !expiration.year.isPast(year);
        };
      };
    }
  };
};
