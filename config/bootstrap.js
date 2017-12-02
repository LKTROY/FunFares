/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  var bcrypt = require('bcrypt');
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync("123456", salt);

  var user = {"username": "admin", "password": hash}

  User.create(user).exec( function (err, model)  {

      model.save();

  });

  var hash = bcrypt.hashSync("123456", salt);

  var user = {"username": "boss", "password": hash}

  User.create(user).exec( function (err, model)  {

      model.save();

  });

  cb();
};
