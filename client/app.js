'use strict';

angular.module('appDirectBlog', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  'btford.socket-io'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

  })
  .factory('authInterceptor',
  function ($rootScope, $q, $cookieStore, $location) {
    return {

      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

    };
  })

  .run(function ($timeout, $rootScope, $location, Auth) {

    $rootScope.Auth = Auth;
    $rootScope.AppStarted = false;
    $timeout(function(){
      $rootScope.AppStarted = true;
    }, 10);
    function fireNavUpdate() {
      $timeout(function(){
        $rootScope.$broadcast('Nav:Update');
      }, 10);
    }

    $rootScope.goto = function(url) {
      $timeout(function(){
        return $location.path(url);
      }, 10);
    };

    $rootScope.$on('$routeChangeStart', function (event, next) {
      Auth.isReadyLogged().then(function(){
        if(next.data && next.data.role
          && Auth.getUser().roles.indexOf(next.data.role) === -1) {
          return $location.path('/');
        }
        fireNavUpdate();
      }).catch(function () {

        //we are not authenticated here

        if (next.authenticate) {
          return $location.path('/');
        }
        if(!next.data || !next.data.anonymous) {
          return $location.path('/login');
        }
        fireNavUpdate();
      });
    });

  });
