var request = require('request')
    async   = require('async');

module.exports = function(req, res) {
  var userSession = req.session.passport.user;

  if (userSession.username === req.params.user) {
    var usersRepos = [];
    console.log(userSession.token);
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

      res.render('user', { 
        title: "ChickenMole"
      , usersRepos: usersRepos
      });
    });
  }
  else {
    res.render('404', { status: 404, url: req.url, title: "Not found" });
  }
}