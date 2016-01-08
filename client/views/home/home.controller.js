'use strict';

angular.module('appDirectBlog')
  .controller('HomeCtrl', function ($q, $sce, Post) {

    var vm = this;

    vm.posts = [];

    $q.when(Post.render()).then(function(data) {
      vm.posts =  data && data.posts && data.posts.map && data.posts.map(function(post){
          console.log(post);
          return {
            title: post.title,
            html: $sce.trustAsHtml(post.description),
            guid: post.guid
          };
        });
    });

    Post.getMetaData()
    angular.extend(vm, {
      name: 'HomeCtrl'
    });

  });
