(function(mocks) {

  mocks.factory('ErrorWithCode', function() {

    return function ErrorWithCode(code, msg) {

      this.code = code;
      this.msg = msg;

      var theError = this;

      ErrorWithCode.prototype.toString = function () {
        return theError.msg;
      };
    };

  });


}(angular.module('Tectonic.mocks', [
  'Tectonic.mock.async',
  'Tectonic.mock.auth',
  'Tectonic.mock.firebase',
  'Tectonic.mock.services',
  'Tectonic.mock.modules',
  'Tectonic.mock.views'
  ])));