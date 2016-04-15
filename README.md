angular-credit-cards [![Build Status](https://travis-ci.org/bendrucker/angular-credit-cards.svg?branch=master)](https://travis-ci.org/bendrucker/angular-credit-cards)
====================

A set of Angular directives for constructing credit card payment forms. Uses [creditcards](https://www.npmjs.org/package/creditcards) to parse and validate inputs. Pairs well with [angular-stripe](https://www.npmjs.org/package/angular-stripe) or any other payments backend. [Try it!](http://embed.plnkr.co/uE47aZ/preview)

## Installation
```bash
# use npm
$ npm install angular-credit-cards
# or bower
$ bower install angular-credit-cards
```

## Setup

Include `'angular-credit-cards'` in your module's dependencies:

```js
// node module exports the string 'angular-credit-cards' for convenience
angular.module('myApp', [
  require('angular-credit-cards')
]);
// otherwise, include the code first then the module name
angular.module('myApp', [
  'credit-cards'
]);
```

If you'd like to use the [creditcards](https://www.npmjs.org/package/creditcards) API directly, you can inject the service as `creditcards`.

## API

With the exception of `ccExp`, all directives require `ngModel` on their elements. While designed to be used together, all directives except `ccExp` can be used completely independently.

All directives apply a [numeric input pattern](http://bradfrostweb.com/blog/mobile/better-numerical-inputs-for-mobile-forms/) so that mobile browsers use a modified version of the enlarged telephone keypad. You should use `type="text"` for all `input` elements.

<hr>

### Card Number (`cc-number`)

```html
<input type="text" ng-model="card.number" cc-number cc-type="cardType" ng-required="true" />
```

* Can format your inputs into space-delimited groups (e.g. `4242 4242 4242 4242`) by adding the `cc-format` option
* Strips all punctuation and spaces in the model
* Validates the card against the [Luhn algorithm](http://en.wikipedia.org/wiki/Luhn_algorithm)
* Checks whether the card is the type(s) specified in scope property in `cc-type` (optional)
* Otherwise, checks whether the card matches any valid card type
* Exposes the [card type](https://github.com/bendrucker/creditcards-types#card-types) as `$ccType` on the model controller

If you're using `cc-format`, you'll want to apply the [`novalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-novalidate) attribute to your `<form>` to disable native browser validation. The input pattern used to trigger the dialer keypad on mobile does not allow spaces, causing browsers that implement pattern validation to display an error tooltip.

The `cc-type` property is optional and may be a single card type or an array of types. If its value is defined on the scope, the card number will be checked against the type(s) in addition to the Luhh algorithm. A special validity key—`ccNumberType`—indicates whether the card matched the specified type. If no type is provided, `ccNumberType` will always be valid for any card that passes Luhn and matches any card type.

You can also enable eager card type detection to match against card type with only leading digits (e.g. a `4` can immediately be detected as a Visa). Add the `cc-eager-type` attribute to your element to enable eager type detection. The eagerly matched type will be available as `$ccEagerType` on the model controller.

Displaying the card type from a user input:

```html
<form name="paymentForm">
  <input type="text" ng-model="card.number" name="cardNumber" cc-number cc-eager-type />
</form>
<p ng-show="paymentForm.cardNumber.$invalid && paymentForm.cardNumber.$ccEagerType">
  Looks like you're typing a {{paymentForm.cardNumber.$ccEagerType}} number!
</p>
<p ng-show="paymentForm.cardNumber.$valid">
  Yes, that looks like a valid {{paymentForm.cardNumber.$ccType}} number!
</p>
<p ng-show="paymentForm.cardNumber.$error.required">
  You must enter a credit card number!
</p>
```

Enforcing a specific card type chosen with a `<select>`:

```html
<form name="paymentForm">
  <select ng-model="cardType" ng-options="type for type in ['Visa', 'American Express', 'MasterCard']"></select>
  <input type="text" ng-model="card.number" name="cardNumber" cc-number cc-type="cardType" />
  <p ng-show="paymentForm.cardNumber.$error.ccNumberType">That's not a valid {{cardType}}</p>
</form>
```

<hr>

### CVC (`cc-cvc`)

```html
<input type="text" ng-model="card.cvc" cc-cvc ng-required="true" />
<input type="text" ng-model="card.cvc" cc-type="cardNumber.$ccType" ng-required="true" />
```

* Sets `maxlength="4"`
* Validates the CVC

You can optionally specify a scope property that stores the card type as `cc-type`. For American Express cards, a 4 digit CVC is expected. For all other card types, 3 digits are expected.

<hr>

### Expiration (`cc-exp`, `cc-exp-month`, `cc-exp-year`)

```html
<div cc-exp>
  <input ng-model="card.exp_month" cc-exp-month ng-required="true" />
  <input ng-model="card.exp_year" cc-exp-year ng-required="true" />
</div>
```

#### `cc-exp-month`

* Sets `maxlength="2"`
* Validates the month
* Converts it to a number

#### `cc-exp-year`

* Sets `maxlength="2"` (or `4` with the `full-year` attribute)
* Converts the year to a 4 digit number (`'14'` -> `2014`), unless `full-year` is added
* Validates the year
* Validates that the expiration year has not passed

#### `cc-exp`

Validates that the month/year pair has not passed

`cc-exp-month` and `cc-exp-year` should both be placed on `input` elements with `type="text"` or no `type` attribute. The browser's normal maxlength behavior (preventing input after the specified number of characters and truncating pasted text to that length) does not work with `type="number"`. Both directives will handle parsing the date components into numbers internally.

`cc-exp` must be placed on a parent element of `cc-exp-month` and `cc-exp-year`. Because `ccExp` is not an input and adds a validation property directly to the form, you cannot access its validity as `myForm.ccExp.$valid`. Instead use `myForm.$error.ccExp` to determine whether to show a validation error.

<hr>

## Integration

If you're not fully familiar with form validation in Angular, these may be helpful:
* [Angular Documentation: Forms](https://docs.angularjs.org/guide/forms)
* [Angular Form Validation (Scotch.io)](http://scotch.io/tutorials/javascript/angularjs-form-validation)
* [Form validation with AngularJS (ng-newsletter)](http://www.ng-newsletter.com/posts/validations.html)

angular-credit-cards sets validity keys that match the directive names (`ccNumber`, `ccCvc`, `ccExp`, `ccExpMonth`, `ccExpYear`). You can use these keys or the form css classes in order to display error messages.

You can also try a [live demo](http://embed.plnkr.co/uE47aZ/preview) and experiment with various inputs and see how they're validated.

## License

[MIT](LICENSE)
