'use strict'

/*global describe, beforeEach, it*/

var expect = require('chai').expect
var angular = require('angular')
require('angular-mocks/ngMock')

describe('cc-number', function () {
  beforeEach(angular.mock.module(require('../')))

  var $compile, element, scope, controller
  beforeEach(angular.mock.inject(function ($injector, $parse) {
    $compile = $injector.get('$compile')
    element = angular.element('<input ng-model="card.number" cc-number cc-format />')
    scope = $injector.get('$rootScope').$new()
    scope.card = {}
    controller = $compile(element)(scope).controller('ngModel')
  }))

  it('adds a numeric pattern', function () {
    expect(element.attr('pattern')).to.equal('[0-9]*')
  })

  it('adds an autocomplete attribute', function () {
    expect(element.attr('x-autocompletetype')).to.equal('cc-number')
  })

  it('is initially pristine', function () {
    scope.$digest()
    expect(controller.$pristine).to.equal(true)
  })

  it('accepts a valid card', function () {
    controller.$setViewValue('4242 4242 4242 4242')
    expect(controller.$valid).to.be.true
    expect(scope.card.number).to.equal('4242424242424242')
  })

  it('accepts a valid card with specified type', function () {
    scope.cardType = 'Visa'
    controller.$setViewValue('4242 4242 4242 4242')
    scope.$digest()
    expect(controller.$error.ccNumberType).to.not.be.ok
  })

  it('accepts a valid card with multiple types', function () {
    scope.cardType = ['Visa', 'American Express']
    controller.$setViewValue('4242 4242 4242 4242')
    scope.$digest()
    expect(controller.$error.ccNumberType).to.not.be.ok
    controller.$setViewValue('378282246310005')
    scope.$digest()
    expect(controller.$error.ccNumberType).to.not.be.ok
  })

  it('rejects a luhn-invalid card', function () {
    controller.$setViewValue('4242424242424241')
    expect(controller.$error.ccNumber).to.be.true
    expect(scope.card.number).to.be.undefined
  })

  it('rejects a luhn-valid card with no matching type', function () {
    controller.$setViewValue('42')
    expect(controller.$error.ccNumber).to.be.true
    expect(scope.card.number).to.be.undefined
  })

  describe('ccFormat (card formatting)', function () {
    it('formats the card number during entry', function () {
      element.val('42424')
      element.triggerHandler('input')
      scope.$digest()
      expect(controller.$viewValue).to.equal('4242 4')
      expect(element.val()).to.equal('4242 4')
    })

    it('increments the cursor after a space', function () {
      element.val('42424')
      element.triggerHandler('input')
      scope.$digest()
      expect(controller.$viewValue).to.equal('4242 4')
      expect(element[0].selectionEnd).to.equal(6)
    })

    it('increments the cursor after a space and many characters with debounce', angular.mock.inject(function ($injector) {
      $compile = $injector.get('$compile')
      element = angular.element('<input ng-model="card.number" ng-model-options="{ debounce: 50 }" cc-number cc-format />')
      scope = $injector.get('$rootScope').$new()
      scope.card = {}
      controller = $compile(element)(scope).controller('ngModel')
      element.val('424242')
      element.triggerHandler('input')
      controller.$commitViewValue()
      scope.$digest()
      expect(controller.$viewValue).to.equal('4242 42')
      expect(element[0].selectionEnd).to.equal(7)
    }))

    it('decrements the cursor when deleted a character after the space', function () {
      element.val('4242 4')
      element.triggerHandler('input')
      scope.$digest()

      element.val('4242 ')
      element.triggerHandler('input')
      scope.$digest()
      expect(controller.$viewValue).to.equal('4242')
      expect(element[0].selectionEnd).to.equal(4)
    })
  })

  describe('ccType (expected type)', function () {
    beforeEach(function () {
      element.attr('cc-type', 'cardType')
      controller = $compile(element)(scope).controller('ngModel')
    })

    it('accepts a valid card with specified type', function () {
      scope.cardType = 'Visa'
      controller.$setViewValue('4242 4242 4242 4242')
      scope.$digest()
      expect(controller.$error.ccNumberType).to.not.be.ok
    })

    it('rejects a valid card when the type is a mismatch', function () {
      scope.cardType = 'American Express'
      controller.$setViewValue('4242 4242 4242 4242')
      scope.$digest()
      expect(controller.$error.ccNumber).to.not.be.ok
      expect(controller.$error.ccNumberType).to.be.true
    })

  })

  describe('$ccType (actual type)', function () {
    var ccNumberController
    beforeEach(function () {
      ccNumberController = element.controller('ccNumber')
      scope.$digest()
    })

    it('exposes a calculated card type', function () {
      controller.$setViewValue('4242424242424242')
      scope.$digest()
      expect(ccNumberController.type).to.equal('Visa')
    })

    it('syncs the type with the ngModelController', function () {
      controller.$setViewValue('4242424242424242')
      scope.$digest()
      expect(controller.$ccType).to.equal('Visa')
    })

  })

  describe('$ccEagerType', function () {
    var ccNumberController
    beforeEach(function () {
      element.attr('cc-eager-type', '')
      ccNumberController = $compile(element)(scope).controller('ccNumber')
      controller = element.controller('ngModel')
      scope.$digest()
    })

    it('eagerly checks the type', function () {
      controller.$setViewValue('42')
      scope.$digest()
      expect(ccNumberController.eagerType).to.equal('Visa')
    })

    it('syncs the eager type with the ngModelController', function () {
      controller.$setViewValue('42')
      expect(controller.$ccEagerType).to.equal('Visa')
    })

  })

})
