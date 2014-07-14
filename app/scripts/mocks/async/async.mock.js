(function (async) {

  async.factory('async', ['$timeout', '$q', function ($timeout, $q) {

    function flush($timeout) {
      try {
        $timeout.flush();
      }
      catch (e) {
      } // is okay
    }


 function reject($q, error) {
      var def = $q.defer();
      def.reject(error);
      return def.promise;
    }


  function resolve($q, val) {
      var def = $q.defer();
      def.resolve(val);
      return def.promise;
    }

    return {
      flush: flush,
      reject: reject,
      resolve: resolve
    };

  }]);


}(angular.module('Tectonic.mock.async', [])));