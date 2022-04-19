/* travel distance charges
 * the longer the distance, the higher the discount
 * percntCharge represent the discount rate in %
 */
const distFareRateOption = {
  PEAK_DIST: 2500, // peak distance
  PEAK_PERCNT_CHARGE: 50 / 100, // for distances longer than PEAK_DIST
  DIST_RANGE_DISCOUNTS: [
    { min: 0, max: 200, percntCharge: 100 },
    { min: 201, max: 500, percntCharge: 90 },
    { min: 501, max: 1000, percntCharge: 80 },
    { min: 1001, max: 1500, percntCharge: 70 },
    { min: 1501, max: 2500, percntCharge: 60 },
  ],
};

module.exports = distFareRateOption;
