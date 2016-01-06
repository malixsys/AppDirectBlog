'use strict';

angular.module('appDirectBlog')
  .controller('LoginCtrl', function ($location, Auth) {

    var vm = this;

    angular.extend(vm, {

      name: 'LoginCtrl',

      /**
       * User credentials
       */
      user: { email: 'test@test.com', password: 'test' },

      /**
       * Login method
       */
      login: function () {
        Auth.login(vm.user)
          .then(function () {
            $location.path('/');
          })
          .catch(function (err) {
            vm.error = err;
          });
      },

      cancel: function() {
        $location.path('/');
      }
    });

  });
