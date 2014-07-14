'use strict';
// firebase.stubs is a module that will help with mocking and stubbing firebase services for testing

(function (stubs) {

  function stub() {
    var out = {};
    angular.forEach(arguments, function (m) {
      out[m] = jasmine.createSpy();
    });
    return out;
  }

  function reject($q, error) {
    var def = $q.defer();
    def.reject(error);
    return def.promise;
  }

  function resolve($q, val) {
    var def = $q.defer();
    def.resolve(val);
    return def.promise;
  }

  function customSpy(obj, m, fn) {

    obj[m] = fn;
    spyOn(obj, m).and.callThrough();
  }

  function firebaseStub() {

    // firebase is invoked using new Firebase, but we need a static ref
    // to the functions before it is instantiated, so we cheat here by
    // attaching the functions as Firebase.fns, and ignore new (we don't use `this` or `prototype`)
    var FirebaseStub = function (path) {

      FirebaseStub.fns.path = path;

      return FirebaseStub.fns;
    };
    FirebaseStub.fns = { callbackVal: null };

    customSpy(FirebaseStub.fns, 'set', function (value, cb) {
      if (cb !== undefined) {
        cb(FirebaseStub.fns.callbackVal);
      }
    });

    customSpy(FirebaseStub.fns, 'child', function () {
      return FirebaseStub.fns;
    });

    return FirebaseStub;

  }

  function flush($timeout) {
    try {
      $timeout.flush();
    }
    catch (e) {
    } // is okay
  }

  function ErrorWithCode(code, msg) {

    this.code = code;
    this.msg = msg;

    var theError = this;

    ErrorWithCode.prototype.toString = function () {
      return theError.msg;
    };
  }

  function angularAuthStub() {

    function AuthStub() { return AuthStub.fns; }

    AuthStub.fns = stub('$login', '$logout');

    return AuthStub;
  }

  stubs.provider('stubs', {
    $get: function() {
      return {
        stub           : stub,
        flush          : flush,
        reject         : reject,
        resolve        : resolve,
        customSpy      : customSpy,
        firebaseStub   : firebaseStub,
        ErrorWithCode  : ErrorWithCode,
        angularAuthStub: angularAuthStub
      };
    }
  });

}(angular.module('firebase.stubs', [])));