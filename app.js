require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const reports = require('./routes/reports');
const register = require('./routes/register');
const login = require('./routes/login');
const chat = require('./routes/chat');

const port = 8333;
const app = express();

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use('/reports', reports);
app.use('/register', register);
app.use('/login', login);
app.use('/chat', chat);

app.use((req, res, next) => {
    var err = new Error('Not Found');

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        errors: [
            {
                status: err.status,
                title: err.message,
                detail: err.message,
            },
        ],
    });
});

// Start up server
const server = app.listen(port, () =>
    console.log(`Example API listening on port ${port}!`)
);

module.exports = server;
