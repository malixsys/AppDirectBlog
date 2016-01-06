'use strict';

angular.module('appDirectBlog')
  .controller('PostsCtrl', ['$q','Post', function ($q,Post) {

    var vm = this;

    $q.when(Post.query({}).$promise).then(function(data){
      vm.posts = [];
      data.forEach(function(promise){
        $q.when(promise).then(function(post){
          vm.posts.push({
            title: post.title,
            content: post.content
          })
        })
      });
    });

    angular.extend(this, {
      name: 'PostsCtrl',
      posts: false
    });

  }]);
