'use strict';

angular.module('appDirectBlog')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'vm',
        data: {
          anonymous: true
        }
      });
  });
