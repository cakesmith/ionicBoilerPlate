'use strict';

describe('service.firebase', function () {

  var FBURL;

  beforeEach(function () {
    module('Tectonic.service.firebase');
    module('Tectonic.mocks');
  });

  beforeEach(module(function ($provide, firebaseStubProvider) {

    FBURL = 'https://mock.firebaseio.com';

    $provide.value('Firebase', firebaseStubProvider.$get());
    $provide.constant('FBURL', FBURL);


  }));

  describe('firebaseRef', function () {

    it('should create references to firebase paths', inject(function (firebaseRef) {

      var path = 'path';
      var fbref = firebaseRef(path);

      expect(fbref.path).toEqual(FBURL + '/' + path);

      path = ['another', 'path'];
      fbref = firebaseRef(path);

      expect(fbref.path).toEqual(FBURL + '/another/path');

    }));

  });

  describe('syncData', function () {

    beforeEach(module(function ($provide, firebaseStubProvider) {

      $provide.value('$firebase', firebaseStubProvider.$get());

    }));

    it('should create firebase objects from angularFire', inject(function (syncData, Firebase) {
      var path = 'path';
      var limit = 123;

      Firebase.fns.limit = jasmine.createSpy().and.callFake(function() {
        return this;
      });

      var sd = syncData(path, limit);
      expect(Firebase.fns.limit).toHaveBeenCalledWith(123);

    }));
  });
});