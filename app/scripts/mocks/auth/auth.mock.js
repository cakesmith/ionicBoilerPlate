(function(auth) {

  auth.factory('auth', function() {

    function AuthStub() { return AuthStub.fns }

    AuthStub.fns = jasmine.createSpyObj('AuthStub.fns', [
      '$login',
      '$logout',
      '$changePassword',
      '$createUser',

    ]);

    return AuthStub;

  });


}(angular.module('Tectonic.mock.auth', [])));