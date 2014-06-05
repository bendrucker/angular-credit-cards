'use strict';

require('../');

describe('cc-number', function () {

  beforeEach(angular.mock.module('credit-cards'));

  var creditCard, scope, controller;
  beforeEach(angular.mock.inject(function ($injector) {
    var $compile = $injector.get('$compile');
    var element  = angular.element('<input ng-model="card.number" cc-number />');
    creditCard   = $injector.get('creditCard');
    scope        = $injector.get('$rootScope').$new();
    scope.card   = {};
    $compile(element)(scope);
    controller   = element.controller('ngModel');
  }));

  it('is valid when a card validation is truthy', function () {
    sinon.stub(creditCard, 'validate').returns(false);
    controller.$setViewValue(' ');
    scope.$digest();
    expect(scope.card.number).to.be.undefined;
    expect(controller.$valid).to.be.false;
  });

  xit('is invalid when card validation is falsy', function () {

  });

});
