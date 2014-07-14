'use strict';

/* service.login specs */

describe('service.login', function () {
  var flush, resolve, reject, customSpy, ErrorWithCode;

  beforeEach(function () {
    module('Tectonic.service.login');
    module('firebase.stubs');
  });

  beforeEach(module(function ($provide, stubsProvider) {
    // mock dependencies used by our services to isolate testings

    var stubs = stubsProvider.$get();

    $provide.value('Firebase', stubs.firebaseStub());
    $provide.value('$location', stubs.stub('path'));
    $provide.value('$firebaseSimpleLogin', stubs.angularAuthStub());
    $provide.value('firebaseRef', stubs.firebaseStub());

    flush = stubs.flush;
    resolve = stubs.resolve;
    reject = stubs.reject;
    customSpy = stubs.customSpy;
    ErrorWithCode = stubs.ErrorWithCode;
  }));

  describe('loginService', function () {

    describe('#login', function () {

      it('should fail with Error if init() is not called first', inject(function ($timeout, loginService) {

        var errorThrown = false;
        var cb = jasmine.createSpy();

        try {
          loginService.login('test@test.com', '123', cb);
          flush($timeout);
        } catch (e) {
          errorThrown = true;
          expect(e.message).toBeDefined();
        }

        expect(errorThrown).toEqual(true);

      }));

      it('should return error if $firebaseSimpleLogin.$login fails',
        inject(function ($q, $timeout, loginService, $firebaseSimpleLogin) {
          var cb = jasmine.createSpy();
          loginService.init();
          $firebaseSimpleLogin.fns.$login.and.returnValue(reject($q, 'test_error'));
          loginService.login('test@test.com', '123', cb);
          flush($timeout);
          expect(cb).toHaveBeenCalledWith('test_error');
        })
      );

      it('should return user if $firebaseSimpleLogin.$login succeeds',
        inject(function (loginService, $firebaseSimpleLogin, $q, $timeout) {

          var cb = jasmine.createSpy();

          loginService.init();
          $firebaseSimpleLogin.fns.$login.and.returnValue(resolve($q, {hello: 'world'}));
          loginService.login('test@test.com', '123', cb);
          flush($timeout);

          expect(cb).toHaveBeenCalledWith(null, {hello: 'world'});

        })
      );
    });

    describe('#logout', function () {

      it('should fail with Error if init() is not called first', inject(function ($timeout, loginService) {

        var errorThrown = false;

        try {
          loginService.logout();
          flush($timeout);
        } catch (e) {
          errorThrown = true;
          expect(e.message).toBeDefined();
        }

        expect(errorThrown).toEqual(true);

      }));
      it('should invoke $firebaseSimpleLogin.$logout()', function () {
        inject(function (loginService, $firebaseSimpleLogin) {
          loginService.init();
          loginService.logout();
          expect($firebaseSimpleLogin.fns.$logout).toHaveBeenCalled();
        });
      });
    });

    describe('#changePassword', function () {

      beforeEach(
        inject(function ($timeout, $firebaseSimpleLogin, $q) {
          customSpy($firebaseSimpleLogin.fns, '$changePassword',
            function (eml, op, np) {
              var def = $q.defer();
              $timeout(function () {
                def.resolve();
              });
              return def.promise;
            });
        })
      );

      it('should fail with Error if init() is not called first',
        inject(function ($timeout, loginService) {

          var errorThrown = false;
          var cb = jasmine.createSpy();

          try {

            loginService.changePassword({
              newpass : 123,
              confirm : 123,
              callback: cb
            });

            flush($timeout);

          } catch (e) {
            errorThrown = true;
            expect(e.message).toBeDefined();
          }

          expect(errorThrown).toEqual(true);
        })
      );

      it('should fail if old password is missing',
        inject(function (loginService, $firebaseSimpleLogin, $timeout) {
          var cb = jasmine.createSpy();
          loginService.init();
          loginService.changePassword({
            newpass : 123,
            confirm : 123,
            callback: cb
          });
          flush($timeout);

          expect(cb.calls.count()).toEqual(1);

          expect(cb).toHaveBeenCalledWith('Please enter a password');
          expect($firebaseSimpleLogin.fns.$changePassword).not.toHaveBeenCalled();
        })
      );

      it('should fail if new password is missing',
        inject(function (loginService, $firebaseSimpleLogin, $timeout) {
          var cb = jasmine.createSpy();
          loginService.init();
          loginService.changePassword({
            oldpass : 123,
            confirm : 123,
            callback: cb
          });
          flush($timeout);
          expect(cb).toHaveBeenCalledWith('Please enter a password');
          expect($firebaseSimpleLogin.fns.$changePassword).not.toHaveBeenCalled();
        })
      );

      it('should fail if passwords don\'t match',
        inject(function (loginService, $firebaseSimpleLogin, $timeout) {
          var cb = jasmine.createSpy();
          loginService.init();
          loginService.changePassword({
            oldpass : 123,
            newpass : 123,
            confirm : 124,
            callback: cb
          });
          flush($timeout);

          expect(cb.calls.count()).toEqual(1);

          expect(cb).toHaveBeenCalledWith('Passwords do not match');
          expect($firebaseSimpleLogin.fns.$changePassword).not.toHaveBeenCalled();
        })
      );

      it('should return null if $firebaseSimpleLogin succeeds',
        inject(function (loginService, $firebaseSimpleLogin, $timeout) {

          var cb = jasmine.createSpy();

          loginService.init();
          loginService.changePassword({
            oldpass : 124,
            newpass : 123,
            confirm : 123,
            callback: cb
          });
          flush($timeout);

          expect(cb).toHaveBeenCalledWith(null);
          expect($firebaseSimpleLogin.fns.$changePassword).toHaveBeenCalled();
        })
      );

      it('should fail if $firebaseSimpleLogin fails',
        inject(function (loginService, $firebaseSimpleLogin, $timeout, $q) {

          var cb = jasmine.createSpy();

          customSpy($firebaseSimpleLogin.fns, '$changePassword',
            function (email, op, np) {
              var def = $q.defer();
              $timeout(function () {
                def.reject(new ErrorWithCode(123, 'errr'));
              });
              return def.promise;
            });

          loginService.init();
          loginService.changePassword({
            oldpass : 124,
            newpass : 123,
            confirm : 123,
            callback: cb
          });

          flush($timeout);

          expect(cb.calls.argsFor(0)[0].toString()).toBe('errr');
          expect($firebaseSimpleLogin.fns.$changePassword).toHaveBeenCalled();

        })
      );

    });

    describe('#createAccount', function () {

      beforeEach(inject(function ($timeout, $firebaseSimpleLogin, $q) {
        customSpy($firebaseSimpleLogin.fns, '$createUser', function (eml, pass) {
          var def = $q.defer();
          $timeout(function () {
            def.resolve({name: 'kato'});
          });
          return def.promise;
        });
      }));

      it('should fail with Error if init() is not called first', inject(function ($timeout, loginService) {

        var errorThrown = false;
        var cb = jasmine.createSpy();

        try {
          loginService.createAccount('test@test.com', 123);
          flush($timeout);
        } catch (e) {
          errorThrown = true;
          expect(e.message).toBeDefined();
        }

        expect(errorThrown).toEqual(true);

      }));

      it('should invoke $firebaseSimpleLogin',
        inject(function (loginService, $firebaseSimpleLogin) {
          loginService.init();
          loginService.createAccount('test@test.com', 123);
          expect($firebaseSimpleLogin.fns.$createUser).toHaveBeenCalled();
        })
      );

      it('should invoke callback if $firebaseSimpleLogin throws an error',
        inject(function (loginService, $timeout, $firebaseSimpleLogin, $q) {
          var cb = jasmine.createSpy();
          customSpy($firebaseSimpleLogin.fns, '$createUser', function (email, pass) {
            var def = $q.defer();
            def.reject('joy!');
            return def.promise;
          });
          loginService.init();
          loginService.createAccount('test@test.com', 123, cb);
          flush($timeout);
          expect(cb).toHaveBeenCalledWith('joy!');
        })
      );

      it('should invoke callback if success',
        inject(function (loginService, $timeout) {
          var cb = jasmine.createSpy();
          loginService.init();
          loginService.createAccount('test@test.com', 123, cb);
          flush($timeout);
          expect(cb).toHaveBeenCalledWith(null, {name: 'kato'});
        })
      );
    });

    describe('#createProfile', function () {
      it('should be the createProfile service',
        inject(function (loginService, profileCreator) {
          expect(loginService.createProfile).toBe(profileCreator);
        })
      );
    });

  });

  describe('profileCreator', function () {

    var flush;

    beforeEach(module(function ($provide, stubsProvider) {
      // mock dependencies used by our services to isolate testing

      var stubs = stubsProvider.$get();

      flush = stubs.flush;

      $provide.value('firebaseRef', stubs.firebaseStub());

    }));

    it('should invoke set on Firebase',
      inject(function (profileCreator, firebaseRef, $timeout) {
        profileCreator(123, 'test@test.com');
        flush($timeout);
        expect(firebaseRef.fns.set.calls.argsFor(0)[0]).toEqual({email: 'test@test.com', name: 'Test'});
      }));

    it('should invoke the callback',
      inject(function (profileCreator, $timeout) {
        var cb = jasmine.createSpy();
        profileCreator(456, 'test2@test2.com', cb);
        flush($timeout);
        expect(cb).toHaveBeenCalled();
      }));

    it('should return any error in the callback',
      inject(function (profileCreator, firebaseRef, $timeout) {
        var cb = jasmine.createSpy();
        firebaseRef.fns.callbackVal = 'noooooo';
        profileCreator(456, 'test2@test2.com', cb);
        flush($timeout);
        expect(cb).toHaveBeenCalledWith('noooooo');
      }));
  });
});