'use strict';

describe('service.changeEmail', function () {

  var ErrorWithCode, flush, reject, resolve, cb, opts;

  var newEmail;

  beforeEach(function () {
    module('Tectonic.service.changeEmail');
    module('Tectonic.mocks');
  });

  beforeEach(module(function ($provide, firebaseStubProvider, loginServiceStubProvider) {

    var FBURL = 'http://mock.firebaseio.com';

    $provide.value('FBURL', FBURL);
    $provide.value('Firebase', firebaseStubProvider.$get());
    $provide.value('loginService', loginServiceStubProvider.$get());

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

  beforeEach(inject(function (loginService, Firebase) {

    // resolve loginService.login promise by default

    loginService.login.and.callFake(function (email, pass, cb) {
      cb(null, 'user');
    });

    // resolve loginService.createAccount by default

    loginService.createAccount.and.callFake(function (email, pass, cb) {
      cb(null, 'user');
    });

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

  describe('#authenticate', function () {

    it('should log in', inject(function ($timeout, changeEmailService, loginService) {

      changeEmailService(opts);
      flush($timeout);

      expect(loginService.login).toHaveBeenCalledWith(
        'test@test.net',
        'password',
        jasmine.any(Function)
      );

      expect(cb).not.toHaveBeenCalled();

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

      expect(loginService.createAccount).not.toHaveBeenCalled();

      flush($timeout);

      expect(loginService.createAccount).toHaveBeenCalled();

      expect(cb).not.toHaveBeenCalled();

      expect(Firebase.fns.set).toHaveBeenCalled();


    }));


  });



  describe('#removeOldProfile', function () {


  });

  describe('#removeOldLogin', function () {


  });

  describe('#errorFn', function () {

    describe('Firebase errors', function () {

      it('should reject promise on Firebase.once error', inject(function ($timeout, changeEmailService, Firebase) {

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


    describe('loginService errors', function () {


      it('loginService.login error', inject(function ($timeout, changeEmailService, loginService) {

        var err = new ErrorWithCode(123, 'fail');

        loginService.login.and.callFake(function (email, pass, callback) {
          callback(err);
        });

        changeEmailService(opts);
        flush($timeout);

        expect(loginService.login).toHaveBeenCalled();
        expect(cb).toHaveBeenCalledWith(err);

      }));

      it('loginService.createAccount error', inject(function (loginService, changeEmailService, $timeout) {

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


  });


});