/* represents extra charges for tickets based on the train speed
 * the higher the speed, extra charges are added to ticket price
 * percntCharge represent the charge rate in %
 * unit of speed is km/h
 */
const SPEED_FARE_RATES = [
  { min: 0, max: 119, percntCharge: 10 },
  { min: 120, max: 159, percntCharge: 20 },
  { min: 160, max: 199, percntCharge: 25 },
  { min: 200, max: 299, percntCharge: 30 },
  { min: 300, max: 399, percntCharge: 40 },
];

module.exports = SPEED_FARE_RATES;
