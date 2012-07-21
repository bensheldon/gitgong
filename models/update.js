module.exports = function(sequelize, DataTypes) {
  return sequelize.define("update", {
    name         : DataTypes.STRING
  , username     : DataTypes.STRING
  , url          : DataTypes.STRING
  , commit_count : DataTypes.INTEGER
  , private      : { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    underscored     : true
  , omitNull        : true

  })
}