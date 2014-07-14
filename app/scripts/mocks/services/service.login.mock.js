(function(login) {

login.provider('loginServiceStub', function() {

  return {

    $get: function () {

      return jasmine.createSpyObj('loginService', [
        'login',
        'logout',
        'changePassword',
        'createAccount',
        'createProfile'
      ]);
    }
  };
});

}(angular.module('Tectonic.mock.service.login', [])));