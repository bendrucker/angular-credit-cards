'use strict';

require('../');

describe('Expiration', function () {

  describe('cc-expiration', function () {

    beforeEach(angular.mock.module('credit-cards'));

    var scope, controller;
    beforeEach(angular.mock.inject(function ($injector) {
      var $compile     = $injector.get('$compile');
      var element      = angular.element('<input ng-model="expiration.month" cc-exp-month />');
      scope            = $injector.get('$rootScope').$new();
      scope.expiration = {};
      $compile(element)(scope);
      controller       = element.controller('ngModel');
    }));

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
        expect(scope.expiration.month).to.be.undefined;
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

});
