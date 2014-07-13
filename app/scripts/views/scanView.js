// A 'view' usually contains a controller, a route, and a template html.
// This should be sufficient to wire up a single view, or page, to a
// data source.
// This is not the same as ui-router's view, just a terminology I've come up
// with to group these components together into a unit.

'use strict';

(function(app) {

  app.config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('scanView', {
      url: '/scan',
      views: {
        'main': {
          controller: 'ScanViewCtrl',
          templateUrl: 'scanView.tpl.html'
        }
      },
      data: { pageTitle: 'ScanView' }
    });
  }]);

  app.controller('ScanViewCtrl', ['$scope', function($scope) {


  }]);


}(angular.module('Tectonic.scanView', [
  'ui.router'
])));