'use strict';

angular.module('appDirectBlog')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/signup', {
        templateUrl: 'views/signup/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'vm',
        data: {
          anonymous: true
        }
      });
  });
