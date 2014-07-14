(function (firebase) {

  firebase.provider('firebaseStub', function () {

    return {

      $get: function () {


        function FirebaseStub(path) {

          FirebaseStub.fns.path = path;

          return FirebaseStub.fns;
        }

        FirebaseStub.fns = jasmine.createSpyObj('Firebase.fns', [
          'set',
          'child',
          'once'
        ]);

        FirebaseStub.fns.callbackVal = null;

        FirebaseStub.fns.set.and.callFake(function (value, cb) {
          if (cb !== undefined) {
            cb(FirebaseStub.fns.callbackVal);
          }
        });

        FirebaseStub.fns.child.and.callFake(function () {
          return FirebaseStub.fns;
        });

        return FirebaseStub;


      }


    };
  });

}(angular.module('Tectonic.mock.firebase', [])));