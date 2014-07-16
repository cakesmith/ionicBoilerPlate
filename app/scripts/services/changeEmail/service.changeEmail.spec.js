'use strict';

describe('service.changeEmail', function () {

  var ErrorWithCode, flush, resolve, reject, cb, opts;

  var newEmail;

  beforeEach(function () {
    module('Tectonic.service.changeEmail');
    module('Tectonic.mocks');
  });

  beforeEach(module(function ($provide, firebaseStubProvider) {

    var loginService = jasmine.createSpyObj('loginService', [
      'login',
      'createAccount'
    ]);

    var FBURL = 'http://mock.firebaseio.com';

    $provide.value('FBURL', FBURL);
    $provide.value('Firebase', firebaseStubProvider.$get());
    $provide.value('loginService', loginService);

  }));

  beforeEach(inject(function (_ErrorWithCode_, async, $rootScope) {

    ErrorWithCode = _ErrorWithCode_;

    cb = jasmine.createSpy('callback');

    flush = async.flush;
    reject = async.reject;
    resolve = async.resolve;

    $rootScope.auth = {
      user: {
        uid  : 54321,
        email: 'test@test.net'
      }
    };

    opts = {
      callback: cb,
      newEmail: 'my@newEmail.com',
      pass    : 'password'
    };

    newEmail = {};

  }));

  // Resolve loginService promises

  beforeEach(inject(function (loginService) {

    // .login

    loginService.login.and.callFake(function (email, pass, cb) {
      cb(null, 'user');
    });

    // .createAccount

    loginService.createAccount.and.callFake(function (email, pass, cb) {
      cb(null, 'user');
    });


  }));

  // Resolve Firebase promises

  beforeEach(inject(function (Firebase) {

    // .once

    Firebase.fns.once.and.callFake(function (value, snapFn) {

      var snap = {
        val: function () {
          return newEmail;
        }
      };
      snapFn(snap);
    });

    // .remove

    Firebase.fns.remove.and.callFake(function (cb) {
      cb(null);
    });


  }));

  // Resolve $rootScope promises

  beforeEach(inject(function ($q, $timeout, $rootScope) {

    // .auth.$removeUser

    $rootScope.auth.$removeUser = jasmine.createSpy().and.returnValue(resolve($q, {im: 'batman'}));


  }));

  describe('#authenticate', function () {

    it('should log in', inject(function ($timeout, changeEmailService, loginService) {

      changeEmailService(opts);
      flush($timeout);

      expect(loginService.login).toHaveBeenCalledWith(
        'test@test.net',
        'password',
        jasmine.any(Function)
      );

      expect(cb).toHaveBeenCalledWith(null);

    }));

  });

  describe('#loadOldProfile', function () {

    it('should update user profile to have new email', inject(function (Firebase, changeEmailService, $timeout) {

      changeEmailService(opts);
      flush($timeout);

      expect(Firebase.fns.once).toHaveBeenCalled();
      expect(newEmail.email).toEqual('my@newEmail.com');

    }));

  });

  describe('#createNewAccount', function () {

    it('should create a new account', inject(function (loginService, changeEmailService, $timeout) {

      changeEmailService(opts);
      flush($timeout);

      expect(loginService.createAccount).toHaveBeenCalledWith(
        opts.newEmail,
        opts.pass,
        jasmine.any(Function)
      );


    }));

  });

  describe('#copyProfile', function () {

    it('should copy the profile', inject(function (loginService, Firebase, changeEmailService, $timeout) {


      changeEmailService(opts);

      flush($timeout);

      expect(Firebase.fns.set).toHaveBeenCalledWith({
          email: 'my@newEmail.com'
        },
        jasmine.any(Function)
      );


    }));

  });

  describe('#removeOldProfile', function () {

    it('should remove the old profile', inject(function (Firebase, changeEmailService, $timeout) {

      changeEmailService(opts);
      flush($timeout);

      expect(Firebase.fns.remove).toHaveBeenCalledWith(jasmine.any(Function));

    }));


  });

  describe('#removeOldLogin', function () {

    it('should remove old login', inject(function (changeEmailService, $timeout, $rootScope) {

      changeEmailService(opts);
      flush($timeout);

      expect($rootScope.auth.$removeUser).toHaveBeenCalled();


    }));


  });

  describe('#errorFn', function () {

    describe('Firebase errors', function () {

      it('.once', inject(function ($timeout, changeEmailService, Firebase) {

        var error = new ErrorWithCode(543, 'zort');

        Firebase.fns.once.and.callFake(function (value, snapFn, err) {
          err(error);
        });

        changeEmailService(opts);
        flush($timeout);

        expect(Firebase.fns.once).toHaveBeenCalled();
        expect(cb).toHaveBeenCalledWith(error);

      }));

      it('.remove', inject(function (Firebase, changeEmailService, $timeout) {

        var error = new ErrorWithCode(789, 'pirate');

        Firebase.fns.remove.and.callFake(function (err) {
          err(error);
        });

        changeEmailService(opts);
        flush($timeout);

        expect(cb).toHaveBeenCalledWith(error);

      }));

      it('.set', inject(function (Firebase, changeEmailService, $timeout) {

        var error = new ErrorWithCode(938, 'batman');

        Firebase.fns.set.and.callFake(function (profile, err) {
          err(error);
        });

        changeEmailService(opts);
        flush($timeout);

        expect(cb).toHaveBeenCalledWith(error);

      }));

    });

    describe('loginService errors', function () {


      it('.login', inject(function ($timeout, changeEmailService, loginService) {

        var err = new ErrorWithCode(123, 'fail');

        loginService.login.and.callFake(function (email, pass, callback) {
          callback(err);
        });

        changeEmailService(opts);
        flush($timeout);

        expect(loginService.login).toHaveBeenCalled();
        expect(cb).toHaveBeenCalledWith(err);

      }));

      it('.createAccount', inject(function (loginService, changeEmailService, $timeout) {

        var error = new ErrorWithCode(789, 'fjord');

        loginService.createAccount.and.callFake(function (email, pass, err) {
          err(error);
        });

        changeEmailService(opts);
        flush($timeout);

        expect(loginService.login).toHaveBeenCalled();
        expect(loginService.createAccount).toHaveBeenCalled();
        expect(cb).toHaveBeenCalledWith(error);

      }));

    });

    describe('$rootScope errors', function () {

      it('.auth.$removeUser', inject(function ($q, $timeout, $rootScope, changeEmailService) {

        $rootScope.auth.$removeUser = jasmine.createSpy().and.returnValue(reject($q, 'womp womp'));

        changeEmailService(opts);
        flush($timeout);

        expect(cb).toHaveBeenCalledWith('womp womp');


      }));


    });
  });

  describe('null callback', function() {

    it('should provide a null callback', inject(function(changeEmailService, $timeout) {

      // this can only really be verified on a code coverage report

      opts = {
        email: 'bob@bobert.com',
        password: 'wordpass'
      };

      changeEmailService(opts);
      flush($timeout);

    }));


  });

  describe('.catch', function() {

    it('should call errorFn', inject(function(changeEmailService, $timeout, $rootScope, $q) {

      // again, this can only really be confirmed with a
      // coverage report.

      opts = {
        email: 'nick@larosa.com',
        password: 'spaceballs',
        callback: 'this is where we die silently'
      };

      $rootScope.auth.$removeUser = jasmine.createSpy().and.returnValue(reject($q, 'womp womp'));


      changeEmailService(opts);
      flush($timeout);

    }));


  });


});