(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularCreditCards = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

var _angular2 = _interopRequireDefault(_angular);

var _creditcards = require('creditcards');

var _creditcards2 = _interopRequireDefault(_creditcards);

var _number = require('./number');

var _number2 = _interopRequireDefault(_number);

var _expiration = require('./expiration');

var _expiration2 = _interopRequireDefault(_expiration);

var _cvc = require('./cvc');

var _cvc2 = _interopRequireDefault(_cvc);

'use strict';

exports['default'] = _angular2['default'].module('credit-cards', []).value('creditcards', _creditcards2['default']).directive('ccNumber', _number2['default']).directive('ccExp', _expiration2['default']).directive('ccExpMonth', _expiration.ccExpMonth).directive('ccExpYear', _expiration.ccExpYear).directive('ccCvc', _cvc2['default']).name;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cvc":14,"./expiration":15,"./number":16,"creditcards":13}],2:[function(require,module,exports){
exports = module.exports = ap;
function ap (args, fn) {
    return function () {
        var rest = [].slice.call(arguments)
            , first = args.slice()
        first.push.apply(first, rest)
        return fn.apply(this, first);
    };
}

exports.pa = pa;
function pa (args, fn) {
    return function () {
        var rest = [].slice.call(arguments)
        rest.push.apply(rest, args)
        return fn.apply(this, rest);
    };
}

exports.apa = apa;
function apa (left, right, fn) {
    return function () {
        return fn.apply(this,
            left.concat.apply(left, arguments).concat(right)
        );
    };
}

exports.partial = partial;
function partial (fn) {
    var args = [].slice.call(arguments, 1);
    return ap(args, fn);
}

exports.partialRight = partialRight;
function partialRight (fn) {
    var args = [].slice.call(arguments, 1);
    return pa(args, fn);
}

exports.curry = curry;
function curry (fn) {
    return partial(partial, fn);
}

exports.curryRight = function curryRight (fn) {
    return partial(partialRight, fn);
}

},{}],3:[function(require,module,exports){
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

},{"sentence-case":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],6:[function(require,module,exports){
'use strict';

exports.types = require('./types');

},{"./types":8}],7:[function(require,module,exports){
'use strict';

var extend = require('xtend/mutable');

function CardType (name, config) {
  extend(this, {name: name}, config);
}

CardType.prototype.cvcLength = 3;

CardType.prototype.luhn = true;

CardType.prototype.groupPattern = /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/;

CardType.prototype.group = function (number) {
  return (number.match(this.groupPattern) || [])
    .slice(1)
    .filter(identity);
};

CardType.prototype.test = function (number, eager) {
  return this[eager ? 'eagerPattern' : 'pattern'].test(number);
};

module.exports = CardType;

function identity (value) {
  return value;
}

},{"xtend/mutable":5}],8:[function(require,module,exports){
'use strict';

var Type = require('./type');

var group19 = /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?(\d{1,3})?/;

exports.visa = new Type('Visa', {
  pattern: /^4\d{12}(\d{3})?$/,
  eagerPattern: /^4/
});

exports.maestro = new Type('Maestro', {
  pattern: /^(?:5[0678]\d\d|6304|6390|67\d\d)\d{8,15}$/,
  eagerPattern: /^(5(018|0[23]|[68])|6[37])/,
  groupPattern: group19
});

exports.forbrugsforeningen = new Type('Forbrugsforeningen', {
  pattern: /^600722\d{10}$/,
  eagerPattern: /^600/
});

exports.dankort = new Type('Dankort', {
  pattern: /^5019\d{12}$/,
  eagerPattern: /^5019/
});

exports.masterCard = new Type('MasterCard', {
  pattern: /^5[1-5]\d{14}$/,
  eagerPattern: /^5[1-5]/
});

exports.americanExpress = new Type('American Express', {
  pattern: /^3[47]\d{13}$/,
  eagerPattern: /^3[47]/,
  groupPattern: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
  cvcLength: 4
});

exports.dinersClub = new Type('Diners Club', {
  pattern: /^3(0[0-5]|[68]\d)\d{11}$/,
  eagerPattern: /^3(0|[68])/,
  groupPattern: /(\d{1,4})?(\d{1,6})?(\d{1,4})?/
});

exports.discover = new Type('Discover', {
  pattern: /^6(011|[45]\d{2})\d{12}$/,
  eagerPattern: /^6([45]|01)/
});

exports.jcb = new Type('JCB', {
  pattern: /^35\d{14}$/,
  eagerPattern: /^35/
});

exports.unionPay = new Type('UnionPay', {
  pattern: /^62[0-5]\d{13,16}$/,
  eagerPattern: /^62/,
  groupPattern: group19,
  luhn: false
});

},{"./type":7}],9:[function(require,module,exports){
'use strict';

module.exports = (function (array) {
  return function luhn (number) {
    if (!number) return false;
    var length = number.length;
    var bit = 1;
    var sum = 0;
    var value;

    while (length) {
      value = parseInt(number.charAt(--length), 10);
      sum += (bit ^= 1) ? array[value] : value;
    }

    return sum && sum % 10 === 0;
  };
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

},{}],10:[function(require,module,exports){
'use strict'

var camel = require('camel-case')
var luhn = require('fast-luhn')

exports.types = require('creditcards-types').types

exports.parse = function (number) {
  if (typeof number !== 'string') return ''
  return number.replace(/[^\d]/g, '')
}

exports.format = function (number, separator) {
  var type = getType(number, true)
  if (!type) return number
  return type.group(number).join(separator || ' ')
}

exports.type = function (number, eager) {
  var type = getType(number, eager)
  return type ? type.name : undefined
}

exports.luhn = luhn

exports.isValid = function (number, type) {
  if (!type) type = exports.type(number)
  type = exports.types[camel(type)]
  if (!type) return false
  return (!type.luhn || luhn(number)) && type.test(number)
}

function getType (number, eager) {
  for (var typeName in exports.types) {
    var type = exports.types[typeName]
    if (type.test(number, eager)) return exports.types[typeName]
  }
}

},{"camel-case":3,"creditcards-types":6,"fast-luhn":9}],11:[function(require,module,exports){
'use strict'

var camel = require('camel-case')
var card = require('./card')

var cvcRegex = /^\d{3,4}$/

exports.isValid = function (cvc, type) {
  if (typeof cvc !== 'string') return false
  if (!cvcRegex.test(cvc)) return false
  if (!type) return true
  return card.types[camel(type)].cvcLength === cvc.length
}

},{"./card":10,"camel-case":3}],12:[function(require,module,exports){
'use strict'

exports.isPast = function (month, year) {
  return Date.now() >= new Date(year, month)
}

exports.month = {
  parse: function (month) {
    return ~~month || void 0
  },
  isValid: function (month) {
    if (typeof month !== 'number') return false
    return month >= 1 && month <= 12
  }
}

var base = new Date().getFullYear().toString().substr(0, 2)

function twoDigit (number) {
  return number >= 10 ? number : '0' + number
}

exports.year = {
  parse: function (year, pad) {
    year = ~~year
    if (!pad) return year || void 0
    return ~~(base + twoDigit(year))
  },
  format: function (year, strip) {
    year = year.toString()
    return strip ? year.substr(2, 4) : year
  },
  isValid: function (year) {
    if (typeof year !== 'number') return false
    return year > 0
  },
  isPast: function (year) {
    return new Date().getFullYear() > year
  }
}

},{}],13:[function(require,module,exports){
'use strict'

var card = exports.card = require('./card')
var cvc = exports.cvc = require('./cvc')
var expiration = exports.expiration = require('./expiration')

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
}

},{"./card":10,"./cvc":11,"./expiration":12}],14:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

var _angular2 = _interopRequireDefault(_angular);

var _creditcards = require('creditcards');

'use strict';

exports['default'] = factory;

factory.$inject = ['$parse'];
function factory($parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function compile(element, attributes) {
      attributes.$set('maxlength', 4);
      attributes.$set('pattern', '[0-9]*');
      attributes.$set('xAutocompletetype', 'cc-csc');

      return function (scope, element, attributes, ngModel) {
        ngModel.$validators.ccCvc = function (value) {
          return _creditcards.cvc.isValid(value, $parse(attributes.ccType)(scope));
        };
        if (attributes.ccType) {
          scope.$watch(attributes.ccType, _angular2['default'].bind(ngModel, ngModel.$validate));
        }
      };
    }
  };
}
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"creditcards":13}],15:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = ccExp;
exports.ccExpMonth = ccExpMonth;
exports.ccExpYear = ccExpYear;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

