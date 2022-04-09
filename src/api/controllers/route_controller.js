const { routeService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /* ****  @METHOD: handles POST request to /api/trains/routes *** */
  create: async function (req, res, next) {
    const routeData = req.body;

    // call the routeService addRoute method
    const newRoute = await routeService.addRoute(routeData);
    res.status(HttpStatus.CREATED).send(newRoute);
  },

  /* ****  @METHOD: handles GET request to /api/trains/routes *** */
  getAll: async function (req, res, next) {
    // call the routeService getRoutes method
    const routes = await routeService.getRoutes();
    res.status(HttpStatus.OK).send(routes);
  },

  /* **** @METHOD: handles GET request to /api/trains/routes/:id *** */
  getById: async function (req, res, next) {
    const routeId = req.params.id;

    const foundRoute = await routeService.getRouteById(routeId);
    res.status(HttpStatus.OK).send(foundRoute);
  },

  /* ****  @METHOD: handles PUT request to /api/trains/routes *** */
  update: async function (req, res, next) {
    const routeId = req.params.id;
    const routeProps = req.body;

    // call the routeService updateRoute method
    const updatedRoute = await routeService.updateRoute(routeId, routeProps);
    res.status(HttpStatus.OK).send(updatedRoute);
  },

  /* ****  @METHOD: handles DELETE request to /api/trains/routes *** */
  delete: async function (req, res, next) {
    const routeId = req.params.id;

    // call the routeService getRoutes method
    const deletedRoute = await routeService.deleteRoute(routeId);
    res
      .status(HttpStatus.OK)
      .send(
        `Route from ${deletedRoute.start_station} to ${deletedRoute.end_station} was deleted successfuly`
      );
  },
};
