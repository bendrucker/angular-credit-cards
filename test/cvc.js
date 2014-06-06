'use strict';

require('../');

describe('cc-cvc', function () {

  beforeEach(angular.mock.module('credit-cards'));

  var $compile, scope, controller, element;
  beforeEach(angular.mock.inject(function ($injector) {
    $compile   = $injector.get('$compile');
    scope      = $injector.get('$rootScope').$new();
    scope.card = {};
    element    = angular.element('<input ng-model="card.cvc" cc-cvc />');
    controller = $compile(element)(scope).controller('ngModel');
  }));

  it('sets maxlength to 4', function () {
    expect(element.attr('maxlength')).to.equal('4');
  });

  describe('invalid', function () {

    it('is invalid when falsy', function () {
      controller.$setViewValue();
      scope.$digest();
      expect(controller.$error.ccCvc).to.be.true;      
    });

    it('is invalid when less than 3 characters', function () {
      controller.$setViewValue(12);
      scope.$digest();
      expect(controller.$error.ccCvc).to.be.true;
    });

    it('is invalid when more than 4 characters', function () {
      controller.$setViewValue(12345);
      scope.$digest();
      expect(controller.$error.ccCvc).to.be.true;
    });

    it('is invalid when NaN', function () {
      controller.$setViewValue('abc');
      scope.$digest();
      expect(controller.$error.ccCvc).to.be.true;
    });

    it('unsets the model value', function () {
      controller.$setViewValue();
      scope.$digest();
      expect(scope.card.cvc).to.be.undefined;
    });

  });

  describe('valid', function () {

    it('accepts a 3 digit number', function () {
      controller.$setViewValue(123);
      scope.$digest();
      expect(controller.$valid).to.be.true;
      expect(scope.card.cvc).to.equal('123');
    });

    it('accepts a 4 digit number', function () {
      controller.$setViewValue(1234);
      scope.$digest();
      expect(controller.$valid).to.be.true;
      expect(scope.card.cvc).to.equal('1234');
    });

  });

});
