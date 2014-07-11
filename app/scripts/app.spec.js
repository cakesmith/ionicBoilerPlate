'use strict';

describe('AppCtrl', function() {
  describe('on initial load', function() {
    var AppCtrl, $location, $scope;

    beforeEach(module('Tectonic'));

    beforeEach(inject(function ($controller, _$location_, $rootScope) {

      $location = _$location_;

      $scope = $rootScope.$new();

      AppCtrl = $controller('AppCtrl', { $location: $location, $scope: $scope });

    }));

    it('should pass a dummy test', inject(function() {
      expect(AppCtrl).toBeTruthy();

    }));

    it('should route us to the login page', inject(function() {

    }));

  });
});