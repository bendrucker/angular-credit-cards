!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.angularCreditCards=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./src');

},{"./src":7}],2:[function(require,module,exports){
var sentence = require('sentence-case');

/**
 * Camel case a string.
 *
 * @param  {String} string
 * @return {String}
 */
module.exports = function (string) {
  return sentence(string)
    // Replace periods between numeric entities with an underscore.
    .replace(/\./g, '_')
    // Replace spaces between words with a string upper cased character.
    .replace(/ (\w)/g, function (_, $1) {
      return $1.toUpperCase();
    });
};

},{"sentence-case":3}],3:[function(require,module,exports){
/**
 * Sentence case a string.
 *
 * @param  {String} string
 * @return {String}
 */
module.exports = function (string) {
  return String(string)
    // Add camel case support.
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    // Remove every non-word character and replace with a period.
    .replace(/[^a-zA-Z0-9]+/g, '.')
    // Replace every period not between two numbers with a space.
    .replace(/(?!\d\.\d)(^|.)\./g, '$1 ')
    // Trim whitespace from the string.
    .replace(/^ | $/g, '')
    // Finally lower case the entire string.
    .toLowerCase();
};

},{}],4:[function(require,module,exports){
'use strict';

var camel = require('camel-case');

exports.types = {
  visa: {
    name: 'Visa',
    pattern: /^4[0-9]{12}(?:[0-9]{3})?$/,
    cvcLength: 3
  },
  masterCard: {
    name: 'MasterCard',
    pattern: /^5[1-5][0-9]{14}$/,
    cvcLength: 3
  },
  americanExpress: {
    name: 'American Express',
    pattern: /^3[47][0-9]{13}$/,
    cvcLength: 4
  },
  dinersClub: {
    name: 'Diners Club',
    pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    cvcLength: 3
  },
  discover: {
    name: 'Discover',
    pattern: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    cvcLength: 3
  },
  jcb: {
    name: 'JCB',
    pattern: /^(?:2131|1800|35\d{3})\d{11}$/,
    cvcLength: 3
  }
};

exports.parse = function (number) {
  if (typeof number !== 'string') return '';
  return number.replace(/[^\d]/g, '');
};

exports.type = function (number) {
  for (var typeName in exports.types) {
    var type = exports.types[typeName];
    if (type.pattern.test(number)) return exports.types[typeName].name;
  }
};

exports.luhn = function (number) {
  if (!number) return false;
  // https://gist.github.com/ShirtlessKirk/2134376
  var len = number.length;
  var mul = 0;
  var prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]];
  var sum = 0;

  while (len--) {
    sum += prodArr[mul][parseInt(number.charAt(len), 10)];
    mul ^= 1;
  }

  return sum % 10 === 0 && sum > 0;
};

