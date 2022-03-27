const testRoute = require('./testRoute');

module.exports = (app) => {
  app.use('/api', testRoute);
};