var _angular2 = _interopRequireDefault(_angular);

var _creditcards = require('creditcards');

var _ap = require('ap');

'use strict';

var month = _creditcards.expiration.month;
var year = _creditcards.expiration.year;
var isPast = _creditcards.expiration.isPast;

function ccExp() {
  return {
    restrict: 'AE',
    require: 'ccExp',
    controller: CcExpController,
    link: function link(scope, element, attributes, ccExp) {
      ccExp.$watch();
    }
  };
}

CcExpController.$inject = ['$scope', '$element'];
function CcExpController($scope, $element) {
  var nullFormCtrl = {
    $setValidity: _angular2['default'].noop
  };
  var parentForm = $element.inheritedData('$formController') || nullFormCtrl;
  var ngModel = {
    year: {},
    month: {}
  };
  this.setMonth = function (monthCtrl) {
    ngModel.month = monthCtrl;
  };
  this.setYear = function (yearCtrl) {
    ngModel.year = yearCtrl;
  };
  function setValidity(_ref) {
    var month = _ref.month;
    var year = _ref.year;

    var valid = !!month && !!year && !isPast(month, year);
    parentForm.$setValidity('ccExp', valid, $element);
  }
  this.$watch = function $watchExp() {
    $scope.$watch(function () {
      return {
        month: ngModel.month.$modelValue,
        year: ngModel.year.$modelValue
      };
    }, setValidity, true);
  };
}

