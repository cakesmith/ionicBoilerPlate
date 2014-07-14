'use strict';

describe('service.changeEmail', function () {

  beforeEach(function () {
    module('Tectonic.service.changeEmail');
    module('firebase.stubs');
  });

  var customSpy, ErrorWithCode, flush;

  beforeEach(module(function ($provide, stubsProvider) {

    var stubs = stubsProvider.$get();


    customSpy = stubs.customSpy;
    ErrorWithCode = stubs.ErrorWithCode;
    flush = stubs.flush;

    var loginService = jasmine.createSpyObj('loginService', ['login', 'logout', 'changePassword', 'createAccount', 'createProfile']);


//    var $rootScope = jasmine.createSpy();

    $provide.value('firebaseRef', stubs.firebaseStub());
    $provide.value('loginService', loginService);
//    $provide.value('$rootScope', $rootScope);


  }));

  var cb, opts;

  beforeEach(inject(function ($rootScope, loginService) {
    $rootScope.auth = {
      user: {
        uid  : 54321,
        email: 'test@test.net'
      }
    };

    cb = jasmine.createSpy('callback');

    opts = {
      callback: cb,
      newEmail   : 'my@newEmail.com',
      pass    : 'password'
    };

    loginService.login = function(email, pass, callback) {
      callback(null, 'user');
    };


  }));


  describe('#authenticate', function () {

    it('should reject promise on loginService error', inject(function ($timeout, changeEmailService, loginService) {

      var err = new ErrorWithCode(123, 'fail');

      loginService.login = function (email, pass, callback) {
        callback(err);
      };

      spyOn(loginService, 'login').and.callThrough();

      changeEmailService(opts);
      flush($timeout);

      expect(loginService.login).toHaveBeenCalled();
      expect(cb).toHaveBeenCalledWith(err);

    }));

    it('should resolve', inject(function($timeout, changeEmailService, loginService) {

      spyOn(loginService, 'login').and.callThrough();

      changeEmailService(opts);
      flush($timeout);

      expect(loginService.login).toHaveBeenCalled();
      expect(cb).not.toHaveBeenCalled();

    }));


  });

  describe('#loadOldProfile', function () {

    it('should reject promise on firebaseRef error', inject(function($timeout, changeEmailService, firebaseRef) {

      var error = new ErrorWithCode(543, 'zort');

      firebaseRef.fns.once = function (value, snapFn, err) {

        err(error);

      };

      changeEmailService(opts);
      flush($timeout);

      expect(cb).toHaveBeenCalledWith(error);

    }));


    it('should update user profile to have new email', inject(function (firebaseRef, changeEmailService, $timeout) {

      var newEmail = {};

      firebaseRef.fns.once = function (value, snapFn, err) {

        var snap = {
          val: function () {
            return newEmail;
          }
        };
        snapFn(snap);
      };

      spyOn(firebaseRef.fns, 'once').and.callThrough();

      changeEmailService(opts);
      flush($timeout);


      expect(firebaseRef.fns.once).toHaveBeenCalled();
      expect(newEmail.email).toEqual('my@newEmail.com');


    }));
  });

  describe('#createNewAccount', function () {


  });

  describe('copyProfile', function () {


  });

  describe('removeOldProfile', function () {


  });

  describe('removeOldLogin', function () {


  });


});