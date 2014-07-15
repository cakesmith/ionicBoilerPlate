'use strict';

describe('module.routeSecurity', function () {

  beforeEach(module('Tectonic.module.routeSecurity'));

  var loginRedirectPath, $location, $route, authObj;

  beforeEach(module(function ($provide) {

    $provide.decorator('$rootScope', function ($delegate) {
      $delegate.auth = authObj;
      return $delegate;
    });

    $location = jasmine.createSpyObj('$location', [
      'replace',
      'path'
    ]);

    loginRedirectPath = 'https://login.redirected.io';

    $provide.value('$location', $location);
    $provide.value('loginRedirectPath', loginRedirectPath);

  }));

  describe('#_init', function () {

    describe('#_checkCurrent', function () {

      describe('#_authRequiredRedirect', function () {

        describe('if it requires auth', function () {

          beforeEach(module(function ($provide) {

            $route = {};

            $route.current = {
              authRequired: true
            };

            $provide.value('$route', $route);

          }));

          describe('and is not authenticated', function () {

            describe('if $route.current.pathTo', function () {

              describe('is defined', function () {

                describe(' and === loginRedirectPath', function () {

                  beforeEach(module(function () {
                    $route.current.pathTo = loginRedirectPath;
                  }));

                  it('sets redirectTo to /', inject(function ($rootScope) {
                    expect($route.current.pathTo).toEqual(loginRedirectPath);
                    expect($location.replace).toHaveBeenCalled();
                    expect($location.path).toHaveBeenCalledWith(loginRedirectPath);
                    $rootScope.$broadcast('$firebaseSimpleLogin:login');
                    expect($location.path).toHaveBeenCalledWith('/');

                  }));
                });

                describe(' and !== loginRedirectPath', function () {

                  var somePath;

                  beforeEach(module(function () {
                    somePath = 'some/other/path';
                    $route.current.pathTo = somePath;
                  }));

                  it('sets redirectTo to $route.current.pathTo', inject(function ($rootScope) {
                    expect($route.current.pathTo).toEqual(somePath);
                    expect($location.replace).toHaveBeenCalled();
                    expect($location.path).toHaveBeenCalledWith(loginRedirectPath);
                    $rootScope.$broadcast('$firebaseSimpleLogin:login');
                    expect($location.path).toHaveBeenCalledWith(somePath);
                  }));
                });
              });

              describe('is undefined', function () {

                var locationPath;

                beforeEach(module(function () {
                  locationPath = 'some/path';
                  $location.path.and.returnValue(locationPath);
                }));

                it('sets redirectTo to $location.path()', inject(function ($location, $rootScope) {
                  expect($route.current.pathTo).toBeUndefined();
                  expect($location.replace).toHaveBeenCalled();
                  expect($location.path).toHaveBeenCalledWith(loginRedirectPath);
                  $rootScope.$broadcast('$firebaseSimpleLogin:login');
                  expect($location.path).toHaveBeenCalledWith(locationPath);
                }));

              });
            });

          });

          describe('and is authenticated', function () {

            beforeEach(module(function () {

              authObj = {
                user: 'nicholas'
              };

            }));

            describe('if $location.path()', function () {

              describe(' === loginRedirectPath', function () {

                beforeEach(module(function () {
                  $location.path.and.returnValue(loginRedirectPath);
                }));

                it('should redirect to /', inject(function () {

                  expect($location.replace).toHaveBeenCalled();
                  expect($location.path).toHaveBeenCalledWith('/');


                }));

              });

              describe(' !== loginRedirectPath', function () {

                var anotherPath = 'another/path';

                beforeEach(module(function () {
                  $location.path.and.returnValue(anotherPath);
                }));

                it('should not redirect', inject(function () {
                  expect($location.replace).not.toHaveBeenCalled();
                  expect($location.path.calls.argsFor(0)).toEqual([]);
                }));


              });

            });


          });
        });

        describe('if it does not require auth', function () {

          beforeEach(module(function ($provide) {
            var $route = {};
            $provide.value('$route', $route);
          }));

          it('does not redirect', inject(function ($location) {
            expect($location.replace).not.toHaveBeenCalled();
            expect($location.path).not.toHaveBeenCalled();
          }));

        });

      });

      describe('messages', function () {

        describe('when auth is required', function () {

          beforeEach(module(function ($provide) {

            $route = {};

            $route.current = {
              authRequired: true
            };

            $provide.value('$route', $route);

          }));

          describe('and is authenticated', function () {

            beforeEach(module(function () {

              authObj = {
                user: 'nicholas'
              };

            }));

            describe('#_login', function () {

              describe('if this.redirectTo is defined', function () {

                beforeEach(module(function () {
                  $location.path.and.returnValue('/batman');
                  authObj = {};
                }));

                describe('it should hook into login message', function () {

                  it('and redirect to redirectTo', inject(function ($rootScope) {

                    $rootScope.$broadcast('$firebaseSimpleLogin:login');

                    expect($location.replace).toHaveBeenCalled();
                    expect($location.path.calls.mostRecent().args).toEqual(['/batman']);
                  }));


                });
              });

              describe('if this.redirectTo is undefined', function () {

                describe('if $location.path()', function () {

                  describe(' === loginRedirectPath', function () {

                    beforeEach(inject(function () {
                      $location.path.and.returnValue(loginRedirectPath);
                    }));

                    it('should set location to /', inject(function ($rootScope) {
                      $rootScope.$broadcast('$firebaseSimpleLogin:login');
                      expect($location.replace).toHaveBeenCalled();
                      expect($location.path).toHaveBeenCalledWith('/');
                    }));

                  });

                  describe(' !== loginRedirectPath', function () {

                    beforeEach(inject(function () {
                      $location.path.and.returnValue('zort');
                    }));

                    it('should not redirect', inject(function ($rootScope) {
                      $rootScope.$broadcast('$firebaseSimpleLogin:login');
                      expect($location.replace).not.toHaveBeenCalled();
                      expect($location.path.calls.mostRecent().args).not.toEqual('/');
                    }));
                  });
                });
              });


            });

            describe('#_logout', function () {

              beforeEach(module(function () {


                $route.current.pathTo = loginRedirectPath;


              }));

              it('should hook into $firebaseSimpleLogin:logout message', inject(function ($rootScope) {

                expect($location.path.calls.mostRecent().args).toEqual([]);

                $rootScope.$broadcast('$firebaseSimpleLogin:logout');

                expect($location.path.calls.mostRecent().args).toEqual([loginRedirectPath]);

              }));


            });

            describe('#_error', function () {

              describe('if authenticated', function () {

                it('should not redirect', inject(function ($rootScope) {

                  $rootScope.$broadcast('$firebaseSimpleLogin:error');

                  expect($location.replace).not.toHaveBeenCalled();
                  expect($location.path).toHaveBeenCalledWith();

                }));
              });

              describe('if not authenticated', function () {

                beforeEach(module(function () {

                  authObj = {};

                }));

                it('should redirect', inject(function ($rootScope) {

                  $rootScope.$broadcast('$firebaseSimpleLogin:error');

                  expect($location.replace).toHaveBeenCalled();
                  expect($location.path).toHaveBeenCalledWith(loginRedirectPath);


                }));


              });

            });

          });
        });

        describe('when auth is not required', function () {

          beforeEach(module(function ($provide) {

            $route = {};

            $route.current = {
              authRequired: false
            };

            $provide.value('$route', $route);

          }));

          iit('#_login should not redirect', inject(function ($rootScope) {

//            expect($location.path.calls.count()).toEqual(1);
            $rootScope.$broadcast('$firebaseSimpleLogin:login');
            expect($location.replace).not.toHaveBeenCalled();
            expect($location.path.calls.count()).toEqual(1);
            expect($location.path.calls.mostRecent().args).toEqual([]);

          }));

          it('#_logout should not redirect', inject(function ($rootScope) {

            $rootScope.$broadcast('$firebaseSimpleLogin:logout');
            expect($location.replace).not.toHaveBeenCalled();
            expect($location.path).not.toHaveBeenCalled();

          }));

          it('#_error should not redirect', inject(function ($rootScope) {

            $rootScope.$broadcast('$firebaseSimpleLogin:error');
            expect($location.replace).not.toHaveBeenCalled();
            expect($location.path).not.toHaveBeenCalled();

          }));

        });

        describe('or not authenticated', function () {

          beforeEach(module(function ($provide) {

            $route = {};

            $route.current = {
              authRequired: false
            };

            $provide.value('$route', $route);

          }));

          it('#_login should not route', inject(function ($rootScope) {

            $rootScope.$broadcast('$firebaseSimpleLogin:login');

            expect($location.replace).not.toHaveBeenCalled();
            expect($location.path.calls.count()).toEqual(1);


          }));


        });

      });
    });
  });


});