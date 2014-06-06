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
  }
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
    require: 'ngModel',
    link: function (scope, element, attributes, controller) {
      attributes.$set('maxlength', 2);
      controller.$parsers.unshift(function (month) {
        var valid = internals.validMonth(month);
        controller.$setValidity('ccExpMonth', valid);
        if (valid) return internals.padMonth(month);
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
    require: 'ngModel',
    scope: {
      yearFormat: '@'
    },
    link: function (scope, element, attributes, controller) {
      attributes.$set('maxlength', 2);
      controller.$parsers.unshift(function (year) {
        var valid = internals.validYear(year);
        controller.$setValidity('ccExpYear', valid);
        if (valid) return internals.formatYear(
          year,
          scope.yearFormat || 'YY'
        );
      });
    }
  };
};
