(function(app) {

  // this app seeded from angularFire-seed
  // compatible with angularFire 0.6
  app.constant('version', '0.6');

  // Firebase URL
  app.constant('FBURL', 'https://tectonic.firebaseio.com');

  // where to redirect users if they need to authenticate (see module.routeSecurity)
  app.constant('loginRedirectPath', '/login');

}(angular.module('Tectonic.config', [])));
