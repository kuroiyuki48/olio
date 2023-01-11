var express = require('express');
var router = express.Router();
var connection = require('../library/database');
router.use(express.static("./public"))


function getPortofolio(req, res, next) {
  var dbP = 'SELECT * FROM portofolio ORDER BY id desc';
  connection.query(dbP, function(error, rows) {
      if(rows.length !== 0) {
          req.portofolio = rows;
          return next();
      }
  });
}

function getServices(req, res, next) {
  var dbS = 'SELECT * FROM services ORDER BY id asc';
  connection.query(dbS, function(error, rows) {
      if(rows.length !== 0) {
          req.services = rows;
          return next();
      }         
  });
}

function renderHomepage(req, res) {
  res.render('index', {
      portofolio: req.portofolio,
      services: req.services
  });
}

router.get('/', getPortofolio, getServices,  renderHomepage);
module.exports = router;
