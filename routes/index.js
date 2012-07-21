var async  = require('async')
  , db     = require('../database.js')
  , Update = db.models.Update
  , Repo   = db.models.Repo
  , User   = db.models.User;

module.exports = function(req, res) {
  async.parallel({
    updates: function(done){
      Update.findAll({
        order: 'created_at DESC'
      , limit: 500  
      })
      .success(function(updates){
        done(null, updates);
      })
      .error(function(err) {
        console.log(err);
        done(null, []);
      });
    },
    repos: function(done){
      Repo.findAll({
        order: 'created_at DESC'
      })
      .success(function(repos){
        done(null, repos);
      })
      .error(function(err) {
        console.log(err);
        done(null, []);
      });
    },
    users: function(done){
      User.findAll({
        order: 'username DESC'
      })
      .success(function(users){
        done(null, users);
      })
      .error(function(err) {
        console.log(err);
        done(null, []);
      });
    }
  },
  function(err, results) {
    res.render('index', { 
      title: "GitGong"
    , updates: results.updates
    , repos: results.repos
    , users: results.users
    })
  });
}