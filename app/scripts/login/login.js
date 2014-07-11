(function (app) {

  app.config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('login', {

      url: '/login',
      views: {
        "main": {
          controller: 'LoginCtrl',
          templateUrl: 'login/login.tpl.html'

        }
      },
      data: { pageTitle: 'Login' }
    });
  }]);



  app.controller('LoginCtrl', ['$scope', function($scope) {
    var init = function() {


    };

    init();
  }]);

}(angular.module('Tectonic.login', [
    '$firebase',

])));