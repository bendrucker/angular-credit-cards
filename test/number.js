'use strict';

var angular = require('angular');

describe('cc-number', function () {

  beforeEach(angular.mock.module(require('../')));

  var $compile, element, scope, controller;
  beforeEach(angular.mock.inject(function ($injector) {
    $compile   = $injector.get('$compile');
    element    = angular.element('<input ng-model="card.number" cc-number cc-type="cardType" />');
    scope      = $injector.get('$rootScope').$new();
    scope.card = {};
    controller = $compile(element)(scope).controller('ngModel');
  }));

  it('adds a numeric pattern', function () {
    expect(element.attr('pattern')).to.equal('[0-9]*');
  });

  it('accepts a valid card', function () {
    controller.$setViewValue('4242 4242 4242 4242');
    expect(controller.$valid).to.be.true;
    expect(scope.card.number).to.equal('4242424242424242');
  });

  it('accepts a valid card with specified type', function () {
    scope.cardType = 'Visa';
    controller.$setViewValue('4242 4242 4242 4242');
    scope.$digest();
    expect(controller.$error.ccNumberType).to.not.be.ok;
  });

  it('rejects a luhn-invalid card', function () {
    controller.$setViewValue('4242424242424241');
    expect(controller.$error.ccNumber).to.be.true;
    expect(scope.card.number).to.be.undefined;
  });

  it('rejects a luhn-valid card with no matching type', function () {
    controller.$setViewValue('42');
    expect(controller.$error.ccNumber).to.be.true;
    expect(scope.card.number).to.be.undefined;
  });

  it('rejects an invalid card', function () {
    controller.$setViewValue('4242424242424241');
    expect(controller.$error.ccNumber).to.be.true;
    expect(scope.card.number).to.be.undefined;
  });

  it('rejects an invalid card when the type is a mismatch', function () {
    scope.cardType = 'American Express';
    controller.$setViewValue('4242 4242 4242 4242');
    scope.$digest();
    expect(controller.$error.ccNumber).to.not.be.ok;
    expect(controller.$error.ccNumberType).to.be.true;
  });

  describe('$ccType', function () {

    var ccNumberController;
    beforeEach(function () {
      ccNumberController = element.controller('ccNumber');
      scope.$digest();
    });

    it('exposes a calculated card type', function () {
      controller.$setViewValue('4242424242424242');
      scope.$digest();
      expect(ccNumberController.type).to.equal('Visa');
    });

    it('syncs the type with the ngModelController', function () {
      controller.$setViewValue('4242424242424242');
      scope.$digest();
      expect(controller.$ccType).to.equal('Visa');
    });

  });

  describe('$ccEagerType', function () {

    var ccNumberController;
    beforeEach(function () {
      element.attr('cc-eager-type', '');
      ccNumberController = $compile(element)(scope).controller('ccNumber');
      controller = element.controller('ngModel');
      scope.$digest();
    });

    it('eagerly checks the type', function () {
      controller.$setViewValue('42');
      scope.$digest();
      expect(ccNumberController.eagerType).to.equal('Visa');
    });

    it('syncs the eager type with the ngModelController', function () {
      controller.$setViewValue('42');
      expect(controller.$ccEagerType).to.equal('Visa');
    });

  });

});
