var Sequelize = require("sequelize")
  , url       = require('url');

var db = url.parse(process.env.PG_URL);

var sequelize = new Sequelize(
  db.pathname.slice(1)              // database
, (db.auth.split(':'))[0]           // username
, (db.auth.split(':'))[1] || ''     // password
, {
    host: db.hostname || 'localhost'
  , port: db.port || 5432
  , dialect  : 'postgres'
  }
);

/** Load the models **/
sequelize.models = {};
var User = sequelize.import(__dirname + "/models/user.js");
sequelize.models.User = User;

var Repo = sequelize.import(__dirname + "/models/repo.js");
sequelize.models.Repo = Repo;

var Update = sequelize.import(__dirname + "/models/update.js");
sequelize.models.Update = Update;

// required to deal with this issue:
// https://github.com/sdepold/sequelize/issues/177
sequelize.sync();

// sequelize.getQueryInterface().addIndex()

module.exports = sequelize;