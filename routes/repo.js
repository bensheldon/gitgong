var request = require('request')
    async   = require('async');

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