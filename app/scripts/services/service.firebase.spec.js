'use strict';

describe('service.firebase', function () {


  beforeEach(function () {
    module('Tectonic');
    module('firebase.stubs');
  });

  describe('firebaseRef', function () {

    var FBURL = 'https://mock.firebaseio.com';

    beforeEach(module(function ($provide, stubsProvider) {

      var stubs = stubsProvider.$get();

      $provide.value('Firebase', stubs.firebaseStub());
      $provide.constant('FBURL', FBURL);


    }));

    it('should create references to firebase paths', inject(function (firebaseRef) {

      var path = 'path';

      var fbref = firebaseRef(path);

      expect(fbref.path).toEqual(FBURL + '/' + path);

      path = ['another', 'path'];

      fbref = firebaseRef(path);

      expect(fbref.path).toEqual(FBURL + '/another/path');


    }));


    describe('syncData', function () {


      var firebaseRef;

      beforeEach(module(function ($provide, stubsProvider) {

        var stubs = stubsProvider.$get();

        firebaseRef = stubs.firebaseStub();

        stubs.customSpy(firebaseRef.fns, 'limit', function () {
          return this;
        });

        $provide.value('firebaseRef', firebaseRef);
        $provide.value('$firebase', stubs.firebaseStub());

      }));

      it('should create firebase objects from angularFire', inject(function (syncData) {
        var path = 'path';
        var limit = 123;

        var sd = syncData(path, limit);
        expect(firebaseRef.fns.limit).toHaveBeenCalledWith(123);

      }));
    });

  });

});