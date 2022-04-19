/* represents the seat type price per 1km
 * currency: ￥ (yuan)
 */
const unitPrice = {
  HARD_SEAT: 0.06861, // ￥0.06861/km
  SOFT_SEAT: 0.12322, // ￥0.12322/km
  HARD_SLEEPER: 0.14503, // ￥0.14503/km
  SOFT_SLEPPER: 0.25604, // ￥0.25604/km
  BUSINESS_CLASS: 0.3158, // ￥0.3158/km
  FIRST_CLASS: 0.3016, // ￥0.3016/km
  SECOND_CLASS: 0.2805, // ￥0.2805/km
  SLEEPING_BERTH: 0.3366, // ￥0.3366/km
};

// insurance rate applied to ticket prices
const INSURANCE_RATE = 0.01; // 1%

const MISCELLANEOUS_RATE = 0.3; // 30%

module.exports = { unitPrice, INSURANCE_RATE, MISCELLANEOUS_RATE };
