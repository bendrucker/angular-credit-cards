'use strict';

var expiration = require('creditcards').expiration;
var angular    = require('angular');

module.exports = function () {
  return {
    restrict: 'AE',
    require: 'ccExp',
    controller: ExpController,
    link: function (scope, element, attributes, controller) {
      controller.$watch();
    }
  };
};

function ExpController ($scope, $element) {
  var nullFormCtrl = {
    $setValidity: angular.noop
  };
  var parentForm = $element.inheritedData('$formController') || nullFormCtrl;
  var month = {};
  var year = {};
  this.setMonth = function (monthCtrl) {
    month = monthCtrl;
  };
  this.setYear = function (yearCtrl) {
    year = yearCtrl;
  };
  function validate (exp) {
    var valid = !!exp.month && !!exp.year && !expiration.isPast(exp.month, exp.year);
    parentForm.$setValidity('ccExp', valid, $element);
  }
  this.$watch = function $watch () {
    $scope.$watch(function () {
      return {
        month: month.$modelValue,
        year: year.$modelValue
      };
    }, validate, true);
  };
}
ExpController.$inject = ['$scope', '$element'];

var nullCcExpCtrl = {
  setMonth: angular.noop,
  setYear: angular.noop
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
        ccExpCtrl.setMonth(ngModelCtrl);
        ngModelCtrl.$parsers.unshift(function (month) {
          month = expiration.month.parse(month);
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
        ccExpCtrl.setYear(ngModelCtrl);
        ngModelCtrl.$parsers.unshift(function (year) {
          year = expiration.year.parse(year, true);
          return year;
        });
        ngModelCtrl.$validators.ccExpYear = function (year) {
          return expiration.year.isValid(year) && !expiration.year.isPast(year);
        };
      };
    }
  };
};
