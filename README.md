angular-credit-cards [![Build Status](https://travis-ci.org/bendrucker/angular-credit-cards.svg?branch=master)](https://travis-ci.org/bendrucker/angular-credit-cards) [![NPM version](https://badge.fury.io/js/angular-credit-cards.svg)](http://badge.fury.io/js/angular-credit-cards)
====================

A set of Angular directives for constructing credit card payment forms. Uses [creditcards](https://www.npmjs.org/package/creditcards) to parse and validate inputs. Pairs well with [angular-stripe](https://www.npmjs.org/package/angular-stripe) or any other payments backend.

## Getting Started

Include `'angular-credit-cards'` in your module's dependencies:

```js
angular.module('myApp', [
  'angular-credit-cards'
]);
```

If you'd like to use the [creditcards](https://www.npmjs.org/package/creditcards) API directly, you can inject the service as `creditcards`
