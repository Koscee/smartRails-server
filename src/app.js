const express = require('express');
const routes = require('./api/routes');
const connectDB = require('./config/db');

// initialize express
const app = express();

// connect to the database
if (process.env.NODE_ENV !== 'test') {
  connectDB('smartrails');
}

// for parsing application/json
app.use(express.json());

// serve static files
app.use('/apidocs', express.static('./apidocs'));

// call all routes
routes(app);

module.exports = app;
