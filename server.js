var url             = require('url')
  , express         = require('express')
  , app             = module.exports = express.createServer()
  , RedisStore = require('connect-redis')(express)
  , io              = require('socket.io').listen(app);

  
var redisUrl = url.parse(process.env.REDISTOGO_URL),
    redisAuth = redisUrl.auth.split(':');  
app.set('redisHost', redisUrl.hostname);
app.set('redisPort', redisUrl.port);
app.set('redisDb', redisAuth[0]);
app.set('redisPass', redisAuth[1]);

var PORT = process.env.PORT || 3000;

var passport        = require('passport')
  , GitHubStrategy  = require('passport-github').Strategy;

var db   = require('./database.js')
    User = db.models.User; 

// Express Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());  
  app.use(express.session({ 
    secret: 'keyboard cat' 
  , store: new RedisStore({
        host: app.set('redisHost'),
        port: app.set('redisPort'),
        db: app.set('redisDb'),
        pass: app.set('redisPass')
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Always include the Session in the View
app.dynamicHelpers({
  userSession: function(req, res){
    return req.session.passport.user;
  },
  flash: function(req, res) {
    var flash = req.flash();
    if (flash.info || flash.error) {
      return flash;
    }
    else {
      return null;
    }
  }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
  io.set('log level', 1); // reduce logging
});

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT.split(':')[0],
    clientSecret: process.env.GITHUB_CLIENT.split(':')[1],
    callbackURL: process.env.HOST + "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.find({ where: {provider_id: profile.id, provider: 'github'} }).success(function(user) {
      console.log(user);

      if (!user) {
        user = User.build({
          username      : profile.username
        , provider_id   : profile.id
        , provider      : 'github'
        , token         : accessToken
        , tokensecret   : refreshToken
        , display_name  : profile.displayName
        , avatar        : profile._json.avatar_url
        , url           : profile.profileUrl
        });
      }
      user.save().success(function(user){
        done(null, user);
      });
    }).error(function(err) {
      console.log(err);
    });

  }
));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Redirect the user to GitHub for authentication.  When complete, GitHub
// will redirect the user back to the application at
// /auth/github/callback
app.get('/auth/github', passport.authenticate('github', { scope: 'repo' }));

// GitHub will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/users/'+req.user.username);
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/', require('./routes/index'));
app.get('/users/:user', require('./routes/users'));
app.post('/repo/:account/:name/:action', require('./routes/repo'));
app.post('/posthook', function (req, res, next) { req.io = io; next(); }, require('./routes/posthook'));

io.sockets.on('connection', function (socket) {
  socket.emit('info', { hello: 'world' });
});

app.listen(PORT, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});