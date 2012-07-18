var request = require('request')
    async   = require('async');

var db   = require('../database.js')
    Repo = db.models.Repo;

module.exports = function(req, res) {
  var userSession = req.session.passport.user;

  if (userSession.username === req.params.user) {
    var usersRepos = [];
    // show current user's repos
    var usersReposUrl = "https://api.github.com/user/repos?access_token="+userSession.token+"&sort=pushed";
    // get a list of the user's repos
    request(usersReposUrl, function (err, repoRes, body) {
      allRepos = JSON.parse(body);
      for (var i=0; i<allRepos.length; i++) {
        if (allRepos[i].permissions.admin === true) {
          usersRepos.push(allRepos[i]);
        }
      }

      async.forEach(usersRepos, function(repo, done) {
        Repo.find({ where: {github_id: repo.id} }).success(function(subscription) {
          if (subscription) {
            repo.subscribedTo = true;
          }
          else {
            repo.subscribedTo = false;
          }
          done();
        });
      }
      , function(err) {
        res.render('user', { 
          title: "ChickenMole"
        , usersRepos: usersRepos
        });
      });
    });
  }
  else {
    res.render('404', { status: 404, url: req.url, title: "Not found" });
  }
}