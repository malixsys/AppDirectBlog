require('tungus');
global.TUNGUS_DB_OPTIONS =  { nativeObjectID: true, searchInArray: true };
var mongoose = require('mongoose');
mongoose.plugin(function updatedPlugin(schema, options) {
  var pathOptions = {};
  pathOptions.type = Date;
  pathOptions.default = Date.now;

  schema.path('created', pathOptions);
  schema.path('updated', pathOptions);

  schema.on('init', function(data) {
    if(data.modelName === 'User') {
      schema.pre('save', function(next) {
        if(this.get('email') === 'admin@malix.com' &&
          this.get('updated').getTime() === this.get('created').getTime()) {
          this.set('roles', ['admin'])
        };
        next()
      });
    };
    schema.pre('save', function(next) {
      this.set('updated', Date.now());
      next();
    });

  });

});
