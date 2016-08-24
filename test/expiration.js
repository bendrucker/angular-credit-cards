'use strict'

/* global describe, beforeEach, afterEach, it */

var expect = require('chai').use(require('sinon-chai')).expect
var sinon = require('sinon')
var angular = require('angular')
var fs = require('fs')
var path = require('path')
require('angular-mocks/ngMock')

describe('Expiration', function () {
  beforeEach(angular.mock.module(require('../')))

  var $compile, element, $scope, expiration, sandbox
  beforeEach(angular.mock.inject(function ($injector) {
    $compile = $injector.get('$compile')
    element = angular.element(fs.readFileSync(path.resolve(__dirname, 'fixtures/cc-exp.html')).toString())
    $scope = $injector.get('$rootScope').$new()
    $scope.expiration = (expiration = {})
    sandbox = sinon.sandbox.create()

    // Set current date to 12/1/2014 00:00 UTC -5
    sandbox.useFakeTimers(1417410000000)
  }))

  afterEach(function () {
    sandbox.restore()
  })

  describe('cc-exp', function () {
    var form, formController
    beforeEach(function () {
      form = element
      formController = $compile(form)($scope).controller('form')
      element = form.children()
    })

    it('is valid for a valid future month', function () {
      expiration.month = 1
      expiration.year = 2015
      $scope.$digest()
      expect(formController.$error.ccExp).to.not.be.ok
    })

    it('is valid for the current month', function () {
      expiration.month = 12
      expiration.year = 2014
      $scope.$digest()
      expect(formController.$error.ccExp).to.not.be.ok
    })

    it('is invalid when month exists but not year', function () {
      expiration.month = 10
      $scope.$digest()
      expect(formController.$error.ccExp).to.contain(element)
    })

    it('is invalid when year exists but not month', function () {
      expiration.year = 2018
      $scope.$digest()
      expect(formController.$error.ccExp).to.contain(element)
    })

    it('is invalid for a past month this year', function () {
      expiration.month = 10
      expiration.year = 2014
      $scope.$digest()
      expect(formController.$error.ccExp).to.contain(element)
    })

    it('is valid with an empty expiration', function () {
      $scope.$digest()
      expect(formController.$error.ccExp).to.not.be.ok
      expect(formController.$error.ccExpMonth).to.not.be.ok
      expect(formController.$error.ccExpYear).to.not.be.ok
    })

    it('is a noop with no form', function () {
      $compile(element.clone())($scope).controller('ccExp')
      $scope.$digest()
    })

    it('is valid with valid initial data', function () {
      expiration.month = 1
      expiration.year = 2015
      formController = $compile(element)($scope).controller('form')
      expect(formController.$error.ccExp).to.not.be.ok
      expect(formController.$valid).equal(true)
    })
  })

  describe('cc-exp-month', function () {
    var controller
    beforeEach(function () {
      element = element.find('input').eq(0)
      controller = $compile(element)($scope).controller('ngModel')
    })

    it('sets maxlength to 2', function () {
      expect(element.attr('maxlength')).to.equal('2')
    })

    it('adds an autocomplete attribute', function () {
      expect(element.attr('x-autocompletetype')).to.equal('cc-exp-month')
    })

    it('validates maxlength with type="number" (#13)', function () {
      element = element.clone().attr('type', 'number')
      controller = $compile(element)($scope).controller('ngModel')
      controller.$setViewValue('100')
      $scope.$digest()
      expect(controller.$valid).to.be.false
      expect(controller.$error.maxlength).to.be.true
    })

    it('adds a numeric pattern', function () {
      expect(element.attr('pattern')).to.equal('[0-9]*')
    })

    it('is accepts a valid month string', function () {
      controller.$setViewValue('05')
      $scope.$digest()
      expect(controller.$valid).to.be.true
      expect(expiration.month).to.equal(5)
    })

    it('is accepts a valid month number', function () {
      controller.$setViewValue(5)
      $scope.$digest()
      expect(controller.$valid).to.be.true
      expect(expiration.month).to.equal(5)
    })

    it('is invalid when falsy', function () {
      controller.$setViewValue('')
      $scope.$digest()
      expect(controller.$valid).to.be.false
    })
  })

  describe('cc-exp-year', function () {
    var controller
    beforeEach(function () {
      element = element.find('input').eq(1)
      controller = $compile(element)($scope).controller('ngModel')
    })

    it('sets maxlength to 2', function () {
      expect(element.attr('maxlength')).to.equal('2')
    })

    it('adds a numeric pattern', function () {
      expect(element.attr('pattern')).to.equal('[0-9]*')
    })

    it('adds an autocomplete attribute', function () {
      expect(element.attr('x-autocompletetype')).to.equal('cc-exp-year')
    })

    it('is invalid when in the past', function () {
      controller.$setViewValue(13)
      $scope.$digest()
      expect(controller.$error.ccExpYear).to.be.true
    })

    it('is valid for this year', function () {
      controller.$setViewValue('14')
      $scope.$digest()
      expect(controller.$valid).to.be.true
      expect(expiration.year).to.equal(2014)
    })

    it('is valid for a far-future year', function () {
      controller.$setViewValue('99')
      $scope.$digest()
      expect(controller.$valid).to.be.true
    })

    it('is not valid for a past year', function () {
      controller.$setViewValue('13')
      $scope.$digest()
      expect(controller.$valid).to.be.false
    })

    it('formats the year from the model value', function () {
      expiration.year = 2014
      $scope.$digest()
      expect(controller.$viewValue).to.equal('14')
    })

    describe('full-year', function () {
      beforeEach(function () {
        element = element.clone().attr('full-year', '')
        controller = $compile(element)($scope).controller('ngModel')
      })

      it('sets maxlength to 4', function () {
        expect(element.attr('maxlength')).to.equal('4')
      })

      it('does not pad the date when parsing', function () {
        controller.$setViewValue('2014')
        $scope.$digest()
        expect(controller.$valid).to.be.true
        expect(expiration.year).to.equal(2014)
      })

      it('does not strip the date when formatting', function () {
        expiration.year = 2014
        $scope.$digest()
        expect(controller.$viewValue).to.equal('2014')
      })
    })
  })
})
