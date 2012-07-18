var request = require('request')
    async   = require('async');

var db   = require('../database.js')
    Repo = db.models.Repo;

module.exports = function (req, res) {
  var userSession = req.session.passport.user;

  switch (req.params.action) {
    case 'subscribe':
    case 'unsubscribe':
      var postData = {
        "method" : "POST"
      , "url"  : "https://api.github.com/hub?access_token="+userSession.token
      , "form" : {
          "hub.mode" : req.params.action // subscribe OR unsubscribe
        , "hub.callback" : process.env.HOST+"/posthook"
        , "hub.topic"    : "https://github.com/"+req.params.account+"/"+req.params.name+"/events/push"
        }
      };

      request(postData, function(err, subscribeRes, body) {
        // Empty body is success (oddly enough)
        if (!body) {
          if (req.params.action === 'subscribe') {
            // get the metadata for the repo
            var repoUrl = "https://api.github.com/repos/"+req.params.account+"/"+req.params.name+"?access_token="+userSession.token+"&sort=pushed";
            request(repoUrl, function (err, repoRes, repoBody) {
              repoBody = JSON.parse(repoBody);
              Repo.create({
                github_id    : repoBody.id
              , account      : req.params.account
              , name         : req.params.name
              , description  : repoBody.description
              , private      : repoBody.private
              , url          : repoBody.url
              }).error(function(err) { 
                //console.log(err) // Duplicate key error
              });
            })
          }
          else {
            // an unsubscribe: so delete the repo
            Repo.find({ where: {account: req.params.account, name: req.params.name} }).on('success', function(repo) {
              repo.destroy().success(function(u) {
                // successfully deleted
              })
            })
          }

          res.contentType('json');
          res.send({});
        }
        else {
          res.contentType('json');
          res.send(body, subscribeRes.statusCode);
        }
      });
      break;


  }


}