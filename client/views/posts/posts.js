'use strict';

angular.module('appDirectBlog')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/posts', {
        templateUrl: 'views/posts/posts.html',
        controller: 'PostsCtrl',
        controllerAs: 'vm',
        data: {
          role: 'admin'
        }
      });
  });
