'use strict';

describe('module.simpleLoginTools spec test', function () {

  beforeEach(module('Tectonic.module.simpleLoginTools'));
  beforeEach(module('Tectonic.mocks'));

  describe('waitForAuth', function () {

    var authObj = {};

    beforeEach(module(function ($provide) {

      $provide.decorator('$rootScope', function ($delegate) {
        $delegate.auth = authObj;
        return $delegate;
      });

    }));

    it('waits for login message', inject(function (async, $rootScope, waitForAuth, $timeout) {

      var authed = jasmine.createSpy();
      waitForAuth.then(authed);
      expect(authed).not.toHaveBeenCalled();
      async.flush($timeout);
      expect(authed).not.toHaveBeenCalled();
      $rootScope.$broadcast('$firebaseSimpleLogin:login');
      async.flush($timeout);
      expect(authed).toHaveBeenCalled();


    }));

    it('waits for logout message', inject(function (async, $rootScope, waitForAuth, $timeout) {

      var authed = jasmine.createSpy();
      waitForAuth.then(authed);
      expect(authed).not.toHaveBeenCalled();
      async.flush($timeout);
      expect(authed).not.toHaveBeenCalled();
      $rootScope.$broadcast('$firebaseSimpleLogin:logout');
      async.flush($timeout);
      expect(authed).toHaveBeenCalled();


    }));

    it('waits for error message', inject(function (async, $rootScope, waitForAuth, $timeout) {

      var authed = jasmine.createSpy();
      waitForAuth.then(authed);
      expect(authed).not.toHaveBeenCalled();
      async.flush($timeout);
      expect(authed).not.toHaveBeenCalled();
      $rootScope.$broadcast('$firebaseSimpleLogin:error');
      async.flush($timeout);
      expect(authed).toHaveBeenCalled();


    }));

  });

  describe('ngShowAuth', function () {

    var scope, element;

    describe('hooks into login', function () {

      beforeEach(inject(function ($compile, $rootScope) {

        var html = '<div ng-show-auth="login">{{auth.user.id}} is logged in</div>';

        scope = $rootScope.$new();
        var $element = angular.element(html);
        element = $compile($element)(scope);
        scope.$digest();

      }));

      it('waits to load last', inject(function ($rootScope, async, $timeout) {

        expect(element.hasClass('ng-cloak')).toBe(false);
        async.flush($timeout);
        expect(element.hasClass('ng-cloak')).toBe(true);


        describe('and then', function () {

          it('does magic', function () {

            expect(element.hasClass('ng-cloak')).toBe(true);
            $rootScope.$broadcast('$firebaseSimpleLogin:login');
            async.flush($timeout);
            expect(element.hasClass('ng-cloak')).toBe(false);

            $rootScope.$broadcast('$firebaseSimpleLogin:logout');
            async.flush($timeout);
            expect(element.hasClass('ng-cloak')).toBe(true);
          });
        });

      }));

    });

    describe('hooks into logout', function () {

      beforeEach(inject(function ($compile, $rootScope) {

        var html = '<div ng-show-auth="logout">Logged out</div>';

        scope = $rootScope.$new();
        var $element = angular.element(html);
        element = $compile($element)(scope);
        scope.$digest();

      }));

      it('waits to load last', inject(function ($rootScope, async, $timeout) {


        expect(element.hasClass('ng-cloak')).toBe(false);

        // have to change the loginState to = 'login' to test
        $rootScope.$broadcast('$firebaseSimpleLogin:login');

        async.flush($timeout);
        expect(element.hasClass('ng-cloak')).toBe(true);

        describe('and then', function () {

          it('does magic', function () {

            expect(element.hasClass('ng-cloak')).toBe(true);
            $rootScope.$broadcast('$firebaseSimpleLogin:logout');
            async.flush($timeout);
            expect(element.hasClass('ng-cloak')).toBe(false);

            $rootScope.$broadcast('$firebaseSimpleLogin:login');
            async.flush($timeout);
            expect(element.hasClass('ng-cloak')).toBe(true);
          });
        });

      }));


    });

    describe('hooks into error', function () {

      beforeEach(inject(function ($compile, $rootScope) {

        var html = '<div ng-show-auth="error">An error occurred: {{auth.error}}</div>';

        scope = $rootScope.$new();
        var $element = angular.element(html);
        element = $compile($element)(scope);
        scope.$digest();

      }));

      it('waits to load last', inject(function ($rootScope, async, $timeout) {


        expect(element.hasClass('ng-cloak')).toBe(false);
        async.flush($timeout);
        expect(element.hasClass('ng-cloak')).toBe(true);

        describe('and then', function () {

          it('does magic', function () {

            expect(element.hasClass('ng-cloak')).toBe(true);

            $rootScope.$broadcast('$firebaseSimpleLogin:error');
            async.flush($timeout);
            expect(element.hasClass('ng-cloak')).toBe(false);

            $rootScope.$broadcast('$firebaseSimpleLogin:login');
            async.flush($timeout);
            expect(element.hasClass('ng-cloak')).toBe(true);

            $rootScope.$broadcast('$firebaseSimpleLogin:error');
            async.flush($timeout);
            expect(element.hasClass('ng-cloak')).toBe(false);

            $rootScope.$broadcast('$firebaseSimpleLogin:logout');
            async.flush($timeout);
            expect(element.hasClass('ng-cloak')).toBe(true);

          });
        });

      }));


    });

    describe('hooks into multiple messages', function () {

      beforeEach(inject(function ($compile, $rootScope) {

        var html = '<div ng-show-auth="logout,error">This appears for logout or for error condition!</div>';

        scope = $rootScope.$new();
        var $element = angular.element(html);
        element = $compile($element)(scope);
        scope.$digest();

      }));

      it('waits to load last', inject(function ($rootScope, async, $timeout) {


        expect(element.hasClass('ng-cloak')).toBe(false);
        $rootScope.$broadcast('$firebaseSimpleLogin:login');
        async.flush($timeout);
        expect(element.hasClass('ng-cloak')).toBe(true);

        it('and then does magic', function () {

          $rootScope.$broadcast('$firebaseSimpleLogin:error');
          async.flush($timeout);
          expect(element.hasClass('ng-cloak')).toBe(false);

          $rootScope.$broadcast('$firebaseSimpleLogin:logout');
          async.flush($timeout);
          expect(element.hasClass('ng-cloak')).toBe(false);


          $rootScope.$broadcast('$firebaseSimpleLogin:login');
          async.flush($timeout);
          expect(element.hasClass('ng-cloak')).toBe(true);

        });

      }));

    });

    describe('throws an error', function () {

      var $element;

      describe('when no state is listed', function () {

        beforeEach(inject(function ($rootScope) {

          var html = '<div ng-show-auth>oops!</div>';

          scope = $rootScope.$new();
          $element = angular.element(html);

        }));

        it('should throw an error', inject(function ($compile) {

          try {
            element = $compile($element)(scope);
          } catch (e) {
            expect(e).toEqual(new Error('Invalid state "" for ng-show-auth directive, must be one of login, logout, or error'));
          }


        }));


      });

    });

  });

  describe('ngCloakDirective', function () {

    var scope, element;

    beforeEach(inject(function ($rootScope, $compile) {
      var html = '<div ng-cloak>Authentication has resolved.</div>';
      scope = $rootScope.$new();
      var $element = angular.element(html);
      element = $compile($element)(scope);
      scope.$apply();
    }));

    it('waits to authenticate', inject(function ($rootScope, $timeout, async) {

      expect(element.attr('ng-cloak')).toBeDefined();
      $rootScope.$broadcast('$firebaseSimpleLogin:login');
      async.flush($timeout);
      expect(element.attr('ng-cloak')).toBeUndefined();
    }));


  });

});