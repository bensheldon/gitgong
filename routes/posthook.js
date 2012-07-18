module.exports = function(req, res) {
  var push = JSON.parse(req.body.payload);
  req.io.sockets.emit('newpush', {
    user: push.pusher.name
  , repo: push.repository.name
  , commitCount: push.commits.length
  });
  res.send('okey-dokey');
}