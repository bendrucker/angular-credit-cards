(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularCreditCards = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
var sentence = _dereq_('sentence-case');

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

},{"sentence-case":3}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
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

},{}],5:[function(_dereq_,module,exports){
'use strict';

exports.types = _dereq_('./types');

},{"./types":7}],6:[function(_dereq_,module,exports){
'use strict';

var extend = _dereq_('xtend/mutable');

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

},{"xtend/mutable":4}],7:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('./type');

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

},{"./type":6}],8:[function(_dereq_,module,exports){
'use strict'

module.exports = (function (array) {
  return function luhn (number) {
    if (!number) return false
    var length = number.length
    var bit = 1
    var sum = 0
    var value

    while (length) {
      value = parseInt(number.charAt(--length), 10)
      sum += (bit ^= 1) ? array[value] : value
    }

    return !!sum && sum % 10 === 0
  }
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]))

},{}],9:[function(_dereq_,module,exports){
'use strict'

var camel = _dereq_('camel-case')
var luhn = _dereq_('fast-luhn')

exports.types = _dereq_('creditcards-types').types

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

},{"camel-case":2,"creditcards-types":5,"fast-luhn":8}],10:[function(_dereq_,module,exports){
'use strict'

var camel = _dereq_('camel-case')
var card = _dereq_('./card')

var cvcRegex = /^\d{3,4}$/

exports.isValid = function (cvc, type) {
  if (typeof cvc !== 'string') return false
  if (!cvcRegex.test(cvc)) return false
  if (!type) return true
  return card.types[camel(type)].cvcLength === cvc.length
}

},{"./card":9,"camel-case":2}],11:[function(_dereq_,module,exports){
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

},{}],12:[function(_dereq_,module,exports){
'use strict'

var card = exports.card = _dereq_('./card')
var cvc = exports.cvc = _dereq_('./cvc')
var expiration = exports.expiration = _dereq_('./expiration')

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

},{"./card":9,"./cvc":10,"./expiration":11}],13:[function(_dereq_,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


},{}],14:[function(_dereq_,module,exports){
'use strict'

var cvc = _dereq_('creditcards').cvc
var bind = _dereq_('function-bind')

module.exports = factory

factory.$inject = ['$parse']
function factory ($parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function (element, attributes) {
      attributes.$set('maxlength', 4)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-csc')

      return function (scope, element, attributes, ngModel) {
        ngModel.$validators.ccCvc = function (value) {
          return cvc.isValid(value, $parse(attributes.ccType)(scope))
        }

        if (attributes.ccType) {
          scope.$watch(attributes.ccType, bind.call(ngModel.$validate, ngModel))
        }
      }
    }
  }
}

},{"creditcards":12,"function-bind":13}],15:[function(_dereq_,module,exports){
'use strict'

var expiration = _dereq_('creditcards').expiration
var month = expiration.month
var year = expiration.year
var ap = _dereq_('ap')

exports = module.exports = function ccExp () {
  return {
    restrict: 'AE',
    require: 'ccExp',
    controller: CcExpController,
    link: function (scope, element, attributes, ccExp) {
      ccExp.$watch()
    }
  }
}

CcExpController.$inject = ['$scope', '$element']
function CcExpController ($scope, $element) {
  var nullFormCtrl = {
    $setValidity: noop
  }
  var parentForm = $element.inheritedData('$formController') || nullFormCtrl
  var ngModel = {
    year: {},
    month: {}
  }

  this.setMonth = function (monthCtrl) {
    ngModel.month = monthCtrl
  }
  this.setYear = function (yearCtrl) {
    ngModel.year = yearCtrl
  }

  function setValidity (exp) {
    var expMonth = exp.month
    var expYear = exp.year
    var valid = !!expMonth && !!expYear && !expiration.isPast(expMonth, expYear)
    parentForm.$setValidity('ccExp', valid, $element)
  }

  this.$watch = function $watchExp () {
    $scope.$watch(function watchExp () {
      return {
        month: ngModel.month.$modelValue,
        year: ngModel.year.$modelValue
      }
    }, setValidity, true)
  }
}

var nullCcExp = {
  setMonth: noop,
  setYear: noop
}

exports.month = function ccExpMonth () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function (element, attributes) {
      attributes.$set('maxlength', 2)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-exp-month')

      return function (scope, element, attributes, controllers) {
        var ngModel = controllers[0]
        var ccExp = controllers[1] || nullCcExp

        ccExp.setMonth(ngModel)
        ngModel.$parsers.unshift(month.parse)
        ngModel.$validators.ccExpMonth = month.isValid
      }
    }
  }
}

