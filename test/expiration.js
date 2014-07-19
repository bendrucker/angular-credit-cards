'use strict';

var angular = require('angular');

describe('Expiration', function () {

  beforeEach(angular.mock.module(require('../')));

  var $compile, scope, sandbox;
  beforeEach(angular.mock.inject(function ($injector) {
    $compile         = $injector.get('$compile');
    scope            = $injector.get('$rootScope').$new();
    scope.expiration = {};
    sandbox          = sinon.sandbox.create();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  describe('cc-exp', function () {

    var form, formController, element, controller, today;
    beforeEach(function () {
      form           = angular.element('<form><div cc-exp><input ng-model="expiration.month" cc-exp-month /><input ng-model="expiration.month" cc-exp-month /></div></form>');
      formController = $compile(form)(scope).controller('form');
      element        = form.children();
      controller     = element.controller('ccExp');
      today          = new Date();
    });

    it('is valid for a valid future month/year', function () {
      controller.set('month', 12);
      controller.set('year', 2099);
      expect(formController.$error.ccExp).to.be.false;
    });

    it('is valid for the current month', function () {
      controller.set('month', (today.getMonth() + 1));
      controller.set('year', today.getFullYear());
      expect(formController.$error.ccExp).to.be.false;
    });

    it('is invalid when either the month or year are invalid', function () {
      controller.set('month');
      controller.set('year', 2999)
      expect(formController.$error.ccExp).to.contain(element);
    });

    it('is invalid for a past month this year', function () {
      // 0 would never make it to month, but it's easier to test
      controller.set('month', 0);
      controller.set('year', today.getFullYear());
      expect(formController.$error.ccExp).to.contain(element);
    });

    it('is a noop with no form', function () {
      element = angular.element('<div cc-exp><input ng-model="expiration.month" cc-exp-month /><input ng-model="expiration.month" cc-exp-month /></div>');
      var controller = $compile(element)(scope).controller('ccExp');
      controller.set('month', 12);
    });

  });

  describe('cc-exp-month', function () {

    var controller, element;
    beforeEach(function () {
      element    = angular.element('<input ng-model="expiration.month" cc-exp-month />');
      controller = $compile(element)(scope).controller('ngModel');
    });

    it('sets maxlength to 2', function () {
      expect(element.attr('maxlength')).to.equal('2');
    });

    it('adds a numeric pattern', function () {
      expect(element.attr('pattern')).to.equal('[0-9]*');
    });

    it('passes changes to cc-exp', function () {
      element    = angular.element('<div cc-exp><input ng-model="expiration.month" cc-exp-month /></div>');
      controller = $compile(element)(scope).children().controller('ngModel');

      var ccExpController = element.controller('ccExp');

      sinon.stub(ccExpController, 'set');
      controller.$setViewValue('12');
      expect(ccExpController.set).to.have.been.calledWith('month', 12);
    });

    it('is accepts a valid month string', function () {
      controller.$setViewValue('05');
      scope.$digest();
      expect(controller.$valid).to.be.true;
      expect(scope.expiration.month).to.equal(5);
    });

    it('is accepts a valid month number', function () {
      controller.$setViewValue(5);
      scope.$digest();
      expect(controller.$valid).to.be.true;
      expect(scope.expiration.month).to.equal(5);
    });

    it('is invalid when falsy', function () {
      controller.$setViewValue();
      scope.$digest();
      expect(controller.$error.ccExpMonth).to.be.true;
    });

    it('unsets the model value when $invalid', function () {
      controller.$setViewValue('ab');
      scope.$digest();
      expect(scope.expiration.ccExpMonth).to.be.undefined;
    });

  });

  describe('cc-exp-year', function () {

    var controller, element;
    beforeEach(function () {
      element    = angular.element('<input ng-model="expiration.year" cc-exp-year />');
      controller = $compile(element)(scope).controller('ngModel');
    });

    it('sets maxlength to 2', function () {
      expect(element.attr('maxlength')).to.equal('2');
    });

    it('adds a numeric pattern', function () {
      expect(element.attr('pattern')).to.equal('[0-9]*');
    });

    it('passes the value to cc-exp', function () {
      element    = angular.element('<div cc-exp><input ng-model="expiration.year" cc-exp-year /></div>');
      controller = $compile(element)(scope).children().controller('ngModel');

      var ccExpController = element.controller('ccExp');

      sinon.stub(ccExpController, 'set');
      controller.$setViewValue('99');
      expect(ccExpController.set).to.have.been.calledWith('year', 2099);
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

    var currentYear = new Date()
      .getFullYear()
      .toString()
      .substring(2, 4);

    it('is valid for this year', function () {
      controller.$setViewValue(currentYear);
      scope.$digest();
      expect(controller.$valid).to.be.true;
      expect(scope.expiration.year).to.equal(new Date().getFullYear());
    });

    it('is valid for a far-future year', function () {
      controller.$setViewValue('99');
      scope.$digest();
      expect(controller.$valid).to.be.true;
    });

    it('is not valid for a past year', function () {
      controller.$setViewValue('13');
      scope.$digest();
      expect(controller.$valid).to.be.false;
    });

  });

});
