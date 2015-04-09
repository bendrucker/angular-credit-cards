!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.angularCreditCards=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

module.exports = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null)
  .module('credit-cards', [])
  .value('creditcards', require('creditcards'))
  .directive('ccNumber', require('./number'))
  .directive('ccExp', require('./expiration'))
  .directive('ccExpMonth', require('./expiration').month)
  .directive('ccExpYear', require('./expiration').year)
  .directive('ccCvc', require('./cvc'))
  .name;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cvc":13,"./expiration":14,"./number":15,"creditcards":12}],2:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

exports.types = require('./types');

},{"./types":7}],6:[function(require,module,exports){
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

},{"xtend/mutable":4}],7:[function(require,module,exports){
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

},{"./type":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

var camel = require('camel-case');
var luhn = require('fast-luhn');

exports.types = require('creditcards-types').types;

exports.parse = function (number) {
  if (typeof number !== 'string') return '';
  return number.replace(/[^\d]/g, '');
};

exports.type = function (number, eager) {
  for (var typeName in exports.types) {
    var type = exports.types[typeName];
    if (type.test(number, eager)) return exports.types[typeName].name;
  }
};

exports.luhn = luhn;

exports.isValid = function (number, type) {
  if (!type) type = exports.type(number);
  type = exports.types[camel(type)];
  if (!type) return false;
  return (!type.luhn || luhn(number)) && type.test(number);
};

},{"camel-case":2,"creditcards-types":5,"fast-luhn":8}],10:[function(require,module,exports){
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

},{"./card":9,"camel-case":2}],11:[function(require,module,exports){
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

var base = new Date().getFullYear().toString().substr(0, 2);

function twoDigit (number) {
  return number >= 10 ? number : '0' + number;
}

exports.year = {
  parse: function (year, pad) {
    year = ~~year;
    if (!pad) return year || void 0;
    return ~~(base + twoDigit(year));
  },
  format: function (year, strip) {
    year = year.toString();
    return strip ? year.substr(2, 4) : year;
  },
  isValid: function (year) {
    if (typeof year !== 'number') return false;
    return year > 0;
  },
  isPast: function (year) {
    return new Date().getFullYear() > year;
  }
};

},{}],12:[function(require,module,exports){
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
  };
};

},{"./card":9,"./cvc":10,"./expiration":11}],13:[function(require,module,exports){
'use strict';

var cvc = require('creditcards').cvc;

module.exports = function ($parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function (element, attributes) {
      attributes.$set('maxlength', 4);
      attributes.$set('pattern', '[0-9]*');
      return function (scope, element, attributes, ngModelController) {
        ngModelController.$validators.ccCvc = function (value) {
          return cvc.isValid(value, $parse(attributes.ccType)(scope));
        };
        if (attributes.ccType) {
          scope.$watch(attributes.ccType, function () {
            ngModelController.$validate();
          });
        }
      };
    }
  };
};
module.exports.$inject = ['$parse'];

},{"creditcards":12}],14:[function(require,module,exports){
(function (global){
'use strict';

var expiration = require('creditcards').expiration;
var angular    = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

module.exports = function () {
  return {
    restrict: 'AE',
    require: 'ccExp',
    controller: CcExpController,
    link: function (scope, element, attributes, controller) {
      controller.$watch();
    }
  };
};

function CcExpController ($scope, $element) {
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
  function setValidity (exp) {
    var valid = !!exp.month && !!exp.year && !expiration.isPast(exp.month, exp.year);
    parentForm.$setValidity('ccExp', valid, $element);
  }
  this.$watch = function $watch () {
    $scope.$watch(function () {
      return {
        month: month.$modelValue,
        year: year.$modelValue
      };
    }, setValidity, true);
  };
}
CcExpController.$inject = ['$scope', '$element'];

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
          return expiration.month.parse(month);
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
      var fullYear = attributes.fullYear !== void 0;
      attributes.$set('maxlength', fullYear ? 4 : 2);
      attributes.$set('pattern', '[0-9]*');

      return function (scope, element, attributes, controllers) {
        var ngModelCtrl = controllers[0];
        var ccExpCtrl = controllers[1] || nullCcExpCtrl;
        ccExpCtrl.setYear(ngModelCtrl);
        ngModelCtrl.$parsers.unshift(function (year) {
          return expiration.year.parse(year, !fullYear);
        });
        ngModelCtrl.$formatters.unshift(function (year) {
          return year ? expiration.year.format(year, !fullYear) : '';
        });
        ngModelCtrl.$validators.ccExpYear = function (year) {
          return expiration.year.isValid(year) && !expiration.year.isPast(year);
        };
      };
    }
  };
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"creditcards":12}],15:[function(require,module,exports){
'use strict';

var card = require('creditcards').card;

module.exports = function ($parse) {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    controller: function () {
      this.type = null;
      this.eagerType = null;
    },
    compile: function (element, attributes) {
      attributes.$set('pattern', '[0-9]*');

      return function (scope, element, attributes, controllers) {
        var ngModelController = controllers[0];
        var ccNumberController = controllers[1];

        scope.$watch(attributes.ngModel, function (number) {
          ngModelController.$ccType = ccNumberController.type = card.type(number);
        });

        function $viewValue () {
          return ngModelController.$viewValue;
        }
        if (typeof attributes.ccEagerType !== 'undefined') {
          scope.$watch($viewValue, function eagerTypeCheck (number) {
            if (!number) return;
            number = card.parse(number);
            ngModelController.$ccEagerType = ccNumberController.eagerType = card.type(number, true);
          });
        }

        if (attributes.ccType) {
          scope.$watch(attributes.ccType, function (type) {
            ngModelController.$validate();
          });
        }

        ngModelController.$parsers.unshift(function (number) {
          return card.parse(number);
        });
        ngModelController.$validators.ccNumber = function (number) {
          return card.isValid(number);
        };
        ngModelController.$validators.ccNumberType = function (number) {
          return card.isValid(number, $parse(attributes.ccType)(scope));
        };
      };
    }
  };
};
module.exports.$inject = ['$parse'];

},{"creditcards":12}]},{},[1])(1)
});