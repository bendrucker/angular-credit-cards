'use strict';

var internals = {};

// module.exports = function () {

// };

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
      element.attr('maxlength', 2);
      controller.$parsers.unshift(function (month) {
        var valid = internals.validMonth(month);
        controller.$setValidity('ccExpMonth', valid);
        if (valid) return internals.padMonth(month);
      });
    }
  }
};

internals.validYear = function (year) {
  if (!year) return false;
  year = parseInt(year);

  // var currentYear = new Date()
  //   .getFullYear()
  //   .toString()
  //   .substring(2, 4);
  // year = 
};

module.exports.year = function () {
  return {
    restrict: 'AC',
    require: 'ngModel',
    scope: {
      yearFormat: '@'
    },
    link: function (scope, element, attributes, controller) {
      element.attr('maxlength', 2);
    }
  }
};
