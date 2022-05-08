const express = require('express');
const cors = require('cors');
const routes = require('./api/routes');
const connectDB = require('./config/db');

// initialize express
const app = express();

// connect to the database
if (process.env.NODE_ENV !== 'test') {
  connectDB(process.env.MONGO_URI);
}

// for parsing application/json
app.use(express.json());

app.use(cors());

// serve static files
app.use('/apidocs', express.static('./apidocs'));

// call all routes
routes(app);

module.exports = app;
