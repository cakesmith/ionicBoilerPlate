'use strict';

(function (config) {

  // this config seeded from angularFire-seed
  // compatible with angularFire 0.6
  config.constant('version', '0.6');

  // Firebase URL
  config.constant('FBURL', 'https://tectonic.firebaseio.com');

  // where to redirect users if they need to authenticate (see module.routeSecurity)
  config.constant('loginRedirectPath', '/login');

}(angular.module('Tectonic.module.config', [])));
