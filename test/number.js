'use strict';

var angular = require('angular');

describe('cc-number', function () {

  beforeEach(angular.mock.module(require('../')));

  var element, scope, controller;
  beforeEach(angular.mock.inject(function ($injector) {
    var $compile = $injector.get('$compile');
    element      = angular.element('<input ng-model="card.number" cc-number cc-type="cardType" />');
    scope        = $injector.get('$rootScope').$new();
    scope.card   = {};
    $compile(element)(scope);
    controller   = element.controller('ngModel');
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
    expect(controller.$valid).to.be.false;
    expect(scope.card.number).to.be.undefined;
  });

  it('rejects a luhn-valid card with no matching type', function () {
    controller.$setViewValue('42');
    expect(controller.$valid).to.be.false;
    expect(scope.card.number).to.be.undefined;
  });

  it('rejects an invalid card', function () {
    controller.$setViewValue('4242424242424241');
    expect(controller.$valid).to.be.false;
    expect(scope.card.number).to.be.undefined;
  });

  it('rejects an invalid card when the type is a mismatch', function () {
    scope.cardType = 'American Express';
    controller.$setViewValue('4242 4242 4242 4242');
    scope.$digest();
    expect(controller.$error.ccNumberType).to.be.true;
  });

  describe('$type', function () {

    var ccNumberController;
    beforeEach(function () {
      ccNumberController = element.controller('ccNumber');
      scope.$digest();
    });

    it('exposes a calculated card type', function () {
      controller.$setViewValue('4242424242424242');
      scope.$digest();
      expect(ccNumberController.$type).to.equal('Visa');
    });

    it('exposes a specified card type', function () {
      scope.cardType = 'Visa';
      scope.$digest();
      expect(ccNumberController.$type).to.equal('Visa');
    });

    it('will not overwrite a defined type', function () {
      scope.cardType = 'Visa';
      scope.$digest();
      controller.$setViewValue('4242424242424242');
      scope.$digest();
      expect(ccNumberController.$type).to.equal('Visa');
    });

    it('can handle an undefined type', function () {
      ccNumberController.setType();
      expect(ccNumberController.$type).to.be.undefined;
    });

    it('syncs the type with the ngModelController', function () {
      ccNumberController.$type = 'Visa';
      scope.$digest();
      expect(controller.$type).to.equal('Visa');
    });

  });

});
