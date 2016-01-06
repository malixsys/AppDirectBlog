'use strict';

angular.module('appDirectBlog')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm',
        data: {
          anonymous: true
        }
      });
  });
