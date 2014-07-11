'use strict';
// Ionic Starter App

(function (app) {

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

  }]);

  app.run(function () {
  });

  app.controller('AppCtrl', function($scope) {

  });


}(angular.module('Tectonic', [
  'ionic',


])));


