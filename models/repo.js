module.exports = function(sequelize, DataTypes) {
  return sequelize.define("repos", {
    github_id    : { type: DataTypes.INTEGER, unique: true }
  , account      : DataTypes.STRING
  , name         : DataTypes.STRING
  , description  : DataTypes.TEXT
  , private      : { type: DataTypes.BOOLEAN, defaultValue: false }
  , url          : DataTypes.STRING
  }, {
    underscored     : true
  , freezeTableName : true
  })
}