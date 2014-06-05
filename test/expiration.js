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

    var controller, element;
    beforeEach(function () {
      element    = angular.element('<input ng-model="expiration.month" cc-exp-month />');
      controller = $compile(element)(scope).controller('ngModel');
    });

    it('sets minlength and maxlength to 2', function () {
      expect(element.attr('maxlength')).to.equal('2');
      expect(element.attr('minlength')).to.equal('2');
    });

    describe('invalid', function () {

      it('is invalid when falsy', function () {
        controller.$setViewValue();
        scope.$digest();
        expect(controller.$error.ccExpMonth).to.be.true;
      });

      it('is invalid when NaN', function () {
        controller.$setViewValue('a');
        scope.$digest();
        expect(controller.$error.ccExpMonth).to.be.true;
      });

      it('is invalid when > 12', function () {
        controller.$setViewValue(13);
        scope.$digest();
        expect(controller.$error.ccExpMonth).to.be.true;
      });

      it('is invalid when < 1', function () {
        controller.$setViewValue(0);
        scope.$digest();
        expect(controller.$error.ccExpMonth).to.be.true;
      });

      it('unsets the model value when $invalid', function () {
        controller.$setViewValue('ab');
        scope.$digest();
        expect(scope.expiration.ccExpMonth).to.be.undefined;
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

    var controller, element;
    beforeEach(angular.mock.inject(function ($injector) {
      element    = angular.element('<input ng-model="expiration.year" cc-exp-year />');
      controller = $compile(element)(scope).controller('ngModel');
    }));

    it('sets minlength and maxlength to 2', function () {
      expect(element.attr('maxlength')).to.equal('2');
      expect(element.attr('minlength')).to.equal('2');
    });

    describe('invalid', function () {

      it('is invalid when falsy', function () {
        controller.$setViewValue();
        scope.$digest();
        expect(controller.$error.ccExpYear).to.be.true;
      });

      it('is invalid when NaN', function () {
        controller.$setViewValue('a');
        scope.$digest();
        expect(controller.$error.ccExpYear).to.be.true;
      });

      it('is invalid when in the past', function () {
        controller.$setViewValue(13);
        scope.$digest();
        expect(controller.$error.ccExpYear).to.be.true;
      });

      it('unsets the model value when $invalid', function () {
        controller.$setViewValue('ab');
        scope.$digest();
        expect(scope.expiration.ccExpYear).to.be.undefined;
      });

    });

    describe('valid', function () {

      var currentYear = new Date()
        .getFullYear()
        .toString()
        .substring(2, 4);

      it('is valid for this year', function () {
        controller.$setViewValue(currentYear);
        scope.$digest();
        expect(controller.$valid).to.be.true;
        expect(scope.expiration.year).to.equal(currentYear);
      });

      it('is valid for a far-future year', function () {
        controller.$setViewValue('99');
        scope.$digest();
        expect(controller.$valid).to.be.true;
      });

      describe('formatting', function () {

        it('converts to a string', function () {
          controller.$setViewValue(99);
          scope.$digest();
          expect(scope.expiration.year).to.equal('99');
        });

        it('can accept YY (default)', function () {
          element.isolateScope().yearFormat = 'YY';
          controller.$setViewValue(99);
          scope.$digest();
          expect(scope.expiration.year).to.equal('99');
        });

        it('can accept YYYY', function () {
          element.isolateScope().yearFormat = 'YYYY';
          controller.$setViewValue(99);
          scope.$digest();
          expect(scope.expiration.year).to.equal('2099');
        });

      });

    });

  });

});
