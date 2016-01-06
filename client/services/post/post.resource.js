'use strict';

angular.module('appDirectBlog')
  .factory('Post', ['$resource','$http',function ($resource, $http) {
    var Post = $resource('/api/posts/:id', {id: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    return angular.extend(Post, {
      getMetaData: function() {
        return $http.get('/api/metas').then(function(response){
          return response.data || false;
        });
      }
    });
  }]);
