'use strict';

var expiration = require('creditcards').expiration;
var angular    = require('angular');
var internals  = {};

internals.Date = function (month, year) {
  this.month = new internals.Month(month);
  this.year = new internals.Year(year);
};

internals.Date.today = function () {
  var today = new Date();
  return {
    month: today.getMonth() + 1,
    year: today.getFullYear()
  };
};

internals.Date.prototype.isCurrent = function () {
  return this.year.isCurrent() && this.month.month === internals.Date.today().month;
};

internals.Date.prototype.isFuture = function () {
  return this.year.isValid() && this.month.isValid() && this.month.month > internals.Date.today().month;
};

module.exports = function () {
  return {
    restrict: 'AEC',
    require: ['?^form'],
    controller: ['$element', function (element) {
      var nullFormCtrl = {
        $setValidity: angular.noop
      };
      var parentForm = element.inheritedData('$formController') || nullFormCtrl;
      var expiration = new internals.Date();

      this.set = function (key, object) {
        if (object && object.hasOwnProperty(key)) {
          expiration[key] = value;
        } else {
          expiration[key].set(object);
        }
        this.setValidity(expiration.isCurrent() || expiration.isFuture());
      };

      this.setValidity = function (valid) {
        parentForm.$setValidity('ccExp', valid, element);
      };
    }]
  };
};

internals.nullCcExpCtrl = {
  set: angular.noop
};

internals.Month = function (value) {
  this.set(value);
};

internals.Month.prototype.set = function (value) {
  this.value = value;
  this.month = parseInt(value);
};

internals.Month.prototype.isValid = function () {
  return !isNaN(this.month) && this.month >= 1 && this.month <= 12;
};

internals.Month.prototype.format = function (pad) {
  if (!this.isValid()) return;
  var month = this.month.toString();
  if (!pad) return month;
  return month.length === 2 ? month : '0' + month;
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
        var ccExpCtrl = controllers[1] || internals.nullCcExpCtrl;
        ngModelCtrl.$parsers.unshift(function (month) {
          month = expiration.month.parse(month);
          ngModelCtrl.$setValidity('ccExpMonth', expiration.month.isValid(month));
          ccExpCtrl.set('month', month);
          return month;
        });
      };
    }
  };
};

internals.Year = function (value) {
  this.set(value);
};

internals.Year.prototype.set = function (value) {
  this.value = value;
  this.year = parseInt('20' + value);
};

internals.Year.prototype.isValid = function () {
  return this.year && !isNaN(this.year) && this.year >= internals.Date.today().year;
};

internals.Year.prototype.isCurrent = function () {
  return this.year === internals.Date.today().year;
};

internals.Year.prototype.format = function (length) {
  if (!this.isValid()) return;
  var year = this.year.toString();
  switch (length) {
    case 4: return year;
    default: return year.substring(2, 4);
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
      var ngModelCtrl = controllers[0];
      var ccExpCtrl = controllers[1] || internals.nullCcExpCtrl;
      ngModelCtrl.$parsers.unshift(function (year) {
        year = new internals.Year(year);
        ngModelCtrl.$setValidity('ccExpYear', year.isValid());
        ccExpCtrl.set('year', year);
        return year.format(scope.yearFormat && scope.yearFormat.length);
      });
    }
  };
};
