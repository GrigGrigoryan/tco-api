const createError = require('http-errors');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const db = require('./models');

app.use(function (req, res, next) {
  if (req.originalUrl.match(/^\/?api/)) {
    res.header("Access-Control-Allow-Origin",
        req.get('origin')
    );
    res.header("Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE"
    );
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
  }
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('error');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('error2');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // return the error
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
