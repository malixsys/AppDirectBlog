'use strict';

angular.module('appDirectBlog')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/posts/add', {
        templateUrl: 'views/add-post/add-post.html',
        controller: 'AddPostCtrl',
        controllerAs: 'vm',
        data: {
          role: 'admin'
        }
      });
  });
