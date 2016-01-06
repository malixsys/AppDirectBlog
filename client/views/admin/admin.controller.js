'use strict';

angular.module('appDirectBlog')
  .controller('AdminCtrl', ['$q', 'Settings', function ($q, Settings) {

    var vm = this;

    vm.settings = {};
    $q.when(Settings.query({}).$promise).then(function(data){
      data.forEach(function(promise){
        $q.when(promise).then(function(setting){
          vm.settings[setting.name] = setting.value;
        })
      });
    });

    angular.extend(this, {
      name: 'AdminCtrl',
      save: function(form){
        form.$submitted = true;
        if(form.$invalid) return;
        Settings.saveUrl(form.url, vm.settings.url)
          .then(function(data){
            if(data) {
              alert('Saved!');
              form.$setPristine();
            }
          })
          .catch(function(){
            alert('Error!');
          });
      }
    });


  }]);
