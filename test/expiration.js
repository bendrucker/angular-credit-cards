'use strict';

require('../');

describe('Expiration', function () {

  beforeEach(angular.mock.module('credit-cards'));

  var $compile, scope;
  beforeEach(angular.mock.inject(function ($injector) {
    $compile         = $injector.get('$compile');
    scope            = $injector.get('$rootScope').$new();
    scope.expiration = {};
  }));

  describe('cc-exp-month', function () {

    var controller;
    beforeEach(function () {
      var element = angular.element('<input ng-model="expiration.month" cc-exp-month />');
      controller  = $compile(element)(scope).controller('ngModel');
    });

    describe('invalid', function () {

      it('is invalid when falsy', function () {
        controller.$setViewValue('');
        scope.$digest();
        expect(controller.$invalid).to.be.true;
      });

      it('is invalid when NaN', function () {
        controller.$setViewValue('a');
        scope.$digest();
        expect(controller.$invalid).to.be.true;
      });

      it('is invalid when > 12', function () {
        controller.$setViewValue(13);
        scope.$digest();
        expect(controller.$invalid).to.be.true;
      });

      it('is invalid when < 1', function () {
        controller.$setViewValue(0);
        scope.$digest();
        expect(controller.$invalid).to.be.true;
      });

      it('unsets the model value when $invalid', function () {
        controller.$setViewValue('');
        scope.$digest();
        expect(scope.expiration.month).to.be.undefined;
      });

      it('sets an error key', function () {
        controller.$setViewValue('');
        scope.$digest();
        expect(controller.$error.ccExpMonth).to.be.true;
      });

    });

    describe('valid', function () {

      it('is valid for any valid month', function () {
        controller.$setViewValue('05');
        scope.$digest();
        expect(controller.$valid).to.be.true;
        expect(scope.expiration.month).to.equal('05');
      });

      it('is converts months to strings', function () {
        controller.$setViewValue(12);
        scope.$digest();
        expect(scope.expiration.month).to.equal('12');
      });

      it('pads months with a leading 0', function () {
        controller.$setViewValue(5);
        scope.$digest();
        expect(scope.expiration.month).to.equal('05');
      });

    });

  });

  describe('cc-exp-year', function () {

    var controller;
    beforeEach(angular.mock.inject(function ($injector) {
      var element = angular.element('<input ng-model="expiration.year" cc-exp-year />');
      controller  = $compile(element)(scope).controller('ngModel');
    }));

    describe('valid', function () {

    });

  });

});
