'use strict';

describe('service.firebase', function () {

  var customSpy, FBURL;

  beforeEach(function () {
    module('Tectonic.service.firebase');
    module('firebase.stubs');
  });

  beforeEach(module(function ($provide, stubsProvider) {

    var stubs = stubsProvider.$get();
    FBURL = 'https://mock.firebaseio.com';

    customSpy = stubs.customSpy;

    $provide.value('Firebase', stubs.firebaseStub());
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

    beforeEach(module(function ($provide, stubsProvider) {

      var stubs = stubsProvider.$get();

      $provide.value('firebaseRef', stubs.firebaseStub());
      $provide.value('$firebase', stubs.firebaseStub());

    }));

    it('should create firebase objects from angularFire', inject(function (syncData, firebaseRef) {
      var path = 'path';
      var limit = 123;

      customSpy(firebaseRef.fns, 'limit', function () {
        return this;
      });

      var sd = syncData(path, limit);
      expect(firebaseRef.fns.limit).toHaveBeenCalledWith(123);

    }));
  });
});