module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
    username      : DataTypes.STRING
  , provider_id   : DataTypes.INTEGER
  , provider      : DataTypes.STRING
  , token         : DataTypes.STRING
  , tokensecret   : DataTypes.STRING
  , avatar        : DataTypes.STRING
  , display_name  : DataTypes.STRING
  , avatar        : DataTypes.STRING
  , url           : DataTypes.STRING
  })
}