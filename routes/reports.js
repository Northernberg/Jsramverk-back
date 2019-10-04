var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database.js');

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function(err) {
        if (err) {
            return res.status(401).json('Invalid JWT token.');
        }
        next();
    });
}

router.get('/week/:id', function(req, res) {
    db.get(
        'SELECT * FROM reports where week = ?',
        req.params.id,
        (err, row) => {
            if (err || row == null) {
                return res.status(404).json(err);
            } else {
                res.status(200).json(row);
            }
        }
    );
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
                    return res.status(401).json(err);
                } else {
                    res.status(201).json({ msg: 'Report created' });
                }
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
                if (err || !req.body.data || !req.body.week) {
                    return res.status(401).json(err);
                } else {
                    res.status(200).json();
                }
            }
        );
    }
);

router.delete(
    '/',
    (req, res, next) => checkToken(req, res, next),
    (req, res) => {
        db.run('DELETE FROM reports WHERE week = ?', req.body.week, err => {
            if (err || !req.body.week) {
                return res.status(401).json(err);
            } else {
                res.status(200).json({ msg: 'deleted.' });
            }
        });
    }
);

module.exports = router;
