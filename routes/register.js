var express = require('express');
var router = express.Router();

const db = require('../database.js');
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
                return res.status(422).send(err);
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
                            return res
                                .status(422)
                                .send('Error in registration');
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
