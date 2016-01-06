'use strict';

angular.module('appDirectBlog')
  .factory('Settings', ['$resource', '$q', function ($resource, $q) {
    var Settings = $resource('/api/settings/:id', { id: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });

    return angular.extend(Settings, {
      saveUrl: function(input, url) {
        if(input.$dirty) {
          var setting = {
            //https://www.appdirect.com/api/marketplace/v1/listing?start=0&count=100
            name:'url',
            value: url
          };
          var deferred = $q.defer();
          Settings.save(setting, deferred.resolve, deferred.reject);
          return deferred.promise;
        }
        return $q.resolve(false);
      }
    })
  }]);
