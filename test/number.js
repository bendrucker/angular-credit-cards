'use strict';

describe('cc-number', function () {

  beforeEach(angular.mock.module(require('../')));

  var creditCard, scope, controller, sandbox;
  beforeEach(angular.mock.inject(function ($injector) {
    var $compile = $injector.get('$compile');
    var element  = angular.element('<input ng-model="card.number" cc-number />');
    sandbox      = sinon.sandbox.create();
    creditCard   = $injector.get('creditCard');
    scope        = $injector.get('$rootScope').$new();
    scope.card   = {};
    $compile(element)(scope);
    controller   = element.controller('ngModel');
  }));

  afterEach(function () {
    sandbox.restore();
  });

  describe('invalid', function () {

    beforeEach(function () {
      sandbox.stub(creditCard, 'validate').returns(false);
      controller.$setViewValue('card');
      scope.$digest();
    });

    it('unsets the model value', function () {
      expect(scope.card.number).to.be.undefined;
    });

    it('sets the element as $invalid', function () {
      expect(controller.$invalid).to.be.true;
      expect(controller.$error.ccNumber).to.be.true;
    });

  });

  describe('valid', function () {

    beforeEach(function () {
      sandbox.stub(creditCard, 'validate').returns(true);
      sandbox.stub(creditCard, 'format').returns('formattedCard');
      controller.$setViewValue('card');
      scope.$digest();
    });

    it('sets the model as the formatted card', function () {
      expect(scope.card.number).to.equal('formattedCard');
    });

    it('sets the element as $valid', function () {
      expect(controller.$valid).to.be.true;
    });

  });

});
