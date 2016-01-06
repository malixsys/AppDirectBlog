'use strict';

angular.module('appDirectBlog')
  .controller('AddPostCtrl', ['$q', '$location', 'Post', function($q, $location, Post) {

    var vm = this;

    vm.columns = false;
    vm.apps = [];

    $q.when(Post.getMetaData()).then(function(data) {
      vm.columns = data && data.columns;
      vm.apps = data && data.apps;
    });

    angular.extend(this, {
      name: 'AddPostCtrl',
      add: function(form) {
        form.$submitted = true;
        if(form.$invalid) return;

        if(!vm.post.content || !vm.post.content.trim || vm.post.content.trim()===''  ){
          return;
        }

        Post.save(vm.post, function onOK(){
          alert('Saved!');
          return $location.path('/posts');
        }, function onError(){
          alert('Error!');
        });
      },
      cancel: function() {
        $location.path('/posts');
      }

    });

  }]);
