var db   = require('../database.js')
    Update = db.models.Update;

module.exports = function(req, res) {

  Update.findAll({
    order: 'created_at DESC'
  , limit: 10  
  }).success(function(updates){
    res.render('index', { 
      title: "GitGong"
    , updates: updates
    });

  })
}