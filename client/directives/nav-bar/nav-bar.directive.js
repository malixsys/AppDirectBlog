'use strict';

angular.module('appDirectBlog')
  .directive('navBar', function ($route, $timeout) {
    function selectTab($element) {
      var selected = $element.find('a.adb-primary_nav--link');
      selected.removeClass('adb-is-selected');

      var title = $route.current.controller.replace('Ctrl', '');
      selected = $element.find('a[title="' + title + '"]');
      selected.addClass('adb-is-selected');
    }

    return {
      restrict: 'E',
      templateUrl: 'directives/nav-bar/nav-bar.html',
      controller: function ($scope, $element, $attrs) {
        //adb-primary_nav--link
        //adb-is-selected
        $scope.$on('Nav:Update', function (event, next) {
          selectTab($element);
        });
      }
    };
  });
