'use strict';

var internals = {};

module.exports = function () {
  return {
    restrict: 'AEC',
    require: ['?^form'],
    controller: ['$element', function (element) {
      var parentForm = element.inheritedData('$formController');

      var expiration = {};

      this.$set = function (key, value) {
        if (key) expiration[key] = value;
        checkValidity();
      };

      var checkValidity = function () {
        var valid;
        var month = expiration.month;
        var year = expiration.year;
        var today = new Date();
        if (!month || !year) {
          valid = false;
        }
        else if (parseInt(year.length === 4 ? year : '20' + year) > today.getFullYear()) {
          valid = true;
        }
        else if (parseInt(month) >= today.getMonth() + 1) {
          valid = true;
        } else {
          valid = false;
        }
        if (parentForm) return parentForm.$setValidity('ccExpiration', valid, element);
      };
    }]
  };
};

internals.validMonth = function (month) {
  if (!month) return false;
  month = parseInt(month, 10);
  if (isNaN(month) || month > 12 || month < 1) return false;
  return true;
};

internals.padMonth = function (month) {
  month = month.toString();
  return month.length === 1 ? '0' + month : month;
};

module.exports.month = function () {
  return {
    restrict: 'AC',
    require: ['ngModel', '^?ccExp'],
    link: function (scope, element, attributes, controllers) {
      var ngModelController = controllers[0];
      var ccExpController = controllers[1];
      attributes.$set('maxlength', 2);
      ngModelController.$parsers.unshift(function (month) {
        var valid = internals.validMonth(month);
        ngModelController.$setValidity('ccExpMonth', valid);
        if (valid) {
          month = internals.padMonth(month);
          if (ccExpController) ccExpController.$set('month', month);
          return month;
        }
        else {
          if (ccExpController) ccExpController.$set('month');
        }
      });
    }
  };
};

internals.validYear = function (year) {
  if (!year) return false;
  year = parseInt(year);
  if (isNaN(year)) return false;
  var currentYear = parseInt(new Date()
    .getFullYear()
    .toString()
    .substring(2, 4));
  if (year < currentYear) return false;
  return true;
};

internals.formatYear = function (year, format) {
  year = year.toString();
  switch (format) {
    case 'YY': return year;
    case 'YYYY': return '20' + year;
  }
};

module.exports.year = function () {
  return {
    restrict: 'AC',
    require: ['ngModel', '^?ccExp'],
    scope: {
      yearFormat: '@'
    },
    link: function (scope, element, attributes, controllers) {
      attributes.$set('maxlength', 2);
      var ngModelController = controllers[0];
      var ccExpController = controllers[1];
      ngModelController.$parsers.unshift(function (year) {
        var valid = internals.validYear(year);
        ngModelController.$setValidity('ccExpYear', valid);
        if (valid) {
          year = internals.formatYear(
            year,
            scope.yearFormat || 'YY'
          );
          if (ccExpController) ccExpController.$set('year', year);
          return year;
        } else {
          if (ccExpController) ccExpController.$set('year');
        }
      });
    }
  };
};