exports.isValid = function (number, type) {
  if (!type) return exports.luhn(number) && !!exports.type(number);
  return exports.luhn(number) && exports.types[camel(type)].pattern.test(number);
};

},{"camel-case":2}],5:[function(require,module,exports){
'use strict';

var camel = require('camel-case');
var card  = require('./card');

var cvcRegex = /^\d{3,4}$/;

exports.isValid = function (cvc, type) {
  if (typeof cvc !== 'string') return false;
  if (!cvcRegex.test(cvc)) return false;
  if (!type) return true;
  return card.types[camel(type)].cvcLength === cvc.length;
};

},{"./card":4,"camel-case":2}],6:[function(require,module,exports){
'use strict';

exports.isPast = function (month, year) {
  return Date.now() >= new Date(year, month);
};

exports.month = {
  parse: function (month) {
    return ~~month || void 0;
  },
  isValid: function (month) {
    if (typeof month !== 'number') return false;
    return month >= 1 && month <= 12;
  }
};

exports.year = {
  parse: function (year, pad) {
    year = ~~year;
    if (!pad) return year;
    var base = new Date().getFullYear().toString().substr(0, 2);
    var str = base + (year.toString().length === 2 ? year : '0' + year);
    return ~~str || void 0;
  },
  isValid: function (year) {
    if (typeof year !== 'number') return false;
    return year > 0;
  },
  isPast: function (year) {
    return new Date().getFullYear() > year;
  }
};

},{}],7:[function(require,module,exports){
'use strict';

var card = exports.card = require('./card');
var cvc = exports.cvc = require('./cvc');
var expiration = exports.expiration = require('./expiration');

exports.validate = function (cardObj) {
  return {
    card: {
      type: card.type(cardObj.number),
      number: cardObj.number,
      expirationMonth: cardObj.expirationMonth,
      expirationYear: cardObj.expirationYear,
      cvc: cardObj.cvc
    },
    validCardNumber: card.luhn(cardObj.number),
    validExpirationMonth: expiration.month.isValid(cardObj.expirationMonth),
    validExpirationYear: expiration.year.isValid(cardObj.expirationYear),
    validCvc: cvc.isValid(cardObj.cvc),
    expired: expiration.isPast(cardObj.expirationMonth, cardObj.expirationYear)
  }
};

},{"./card":4,"./cvc":5,"./expiration":6}],8:[function(require,module,exports){
'use strict';

var cvc = require('creditcards').cvc;

module.exports = function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ccType: '='
    },
    compile: function (element, attributes) {
      attributes.$set('maxlength', 4);
      attributes.$set('pattern', '[0-9]*');
      return function (scope, element, attributes, ngModelController) {
        ngModelController.$parsers.unshift(function (value) {
          var valid = cvc.isValid(value, scope.ccType);
          ngModelController.$setValidity('ccCvc', valid);
          if (valid) return value;
        });
        scope.$watch('ccType', function () {
          ngModelController.$setViewValue(ngModelController.$viewValue);
        });
      };
    }
  };
};

},{"creditcards":1}],9:[function(require,module,exports){
(function (global){
'use strict';

var expiration = require('creditcards').expiration;
var angular    = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

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
          exp.month &&
          exp.year &&
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
          var valid = expiration.month.isValid(month);
          ngModelCtrl.$setValidity('ccExpMonth', valid);
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
          var valid = expiration.year.isValid(year) && !expiration.year.isPast(year);
          ngModelCtrl.$setValidity('ccExpYear', valid);
          ccExpCtrl.set('year', year);
          return year;
        });
      };
    }
  };
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"creditcards":1}],10:[function(require,module,exports){
(function (global){
'use strict';

(typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null)
  .module('credit-cards', [])
  .value('creditcards', require('creditcards'))
  .directive('ccNumber', require('./number'))
  .directive('ccExp', require('./expiration'))
  .directive('ccExpMonth', require('./expiration').month)
  .directive('ccExpYear', require('./expiration').year)
  .directive('ccCvc', require('./cvc'));

module.exports = 'credit-cards';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cvc":8,"./expiration":9,"./number":11,"creditcards":1}],11:[function(require,module,exports){
'use strict';

var card      = require('creditcards').card;

module.exports = function () {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    scope: {
      ccType: '='
    },
    controller: function () {
      this.setType = function (type) {
        this.$type = type;
      };
    },
    compile: function (element, attributes) {
      attributes.$set('pattern', '[0-9]*');

      return function (scope, element, attributes, controllers) {
        var ngModelController = controllers[0];
        var ccNumberController = controllers[1];

        scope.$watch(function () {
          return ccNumberController.$type;
        }, function (type) {
          ngModelController.$type = type;
        });

        scope.$watch('ccType', function (type) {
          ngModelController.$setViewValue(ngModelController.$viewValue);
          ccNumberController.setType(type);
        });

        ngModelController.$parsers.unshift(function (number) {
          number = card.parse(number);
          var valid = card.isValid(number, scope.ccType);
          ngModelController.$setValidity('ccNumber', card.luhn(number));
          ngModelController.$setValidity('ccNumberType', valid);
          if (!scope.ccType) ccNumberController.setType(card.type(number));
          if (valid) return number;
        });
      };
    }
  };
};

},{"creditcards":1}]},{},[10])(10)
});