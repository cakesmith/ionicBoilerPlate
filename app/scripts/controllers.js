'use strict';

(function (app) {

  app.controller('IntroCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {

    // Called to navigate to the main app
    $scope.startApp = function () {
      $state.go('main');
    };
    $scope.next = function () {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function () {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function (index) {
      $scope.slideIndex = index;
    };
  });

  app.controller('MainCtrl', function ($scope, $state, $firebase) {
    console.log('MainCtrl');

    var ref = new Firebase("https://cbtt8vn05jj.firebaseio-demo.com/");

    $scope.messages = $firebase(ref);


    $scope.toIntro = function () {
      $state.go('intro');
    }
  });


}(angular.module('Tectonic.controllers', [
  'firebase'
])));