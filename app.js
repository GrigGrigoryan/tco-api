const createError = require('http-errors');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const db = require('./models');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin",
      req.get('origin')
  );
  res.header("Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE"
  );
  res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Routes
console.info('Initializing Routes...');
fs.readdirSync(`${__dirname}/routes`)
    .filter(file => file.substr(0, 1) !== '.')
    .forEach(file => {
      require(`./routes/${file}`)(app, db);
      console.info(`Route file initialized: ${file}`);
    });
//
// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// app.use((err, req, res, next) => {
//   res.locals.error = err;
//   const status = err.status || 500;
//   res.status(status).send(err.message);
// });

module.exports = app;