var nullCcExp = {
  setMonth: _angular2['default'].noop,
  setYear: _angular2['default'].noop
};

function ccExpMonth() {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function compile(element, attributes) {
      attributes.$set('maxlength', 2);
      attributes.$set('pattern', '[0-9]*');
      attributes.$set('xAutocompletetype', 'cc-exp-month');

      return function (scope, element, attributes, _ref2) {
        var _ref22 = _slicedToArray(_ref2, 2);

        var ngModel = _ref22[0];
        var ccExp = _ref22[1];

        ccExp = ccExp || nullCcExp;
        ccExp.setMonth(ngModel);
        ngModel.$parsers.unshift(month.parse);
        ngModel.$validators.ccExpMonth = month.isValid;
      };
    }
  };
}

function ccExpYear() {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function compile(element, attributes) {
      var fullYear = attributes.fullYear !== undefined;
      attributes.$set('maxlength', fullYear ? 4 : 2);
      attributes.$set('pattern', '[0-9]*');
      attributes.$set('xAutocompletetype', 'cc-exp-year');

      return function (scope, element, attributes, _ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var ngModel = _ref32[0];
        var ccExp = _ref32[1];

        ccExp = ccExp || nullCcExp;
        ccExp.setYear(ngModel);
        ngModel.$parsers.unshift(_ap.partialRight(year.parse, !fullYear));
        ngModel.$formatters.unshift(function (value) {
          return value ? year.format(value, !fullYear) : '';
        });
        ngModel.$validators.ccExpYear = function (value) {
          return year.isValid(value) && !year.isPast(value);
        };
      };
    }
  };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"ap":2,"creditcards":13}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _creditcards = require('creditcards');

'use strict';

exports['default'] = factory;

factory.$inject = ['$parse'];
function factory($parse) {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    controller: function controller() {
      this.type = null;
      this.eagerType = null;
    },
    compile: function compile($element, $attributes) {
      $attributes.$set('pattern', '[0-9]*');
      $attributes.$set('xAutocompletetype', 'cc-number');

      return function ($scope, $element, $attributes, _ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var ngModel = _ref2[0];
        var ccNumber = _ref2[1];

        $scope.$watch($attributes.ngModel, function (number) {
          ngModel.$ccType = ccNumber.type = _creditcards.card.type(number);
        });
        function $viewValue() {
          return ngModel.$viewValue;
        }
        if (typeof $attributes.ccEagerType !== 'undefined') {
          $scope.$watch($viewValue, function eagerTypeCheck(number) {
            if (!number) return;
            number = _creditcards.card.parse(number);
            ngModel.$ccEagerType = ccNumber.eagerType = _creditcards.card.type(number, true);
          });
        }
        if ($attributes.ccType) {
          $scope.$watch($attributes.ccType, function () {
            ngModel.$validate();
          });
        }
        if (typeof $attributes.ccFormat !== 'undefined') {
          $scope.$watch($viewValue, function formatInput(input, previous) {
            if (!input) return;
            var element = $element[0];
            var formatted = _creditcards.card.format(_creditcards.card.parse(input));
            ngModel.$setViewValue(formatted);
            var selectionEnd = element.selectionEnd;

            ngModel.$render();
            if (formatted && !formatted.charAt(selectionEnd - 1).trim()) {
              selectionEnd++;
            }
            element.setSelectionRange(selectionEnd, selectionEnd);
          });
        }
        ngModel.$parsers.unshift(_creditcards.card.parse);
        ngModel.$validators.ccNumber = function (number) {
          return _creditcards.card.isValid(number);
        };
        ngModel.$validators.ccNumberType = function (number) {
          return _creditcards.card.isValid(number, $parse($attributes.ccType)($scope));
        };
      };
    }
  };
}
module.exports = exports['default'];

},{"creditcards":13}]},{},[1])(1)
});