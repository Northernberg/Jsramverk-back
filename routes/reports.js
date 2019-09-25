var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');

function checkToken(req, res, next) {
  const token = req.headers['x-access-token'];

  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      res.status(401).json('Invalid JWT token.');
    }

    // Valid token send on the request
    next();
  });
}

router.get('/', function(req, res) {
  const data = {
    data: {
      msg: 'Report page',
    },
  };

  res.json(data);
});

router.get('/week/:id', function(req, res) {
  db.get('SELECT * FROM reports where week = ?', req.params.id, (err, row) => {
    if (err) {
      res.status(401).send('Wrong email or password');
    } else {
      res.status(200).json(row);
    }
  });
});

router.post(
  '/',
  (req, res, next) => checkToken(req, res, next),
  (req, res) => {
    db.run(
      'INSERT INTO reports (week, data) VALUES (?, ?)',
      req.body.week,
      req.body.data,
      err => {
        if (err) {
          res.status(401).send(err);
        }
        res.status(201).send('Report created');
        // returnera korrekt svar
      }
    );
  }
);

router.post(
  '/update',
  (req, res, next) => checkToken(req, res, next),
  (req, res) => {
    db.run(
      'UPDATE reports SET data = ? WHERE week = ?',
      req.body.data,
      req.body.week,
      err => {
        if (err) {
          res.status(401).send();
        } else {
          res.status(200).json();
        }
      }
    );
  }
);

module.exports = router;
