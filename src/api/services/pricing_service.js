const {
  prices,
  distFareRateOption,
  SPEED_FARE_RATES,
} = require('../constants');

const { unitPrice, INSURANCE_RATE, MISCELLANEOUS_RATE } = prices;

const unitPriceOptions = new Map([
  ['Business class', unitPrice.BUSINESS_CLASS],
  ['1st class', unitPrice.FIRST_CLASS],
  ['2nd class', unitPrice.SECOND_CLASS],
  ['Sleeping berth', unitPrice.SLEEPING_BERTH],
  ['Hard seat', unitPrice.HARD_SEAT],
  ['Soft seat', unitPrice.SOFT_SEAT],
  ['Hard sleeper', unitPrice.HARD_SLEEPER],
  ['Soft sleeper', unitPrice.SOFT_SLEPPER],
]);

const addSpeedFare = (trainSpeed, basePrice) => {
  const speed = Math.abs(trainSpeed);
  const fareRateOption = SPEED_FARE_RATES.find(
    ({ min, max }) => speed >= min && speed <= max
  );
  const percntChargeValue = fareRateOption
    ? fareRateOption.percntCharge / 100
    : 0.5;

  const newPrice = basePrice + basePrice * percntChargeValue;
  return newPrice;
};

module.exports = {
  calculateBasePrice: function (travelDistance, seatType, trainSpeed) {
    const { PEAK_DIST, PEAK_PERCNT_CHARGE, DIST_RANGE_DISCOUNTS } =
      distFareRateOption;
    const pricePerKm = unitPriceOptions.get(seatType);
    let basePrice = 0;
    let reducedDist = Math.round(travelDistance);

    for (let i = 0; i < DIST_RANGE_DISCOUNTS.length; i += 1) {
      const { min, max, percntCharge } = DIST_RANGE_DISCOUNTS[i];
      const percntChargeValue = percntCharge / 100;
      let range = max - min;

      if (i > 0) range += 1;

      if (reducedDist <= range) {
        basePrice += pricePerKm * reducedDist * percntChargeValue;
        reducedDist = 0;
        break;
      }

      if (reducedDist > range) {
        basePrice += pricePerKm * range * percntChargeValue;
        reducedDist -= range;
      }
    }

    // if the reducedDistance is still > 0
    if (reducedDist > 0) {
      basePrice += pricePerKm * reducedDist * PEAK_PERCNT_CHARGE;
    }

    basePrice += basePrice * (INSURANCE_RATE + MISCELLANEOUS_RATE);

    basePrice = addSpeedFare(trainSpeed, basePrice);

    return Math.round(basePrice) || 0;
  },
};
