var db   = require('../database.js')
    Update = db.models.Update;

module.exports = function(req, res) {
  var push = JSON.parse(req.body.payload);

  Update.create({
    name         : push.repository.name
  , username     : push.pusher.name
  , commit_count : push.commits.length
  , url          : push.repository.url
  , private       : push.repository.private
  });

  req.io.sockets.emit('newpush', {
    user: push.pusher.name
  , repo: push.repository.name
  , commitCount: push.commits.length
  });
  res.send('okey-dokey');
}