exports.year = function ccExpYear () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function (element, attributes) {
      var fullYear = attributes.fullYear !== undefined

      attributes.$set('maxlength', fullYear ? 4 : 2)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-exp-year')

      return function (scope, element, attributes, controllers) {
        var ngModel = controllers[0]
        var ccExp = controllers[1] || nullCcExp

        ccExp.setYear(ngModel)

        ngModel.$parsers.unshift(ap.partialRight(year.parse, !fullYear))

        ngModel.$formatters.unshift(function formatExpYear (value) {
          return value ? year.format(value, !fullYear) : ''
        })

        ngModel.$validators.ccExpYear = function validateExpYear (value) {
          return year.isValid(value) && !year.isPast(value)
        }
      }
    }
  }
}

function noop () {}

},{"ap":1,"creditcards":12}],16:[function(_dereq_,module,exports){
'use strict'

var card = _dereq_('creditcards').card

module.exports = factory

factory.$inject = ['$parse']
function factory ($parse) {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    controller: function () {
      this.type = null
      this.eagerType = null
    },
    compile: function ($element, $attributes) {
      $attributes.$set('pattern', '[0-9]*')
      $attributes.$set('xAutocompletetype', 'cc-number')

      return function ($scope, $element, $attributes, controllers) {
        var ngModel = controllers[0]
        var ccNumber = controllers[1]

        $scope.$watch($attributes.ngModel, function (number) {
          ngModel.$ccType = ccNumber.type = card.type(number)
        })

        function $viewValue () {
          return ngModel.$viewValue
        }

        if ($attributes.ccEagerType != null) {
          $scope.$watch($viewValue, function eagerTypeCheck (number) {
            if (!number) return
            number = card.parse(number)
            ngModel.$ccEagerType = ccNumber.eagerType = card.type(number, true)
          })
        }

        if ($attributes.ccType) {
          $scope.$watch($attributes.ccType, function () {
            ngModel.$validate()
          })
        }

        if ($attributes.ccFormat != null) {
          $scope.$watch($viewValue, function formatInput (input, previous) {
            if (!input) return
            var element = $element[0]
            var formatted = card.format(card.parse(input))

            ngModel.$setViewValue(formatted)
            var selectionEnd = element.selectionEnd
            ngModel.$render()
            if (formatted && !formatted.charAt(selectionEnd - 1).trim()) {
              if (previous && previous.length < input.length) {
                selectionEnd++
              } else {
                selectionEnd--
              }
            }
            element.setSelectionRange(selectionEnd, selectionEnd)
          })
        }

        ngModel.$parsers.unshift(card.parse)

        ngModel.$validators.ccNumber = function validateCcNumber (number) {
          return card.isValid(number)
        }

        ngModel.$validators.ccNumberType = function validateCcNumberType (number) {
          return card.isValid(number, $parse($attributes.ccType)($scope))
        }
      }
    }
  }
}

},{"creditcards":12}],17:[function(_dereq_,module,exports){
(function (global){
'use strict'

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null)
var creditcards = _dereq_('creditcards')
var number = _dereq_('./number')
var cvc = _dereq_('./cvc')
var expiration = _dereq_('./expiration')

module.exports = angular
  .module('credit-cards', [])
  .value('creditcards', creditcards)
  .directive('ccNumber', number)
  .directive('ccExp', expiration)
  .directive('ccExpMonth', expiration.month)
  .directive('ccExpYear', expiration.year)
  .directive('ccCvc', cvc)
  .name

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cvc":14,"./expiration":15,"./number":16,"creditcards":12}]},{},[17])(17)
});