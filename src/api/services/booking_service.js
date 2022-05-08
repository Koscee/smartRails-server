const moment = require('moment');
const { seatService, scheduleService, trainService } = require('.');
const ApiError = require('../exceptions/ApiError');
const { Booking, Passenger, Seat } = require('../models');

const seatPopulateFields = ['train_no', 'car_no', 'sno', 'type'];
const pssngrPopulateFields = [
  'ID_no',
  'first_name',
  'middle_name',
  'last_name',
  'full_name',
];
const schedulePopulateFields = [
  'from',
  'from_cn',
  'to',
  'to_cn',
  'dep_date',
  'dep_time',
];

module.exports = {
  /**
   * Creates a new booking using the provided requestData
   * @param {booking} requestData an Object of booking props
   * @param {user} user an Object of the authenticated user
   * @returns a Promise of booking Object
   */
  addBooking: async function (requestData, user) {
    const {
      scheduleId,
      seatType: selectedSeatType,
      passengerData,
      paidAmount,
    } = requestData;
    try {
      // find schedule
      const schedule = await scheduleService.getScheduleById(scheduleId);

      // check time diff, booking is not allowed after the scheduled date
      const timeDiff = moment(schedule.dep_date).diff(moment(), 'days');
      if (timeDiff < 0) {
        throw ApiError.badRequest('Deadline for booking has passed');
      }

      // check if selected seat_type is valid
      const ticketObject = schedule.tickets.find(
        ({ seat_type }) => seat_type === selectedSeatType
      );
      if (!ticketObject) throw ApiError.badRequest('Invalid seat type');

      // check if user is paying the correct amount
      if (Number(paidAmount) !== ticketObject.actual_price) {
        throw ApiError.badRequest('Invalid payment amount');
      }

      // TODO: check if passenger has already booked a seat

      // find an available seat
      const { from: pssngrOrigin, to: pssngrDest } = schedule;
      const avalSeat = await seatService.getAvailableSeat(
        selectedSeatType,
        pssngrOrigin,
        pssngrDest
      );
      if (!avalSeat) throw ApiError.badRequest('Seat not available');

      // lock the seat to prevent concurrent booking
      avalSeat.status = false;
      await avalSeat.updateOne({ status: false });

      // remove selected journey path from the list of aval_jrnys in seat object
      let { aval_jrnys } = avalSeat;
      const { fromIndex: pssngrOriginIndex, toIndex: pssngrDestIndex } =
        aval_jrnys.find(
          (path) => path.from === pssngrOrigin && path.to === pssngrDest
        );
      const deleted_aval_jrnys = [];
      const deletedPaths = [];
      aval_jrnys = aval_jrnys.filter(({ fromIndex, toIndex }, i, arry) => {
        const isPathInvalid =
          fromIndex === pssngrOriginIndex ||
          toIndex === pssngrDestIndex ||
          (fromIndex < pssngrOriginIndex && toIndex > pssngrDestIndex);

        if (isPathInvalid) {
          deleted_aval_jrnys.push(arry[i]);
          // to avoid -ve ticket.curr_count value when decrementing it
          deletedPaths.push(`${arry[i].from}-${arry[i].to}`);
        }
        return !isPathInvalid;
      });

      avalSeat.aval_jrnys = aval_jrnys;
      // change seat status to unlock the seat
      if (aval_jrnys.length > 0) {
        avalSeat.status = true;
      }
      // save updated seat record
      await avalSeat.save();

      // update train car available tickets count in schedule
      await scheduleService.updateAvailableTicketsCount(
        deletedPaths,
        avalSeat.type,
        -1,
        false,
        1
      );

      // update or create passenger
      const { ID_no, ID_type } = passengerData;
      await Passenger.updateOne(
        { ID_no, ID_type },
        { ...passengerData },
        { upsert: true }
      );
      const passenger = await Passenger.findOne({ ID_no, ID_type });

      // generate order
      const newOrder = {
        status: 'complete',
        passenger: passenger._id,
        schedule: schedule._id,
        seat: avalSeat._id,
        paid_amount: paidAmount,
        booked_by: user.id,
        booked_at: user.station || 'online',
      };

      // save newOrder
      return Promise.resolve(Booking.create(newOrder));
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      //   throw server error
      throw ApiError.serverError('unable to process booking');
    }
  },

  /**
   * Finds lists of bookings based on the searchFilter
   * @param {{}} searchFilter a query object
   * @returns a Promise array of booking objects.
   */
  getBookings: function (searchFilter) {
    return Promise.resolve(
      Booking.find(searchFilter)
        .sort({ updated_at: -1 })
        .populate('seat', [...seatPopulateFields])
        .populate('passenger', [...pssngrPopulateFields])
        .populate('schedule', [...schedulePopulateFields])
    );
  },

  /**
   * Finds a particular order (booking) using the provided bookingId
   * @param {String} bookingId an Id (String)
   * @returns a Promise of booking Object
   */
  getBookingById: async function (bookingId) {
    const mssg = `order with id '${bookingId}' was not found.`;

    try {
      // find the booking if it exists
      const foundOrder = await Booking.findById(bookingId)
        .populate('seat', [...seatPopulateFields])
        .populate('passenger', [...pssngrPopulateFields])
        .populate('schedule', [...schedulePopulateFields]);

      // if doesnt exist throw notFound Error
      if (!foundOrder) {
        throw ApiError.notFound(mssg);
      }
      // if exist return the record
      return foundOrder;
    } catch (error) {
      // if invalid ID throw notFound Error
      if (error.kind === 'ObjectId') {
        throw ApiError.notFound(mssg);
      }
      throw error;
    }
  },

  /**
   * Cancels an existing order (booking) and refunds payment
   * @returns a success or failure status.
   */
  cancelBooking: async function (bookingId) {
    try {
      // find booking
      const foundOrder = await this.getBookingById(bookingId);
      // check booking status
      if (foundOrder.status === 'cancelled') {
        throw ApiError.badRequest('this order has already been cancelled');
      }

      const { seat, schedule, paid_amount } = foundOrder;

      // check time diff, cancellation is not allowed
      //  after or a day before the scheduled date
      const timeDiff = moment(schedule.dep_date).diff(moment(), 'days');
      if (timeDiff < 1) {
        throw ApiError.badRequest('Deadline for cancellation has passed');
      }

      // find train and get pathInfo from train route
      const { route } = await trainService.getTrainByTrainNo(seat.train_no);
      const { from: pssngrOrigin, to: pssngrDest } = schedule;

      // get passenger origin and destination index from the route's pathsInfo arry
      const { fromIndex: pssngrOriginIndex, toIndex: pssngrDestIndex } =
        route.pathsInfo.find(
          (path) => path.from === pssngrOrigin && path.to === pssngrDest
        );

      // get aval_jrnys paths that was removed during booking of the seat
      const restoredJrnyPaths = [];
      const restored_aval_jrnys = route.pathsInfo.reduce(
        (result, { from, to, fromIndex, toIndex }) => {
          const isPathValid =
            fromIndex === pssngrOriginIndex ||
            toIndex === pssngrDestIndex ||
            (fromIndex < pssngrOriginIndex && toIndex > pssngrDestIndex);

          if (isPathValid) {
            result.push({ from, to, fromIndex, toIndex });
            restoredJrnyPaths.push(`${from}-${to}`);
          }
          return result;
        },
        []
      );

      // update seat aval_jrnys with restored seat jrnys paths... set seat status = true
      await Seat.updateOne(
        { _id: seat._id },
        {
          status: true,
          $push: { aval_jrnys: { $each: [...restored_aval_jrnys] } },
        }
      );

      // increment available ticket curr_count by 1 for all schedules of the restoredPaths
      await scheduleService.updateAvailableTicketsCount(
        restoredJrnyPaths,
        seat.type,
        1,
        true,
        0
      );

      // deduct booking charges frm the paid_amount and cal refundAmount
      // 7% will be charged for cancellation
      const refundAmount = Math.round(paid_amount * 0.93);

      // update booking status to cancelled and set refund_amount
      return Promise.resolve(
        Booking.updateOne(
          { _id: bookingId },
          { refund_amount: refundAmount, status: 'cancelled' }
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw error;
    }
  },

  /**
   * Updates an existing ordrer (booking) using the provided bookingId and requestData
   * @param {String} bookingId a booking id
   * @param {booking} requestData an Object of booking props
   * @returns a Promise of updated booking Object
   */
  updateBooking: async function (bookingId, requestData) {
    // checks if order exists and handle errors
    const foundOrder = await this.getBookingById(bookingId);

    // if exist, set update props values
    Object.keys(requestData).forEach((key) => {
      foundOrder[key] = requestData[key];
    });

    // save record
    return Promise.resolve(foundOrder.save());
  },

  /**
   * Deletes an existing order (booking) using the provided bookingId
   * @param {String} bookingId a booking id
   * @returns a Promise of deleted booking Object
   */
  deleteBooking: async function (bookingId) {
    // checks if passenger exists and handle errors
    const foundOrder = await this.getBookingById(bookingId);

    // if exist delete the record
    return Promise.resolve(foundOrder.deleteOne());
  },
};
