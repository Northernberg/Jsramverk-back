var express = require('express');
var router = express.Router();
const db = require('../database.js');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

router.post('/', [check('email').isEmail()], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        db.get(
            'SELECT * FROM users WHERE email = ?',
            req.body.email,
            (err, row) => {
                if (err || row == null) {
                    return res.status(422).json('Wrong email or password');
                } else {
                    bcrypt.compare(req.body.password, row.password, function(
                        err,
                        correct
                    ) {
                        if (err || !correct) {
                            return res.status(422).json('Wrong Password');
                        } else if (correct) {
                            const payload = { email: 'user@example.com' };
                            const token = jwt.sign(payload, secret, {
                                expiresIn: '1h',
                            });

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
