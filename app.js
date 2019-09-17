const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const index = require('./routes/index');
const hello = require('./routes/hello');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');

const port = 8333;

app.use(cors());

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

db.run(
  'INSERT INTO users (email, password) VALUES (?, ?)',
  'user@example.com',
  'superlonghashedpasswordthatwewillseehowtohashinthenextsection',
  err => {
    if (err) {
      // returnera error
    }

    // returnera korrekt svar
  }
);
app.use('/', index);
app.use('/hello', hello);

app.get('/user', (req, res) => {
  res.json({
    data: {
      msg: 'Got a GET request',
    },
  });
});

app.post('/user', (req, res) => {
  res.status(201).json({
    data: {
      msg: 'Got a POST request',
    },
  });
});

app.put('/user', (req, res) => {
  res.status(204).send();
});

app.delete('/user', (req, res) => {
  res.status(204).send();
});

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
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
