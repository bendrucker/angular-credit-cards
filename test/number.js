'use strict';

var angular = require('angular');

describe('cc-number', function () {

  beforeEach(angular.mock.module(require('../')));

  var element, scope, controller;
  beforeEach(angular.mock.inject(function ($injector) {
    var $compile = $injector.get('$compile');
    element      = angular.element('<input ng-model="card.number" cc-number />');
    scope        = $injector.get('$rootScope').$new();
    scope.card   = {};
    $compile(element)(scope);
    controller   = element.controller('ngModel');
  }));

  it('accepts a valid card', function () {
    controller.$setViewValue('4242 4242 4242 4242');
    expect(controller.$valid).to.be.true;
    expect(scope.card.number).to.equal('4242424242424242');
  });

  it('rejects an invalid card', function () {
    controller.$setViewValue('4242424242424241');
    expect(controller.$valid).to.be.false;
    expect(scope.card.number).to.be.undefined;
  });

  describe('$type', function () {

    var ccNumberController;
    beforeEach(function () {
      ccNumberController = element.controller('ccNumber');
    });

    it('exposes the card type', function () {
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
