var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

router.post('/', [check('email').isEmail()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    db.get(
      'SELECT * FROM USERS WHERE email = ?',
      req.body.email,
      (err, row) => {
        if (err) {
          return res.status(422).send('Wrong email or password');
        } else {
          bcrypt.compare(req.body.password, row.password, function(
            err,
            correct
          ) {
            if (err || !correct) {
              return res.status(422).send('Wrong Password');
            } else if (correct) {
              const payload = { email: 'user@example.com' };
              const token = jwt.sign(payload, secret, { expiresIn: '1h' });

              res.status(200).json({
                username: row.firstname,
                token: token,
              });
            }
          });
        }
      }
    );
  }
});

module.exports = router;
