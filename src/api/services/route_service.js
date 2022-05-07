const { getDistance, convertDistance } = require('geolib');
const { Route } = require('../models');
const { stationService } = require('./index');
const ApiError = require('../exceptions/ApiError');

module.exports = {
  generateRouteStops: async function (startStation, endStation, middleStops) {
    /*
     * check if both start_station and end_station are valid stations
     * throws an error if any of the stations are not found
     */
    if (startStation === '' || endStation === '') {
      throw ApiError.badRequest('start or end station should not be blank');
    }

    const foundStartStation = await stationService.getStationByName(
      startStation
    );
    const foundEndStation = await stationService.getStationByName(endStation);

    const startStationId = foundStartStation._id.toString();
    const endStationId = foundEndStation._id.toString();

    // remove duplicates from middleStops list
    const filteredMiddleStops = middleStops.filter(
      (stop, index) => middleStops.indexOf(stop) === index
    );

    // check if stops provided includes start and end stations
    if (
      filteredMiddleStops.includes(startStationId) ||
      filteredMiddleStops.includes(endStationId)
    ) {
      throw ApiError.badRequest(
        'stops in between should not include start_station or end_station'
      );
    }
    return [startStationId, ...filteredMiddleStops, endStationId];
  },

  /**
   * Creates a new route using the provided routeData
   * @param {route} routeData an Object of route props
   * @returns a Promise of route Object
   */
  addRoute: async function (routeData) {
    const {
      start_station: startStation,
      end_station: endStation,
      stops: middleStops, // stops in between start and end station
    } = routeData;

    // validate routeData and generate route stops
    routeData.stops = await this.generateRouteStops(
      startStation,
      endStation,
      middleStops
    );

    // check if route already exists
    const foundRoute = await Route.findOne({
      $and: [{ start_station: startStation }, { end_station: endStation }],
    });

    if (foundRoute) {
      throw ApiError.badRequest('This route already exist');
    }

    // calculate total distance of the route
    const totalDistance = await this.calculateTotalDistatnce(routeData.stops);
    routeData.total_dist = totalDistance;

    return Promise.resolve(Route.create(routeData));
  },

  /**
   * Finds all routes and returns their lists
   * @returns a Promise array of route objects.
   */
  getRoutes: async function () {
    return Promise.resolve(
      Route.find({})
        .sort({ updated_at: -1 })
        .populate('stops', ['en_name', 'cn_name', 'city.cn_name'])
        .select('-__v')
    );
  },

  /**
   * Finds and a particular route using the provided routeId
   * @param {String} routeId an Id (String)
   * @returns a Promise of route Object
   */
  getRouteById: async function (routeId) {
    const mssg = `Route with id '${routeId}' was not found.`;

    try {
      // find the route if it exists
      const foundRoute = await Route.findById(routeId);

      // if doesnt exist throw notFound Error
      if (!foundRoute) {
        throw ApiError.notFound(mssg);
      }

      // If exist, remove the start and end station from the stops to avoid error during update.
      foundRoute.stops = foundRoute.stops.filter(
        (_, index) => index !== 0 && index !== foundRoute.stops.length - 1
      );

      // return the record
      return foundRoute;
    } catch (error) {
      // if invalid ID throw notFound Error
      if (error.kind === 'ObjectId') {
        throw ApiError.notFound(mssg);
      }
      throw error;
    }
  },

  /**
   * Updates an existing route using the provided routeId and routeProps
   * @param {String} routeId a route id
   * @param {route} routeProps an Object of route props
   * @returns a Promise of route Object
   */
  updateRoute: async function (routeId, routeProps) {
    const {
      start_station: startStation,
      end_station: endStation,
      stops: middleStops,
    } = routeProps;

    // validate routeData and generate route stops
    routeProps.stops = await this.generateRouteStops(
      startStation,
      endStation,
      middleStops
    );

    // check if route already exists
    const route = await this.getRouteById(routeId);

    if (
      startStation !== route.start_station ||
      endStation !== route.end_station
    ) {
      throw ApiError.badRequest('cannot update route on a different id');
    }

    // if route exists set routeProps, calculate distance and update route
    Object.keys(routeProps).forEach((key) => {
      route[key] = routeProps[key];
    });

    const totalDistance = await this.calculateTotalDistatnce(route.stops);
    route.total_dist = totalDistance;

    return Promise.resolve(route.save());
  },

  /**
   * Deletes an existing route using the provided routeId
   * @param {String} routeId a route id
   * @returns a Promise of route Object
   */
  deleteRoute: async function (routeId) {
    // checks if route exists and handle errors
    const route = await this.getRouteById(routeId);

    // if exist delete the record
    return Promise.resolve(route.deleteOne());
  },

  /**
   * Calculates the total distance between all the stations
   * @param {[id: String]}stops an array of station ids
   * @returns a Promise of total distance in km
   */
  calculateTotalDistatnce: async function (stops) {
    // check if station in stops exists and return the lists of stations
    const stations = stops.map(async (stationId) => {
      const station = await stationService.getStationById(stationId);
      return station;
    });

    try {
      const s = await Promise.all(stations);
      let totalDistance = 0;
      for (let i = 0; i < s.length - 1; i += 1) {
        const [lon1, lat1] = s[i].location.coordinates;
        const [lon2, lat2] = s[i + 1].location.coordinates;

        const distance = getDistance(
          { latitude: lat1, longitude: lon1 },
          { latitude: lat2, longitude: lon2 },
          7
        );
        const distanceInKm = convertDistance(distance, 'km');

        totalDistance += distanceInKm;
      }
      console.log(`Total distance: ${totalDistance}km`);

      return parseFloat(totalDistance.toFixed(1));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * Finds an existing route using the provided startStation endStation
   * @returns a Promise of route Object
   */
  /*  getRouteByStartAndEndStation: async function (startStation, endStation) {
    const foundRoute = await Route.findOne({
      $and: [{ start_station: startStation }, { end_station: endStation }],
    });

    return foundRoute;
  }, */
};
