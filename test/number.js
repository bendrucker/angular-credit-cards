'use strict';

require('../');

describe('cc-number', function () {

  beforeEach(angular.mock.module('credit-cards'));

  var creditCard, scope;
  beforeEach(angular.mock.inject(function ($injector) {
    var $compile = $injector.get('$compile');
    var element  = angular.element(
      '<form name="form">' +
        '<input ng-model="card.number" cc-number name="number" />' +
      '</form>'
    );
    creditCard   = $injector.get('creditCard');
    scope        = $injector.get('$rootScope').$new();
    scope.card   = {};
    $compile(element)(scope);
  }));

  it('is valid when a card validation is truthy', function () {
    sinon.stub(creditCard, 'validate').returns(false);
    scope.form.number.$setViewValue(' ');
    scope.$digest();
    expect(scope.card.number).to.be.undefined;
    expect(scope.form.number.$valid).to.be.false;
  });

  xit('is invalid when card validation is falsy', function () {

  });

});
