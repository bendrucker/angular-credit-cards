'use strict'

/* global describe, beforeEach, it */

var expect = require('chai').expect
var angular = require('angular')
require('angular-mocks/ngMock')

describe('cc-cvc', function () {
  beforeEach(angular.mock.module(require('../')))

  var $compile, scope, controller, element
  beforeEach(angular.mock.inject(function ($injector) {
    $compile = $injector.get('$compile')
    scope = $injector.get('$rootScope').$new()
    scope.card = {}
    element = angular.element('<input ng-model="card.cvc" cc-cvc />')
    controller = $compile(element)(scope).controller('ngModel')
  }))

  it('sets maxlength to 4', function () {
    expect(element.attr('maxlength')).to.equal('4')
  })

  it('adds a numeric pattern', function () {
    expect(element.attr('pattern')).to.equal('[0-9]*')
  })

  it('adds an autocomplete attribute', function () {
    expect(element.attr('x-autocompletetype')).to.equal('cc-csc')
  })

  it('accepts a 3 digit numeric', function () {
    controller.$setViewValue('123')
    scope.$digest()
    expect(controller.$valid).to.be.true
    expect(scope.card.cvc).to.equal('123')
  })

  it('accepts a 4 digit numeric', function () {
    controller.$setViewValue('1234')
    scope.$digest()
    expect(controller.$valid).to.be.true
    expect(scope.card.cvc).to.equal('1234')
  })

  it('does not accept numbers', function () {
    controller.$setViewValue(123)
    scope.$digest()
    expect(controller.$valid).to.be.false
  })

  it('accepts an empty cvc', function () {
    controller.$setViewValue('')
    scope.$digest()
    expect(controller.$valid).to.be.true
  })

  it('unsets the model value when invalid', function () {
    controller.$setViewValue('abc')
    scope.$digest()
    expect(scope.card.cvc).to.be.undefined
  })

  describe('ccType', function () {
    beforeEach(function () {
      element.attr('cc-type', 'cardType')
      controller = $compile(element)(scope).controller('ngModel')
    })

    it('validates against the card type', function () {
      scope.cardType = 'visa'
      scope.card.cvc = '1234'
      scope.$digest()
      expect(controller.$valid).to.be.false
      scope.cardType = 'americanExpress'
      scope.$digest()
      expect(controller.$valid).to.be.true
    })
  })
})
