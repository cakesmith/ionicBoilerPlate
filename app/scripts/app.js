'use strict';
// Ionic Starter App

(function (app) {

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('intro', {
        url        : '/',
        templateUrl: 'templates/intro.html',
        controller : 'IntroCtrl'
      })
      .state('main', {
        url        : '/main',
        templateUrl: 'templates/main.html',
        controller : 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');

  }]);

  app.run(function () {
  });


}(angular.module('Tectonic', [
  'ionic',
  'Tectonic.controllers'
])));


