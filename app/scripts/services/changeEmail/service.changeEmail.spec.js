'use strict';
/* jshint ignore:start */

describe('service.changeEmail', function () {

  var ErrorWithCode, flush, reject, resolve, cb, opts;

  beforeEach(function () {
    module('Tectonic.service.changeEmail');
    module('Tectonic.mocks');
  });

  beforeEach(module(function ($provide, firebaseStubProvider, loginServiceStubProvider) {

    var FBURL = "http://mock.firebaseio.com";

    $provide.value('FBURL', FBURL);
    $provide.value('Firebase', firebaseStubProvider.$get());
    $provide.value('loginService', loginServiceStubProvider.$get());

  }));

  beforeEach(inject(function (_ErrorWithCode_, async, $rootScope) {

    ErrorWithCode = _ErrorWithCode_;

    flush = async.flush;
    reject = async.reject;
    resolve = async.resolve;

    $rootScope.auth = {
      user: {
        uid  : 54321,
        email: 'test@test.net'
      }
    };

    cb = jasmine.createSpy('callback');

    opts = {
      callback: cb,
      newEmail: 'my@newEmail.com',
      pass    : 'password'
    };

  }));

  beforeEach(inject(function (loginService) {

    // resolve login service by default

    loginService.login.and.callFake(function (email, pass, cb) {
      cb(null, 'user');
    });


  }));

  describe('#authenticate', function () {

    it('should resolve promise by default', inject(function ($timeout, changeEmailService, loginService) {

      changeEmailService(opts);
      flush($timeout);

      expect(loginService.login).toHaveBeenCalled();
      expect(cb).not.toHaveBeenCalled();

    }));

    it('should reject promise on loginService error', inject(function ($timeout, changeEmailService, loginService) {

      var err = new ErrorWithCode(123, 'fail');

      loginService.login.and.callFake(function (email, pass, callback) {
        callback(err);
      });

      changeEmailService(opts);
      flush($timeout);

      expect(loginService.login).toHaveBeenCalled();
      expect(cb).toHaveBeenCalledWith(err);

    }));


  });

  var newEmail = {};

  beforeEach(inject(function (Firebase) {

    // resolve Firebase.once promise by default

    Firebase.fns.once.and.callFake(function (value, snapFn) {

      var snap = {
        val: function () {
          return newEmail;
        }
      };
      snapFn(snap);
    });

  }));

  describe('#loadOldProfile', function () {

    it('should update user profile to have new email', inject(function (Firebase, changeEmailService, $timeout) {

      changeEmailService(opts);
      flush($timeout);

      expect(Firebase.fns.once).toHaveBeenCalled();
      expect(newEmail.email).toEqual('my@newEmail.com');


    }));

    it('should reject promise on Firebase error', inject(function ($timeout, changeEmailService, Firebase) {

      var error = new ErrorWithCode(543, 'zort');

      Firebase.fns.once.and.callFake(function (value, snapFn, err) {
        err(error);
      });

      changeEmailService(opts);
      flush($timeout);

      expect(Firebase.fns.once).toHaveBeenCalled();
      expect(cb).toHaveBeenCalledWith(error);

    }));

  });

  describe('#createNewAccount', function () {

    it('should reject promise on loginService error', inject(function (loginService, changeEmailService, $timeout) {

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

  describe('copyProfile', function () {


  });

  describe('removeOldProfile', function () {


  });

  describe('removeOldLogin', function () {


  });


});
/* jshint ignore:end */