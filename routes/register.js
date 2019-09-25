var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const { check, validationResult } = require('express-validator');

router.post(
  '/',
  [check('email').isEmail(), check('password').isLength({ min: 8 })],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if (err) {
        res.status(422).send(err);
      } else {
        db.run(
          'INSERT INTO users (firstname, lastname, email, password, birthdate) VALUES (?, ?, ?, ?, ?)',
          req.body.firstname,
          req.body.lastname,
          req.body.email,
          hash,
          req.body.birthdate,
          err => {
            if (err) {
              res.status(422).send('Error in registration');
            }
            res.status(201).send('Successfully registered');
            // returnera korrekt svar
          }
        );
      }
    });
  }
);

module.exports = router;
