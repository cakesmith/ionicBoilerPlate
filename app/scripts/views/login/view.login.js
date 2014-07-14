'use strict';

(function (app) {

  app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider.state('login', {
      url        : '/login',
      controller : 'LoginCtrl',
      templateUrl: '/scripts/views/login/view.login.tpl.html'
    });

  }]);

  app.controller('LoginCtrl', ['$scope', function ($scope) {

    var init = function () {

      // A definitive place to put everything that needs to run when the controller starts.
      // Avoid writing any code outside of this function that executes immediately.


    };

    init();

  }]);

}(angular.module('Tectonic.view.login', [

// List Dependencies to inject here

  'ui.router'

])));