const moment = require('moment');
const {
  Passenger,
  Route,
  Schedule,
  Train,
  Station,
  TrainType,
  User,
  Booking,
} = require('../models');

module.exports = {
  /**
   * generates summary of system records
   * @returns a Promise Object
   */
  generateRecordsSummary: async function () {
    const dataStatistic = await this.getAllDataStaistics();
    const latestSchedules = await this.getLatestSchedules();

    return Promise.resolve({ dataStatistic, latestSchedules });
  },

  /**
   * calculates all data statistics of the entire system
   * @returns a Promise Object
   */
  getAllDataStaistics: async function () {
    const totalPassengers = await Passenger.find().count();
    const totalRoutes = await Route.find().count();
    const totalSchedules = await Schedule.find().count();
    const totalStations = await Station.find().count();
    const totalTrains = await Train.find().count();
    const totalTrainTypes = await TrainType.find().count();
    const totalUsers = await User.find().count();
    const bookingsSummary = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          totalPaidAmount: { $sum: '$paid_amount' },
          totalRefundAmount: { $sum: '$refund_amount' },
          count: { $sum: 1 },
        },
      },
    ]);
    let purchaseSummary = {};
    let refundSummary = {};

    const totalBookings = bookingsSummary.reduce((accumulator, item) => {
      if (item._id === 'complete') {
        purchaseSummary = item;
      }
      if (item._id === 'cancelled') {
        refundSummary = item;
      }
      return accumulator + item.count;
    }, 0);

    const totalRefundCharges =
      refundSummary.totalPaidAmount - refundSummary.totalRefundAmount;
    const totalRevenue = purchaseSummary.totalPaidAmount + totalRefundCharges;
    const purchaseRate = (purchaseSummary.count / totalBookings) * 100;
    const refundRate = (refundSummary.count / totalBookings) * 100;

    const statistic = {
      totalBookings,
      totalPassengers,
      totalRevenue,
      totalRoutes,
      totalSchedules,
      totalStations,
      totalTrains,
      totalTrainTypes,
      totalUsers,
      purchaseRate: parseFloat(purchaseRate.toFixed(2)),
      refundRate: parseFloat(refundRate.toFixed(2)),
    };

    return Promise.resolve(statistic);
  },

  /**
   * fetches the latest schedules
   * @returns a Promise array
   */
  getLatestSchedules: function () {
    const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const currentDate = new Date();

    // gets schedule created within the last 7days
    const latestSchedules = Schedule.find({
      created_at: { $gte: new Date(startDate), $lte: currentDate },
    })
      .sort({ distance: -1 })
      .limit(10)
      .select(['-tickets']);

    return Promise.resolve(latestSchedules);
  },
};
