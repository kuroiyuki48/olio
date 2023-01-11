var express = require('express');
var router = express.Router();
var connection = require('../library/database');
router.use(express.static("./public"))

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Olio' });
  //query
  connection.query('SELECT * FROM portofolio ORDER BY id desc', function (err, rows) {
      if (err) {
          req.flash('error', err);
          res.render('index', {
              data: ''
          });
      } else {
          res.render('index', {
              data: rows
          });
      }
  });
});

module.exports = router;
