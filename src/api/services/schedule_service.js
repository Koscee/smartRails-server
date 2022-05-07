const moment = require('moment');
const { Schedule } = require('../models');
const ApiError = require('../exceptions/ApiError');
const { getTrainByTrainNo } = require('./train_service');
const { calculateBasePrice } = require('./pricing_service');
const { updateSeats } = require('./seat_service');

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';

module.exports = {
  /* creates journey schedule time for all stops combinations */
  generateJrnysTime: function (strtDate, strtTime, stops, pathsInfo, avgSpeed) {
    // keeps track of journey time info for all stops
    const stopsTimeInfo = new Map();

    let arrTime = '';
    let waitTime = 0; // secs
    let depTime = strtTime;
    let jrnyDate = moment(`${strtDate} ${strtTime}`);

    // generate time information for all stops
    for (let i = 0; i < stops.length; i += 1) {
      if (i === 0) {
        stopsTimeInfo.set(i, {
          arr_date: '--',
          arr_time: 'start station',
          wait_time: '--',
          dep_date: jrnyDate.format(dateFormat),
          dep_time: strtTime,
        });
      } else {
        const jrnyPath = pathsInfo.find(
          (path) => i - 1 === path.fromIndex && i === path.toIndex
        );
        // calculate journey duration in seconds (adding extra 900sec for traffic)
        const jrnyDuration =
          Math.floor(jrnyPath.distance / avgSpeed) * 3600 + 900;

        // create a moment object
        const m = moment(depTime, timeFormat);
        const arrDate = jrnyDate.add(jrnyDuration, 'seconds');

        // arrTime: depTime (of prev station) + jrnyDuration;
        arrTime = m.add(jrnyDuration, 'seconds').format(timeFormat);
        // random wait time from 3 - 10 mins ( converted to secs )
        waitTime = Math.floor(Math.random() * 8 + 3) * 60;
        // depTime: arrTime + waitTime;
        depTime = m.add(waitTime, 'seconds').format(timeFormat);
        // update the jrnyDate moment object
        jrnyDate = arrDate.add(waitTime, 'seconds');

        stopsTimeInfo.set(i, {
          arr_date: arrDate.format(dateFormat),
          arr_time: arrTime,
          wait_time: i === stops.length - 1 ? '--' : waitTime,
          dep_date: i === stops.length - 1 ? '--' : jrnyDate.format(dateFormat),
          dep_time: i === stops.length - 1 ? 'final stop' : depTime,
          //   jrnyDuration: jrnyDuration / 3600,
        });
      }
    }

    return { stopsTimeInfo, jrnyEndDate: jrnyDate };
  },

  extractJrnyTimeInfo: function (stopsTimeInfo, path, avgSpeed) {
    const s1TimeInfo = stopsTimeInfo.get(path.fromIndex);
    const s2TimeInfo = stopsTimeInfo.get(path.toIndex);
    const dateTimeOfDep = moment(
      `${s1TimeInfo.dep_date} ${s1TimeInfo.dep_time}`
    );
    const dateTimeOfArrv = moment(
      `${s2TimeInfo.arr_date} ${s2TimeInfo.arr_time}`
    );
    const totalTime = dateTimeOfArrv.diff(dateTimeOfDep, 'seconds');
    const runTime = Math.floor(path.distance / avgSpeed) * 3600;

    return { s1TimeInfo, s2TimeInfo, totalTime, runTime };
  },

  /**
   * Creates a new schedule using the provided scheduleData
   * @param {schedule} scheduleData an Object of schedule props
   * @returns a Promise of schedule Object
   */
  addSchedules: async function (scheduleData) {
    const { startDate, startTime, train_no } = scheduleData;

    // check if train exist
    const train = await getTrainByTrainNo(train_no);
    const {
      route: { start_station: origin, end_station: dest, stops, pathsInfo },
      service_class: { avg_speed, rail_type },
      carriages,
    } = train;

    /*  check the schedule collection if there is
    any existing schedule with the train's train_no */
    const noOfSchedules = await Schedule.find({
      train_no: train.train_no,
    }).count();

    if (noOfSchedules > 0) {
      throw ApiError.badRequest('This train has already been scheduled');
    }

    // get schedule time
    const { stopsTimeInfo, jrnyEndDate } = this.generateJrnysTime(
      startDate,
      startTime,
      stops,
      pathsInfo,
      avg_speed
    );

    // loop through paths and generate schedule using stopsTimeInfo
    const schedules = pathsInfo.map((path) => {
      // extract the jrny time information
      const { s1TimeInfo, s2TimeInfo, totalTime, runTime } =
        this.extractJrnyTimeInfo(stopsTimeInfo, path, avg_speed);

      // generate available tickets
      const tickets = carriages.map((c) => {
        // calculate ticket prices.
        const ticketPrice = calculateBasePrice(
          path.distance,
          c.seat_type,
          avg_speed
        );
        const ticketCount = c.max_seats_per_car * c.cars.length;

        return {
          seat_type: c.seat_type,
          base_price: ticketPrice,
          actual_price: ticketPrice,
          curr_count: ticketCount,
          is_available: true,
        };
      });

      return {
        origin: origin,
        destination: dest,
        from: path.from,
        to: path.to,
        train_no: train.train_no,
        rail_type: rail_type,
        dep_date: s1TimeInfo.dep_date,
        arr_date: s2TimeInfo.arr_date,
        dep_time: s1TimeInfo.dep_time,
        arr_time: s2TimeInfo.arr_time,
        wait_time: s1TimeInfo.wait_time,
        total_time: totalTime,
        run_time: runTime,
        distance: path.distance,
        tickets: tickets,
      };
    });

    // update train start time, end time, and isScheduled fields
    await train.updateOne({
      start_time: `${startDate} ${startTime}`,
      end_time: jrnyEndDate.format(`${dateFormat} ${timeFormat}`),
      is_scheduled: true,
    });

    // update seats aval_jrnys
    const aval_jrnys = pathsInfo.map(({ from, to, fromIndex, toIndex }) => ({
      from,
      to,
      fromIndex,
      toIndex,
    }));
    console.log('AVAL_JRNYS', aval_jrnys);
    await updateSeats(train.train_no, { aval_jrnys, status: true });

    console.log(pathsInfo.length);
    console.log(stopsTimeInfo);
    console.log('Start Date', startDate);
    console.log('End Date', jrnyEndDate.format(dateFormat));

    // save train schedules to the db
    return Promise.resolve(Schedule.create(schedules));
  },

  /**
   * Finds all schedules that match the searchFilter and returns their lists
   * @param {queryObject} searchFilter an Object of schedule field, value pair
   * @returns a Promise array of schedule objects.
   */
  getSchedules: function (searchFilter) {
    console.log(searchFilter);
    return Promise.resolve(Schedule.find(searchFilter).sort({ distance: 1 }));
  },

  /**
   * Finds a particular schedule using the provided scheduleId
   * @param {String} scheduleId an Id (String)
   * @returns a Promise of schedule Object
   */
  getScheduleById: async function (scheduleId) {
    const mssg = `Schedule with id '${scheduleId}' was not found.`;

    try {
      // find the schedule if it exists
      const foundSchedule = await Schedule.findById(scheduleId).select('-__v');

      // if doesnt exist throw notFound Error
      if (!foundSchedule) {
        throw ApiError.notFound(mssg);
      }

      // if exist return the record
      return foundSchedule;
    } catch (error) {
      // if invalid ID throw notFound Error
      if (error.kind === 'ObjectId') {
        throw ApiError.notFound(mssg);
      }
      throw error;
    }
  },

  /**
   * Updates train schedules using the provided scheduleProps
   * @param {schedule} scheduleProps an Object of schedule props
   * @returns a Promise of updated schedule Object
   */
  updateSchedules: async function (scheduleProps) {
    const { startDate, startTime, train_no } = scheduleProps;

    // check if train exist
    const train = await getTrainByTrainNo(train_no);

    /*  check the schedule collection if there is
    atleast one schedule with the train's train_no */
    const noOfSchedules = await Schedule.find({
      train_no: train.train_no,
    }).count();
    console.log('COUNT', noOfSchedules);
    if (noOfSchedules < 1) {
      throw ApiError.badRequest(
        `There is no schedule to update for train '${train.train_no}'`
      );
    }

    const {
      route: { stops, pathsInfo },
      service_class: { avg_speed },
    } = train;

    // get schedule time
    const { stopsTimeInfo, jrnyEndDate } = this.generateJrnysTime(
      startDate,
      startTime,
      stops,
      pathsInfo,
      avg_speed
    );

    // loop through paths and generate schedule using stopsTimeInfo
    const scheduleBulkUpdates = pathsInfo.map((path) => {
      // extract the jrny time information
      const { s1TimeInfo, s2TimeInfo, totalTime, runTime } =
        this.extractJrnyTimeInfo(stopsTimeInfo, path, avg_speed);

      const fieldsData = {
        dep_date: s1TimeInfo.dep_date,
        arr_date: s2TimeInfo.arr_date,
        dep_time: s1TimeInfo.dep_time,
        arr_time: s2TimeInfo.arr_time,
        wait_time: s1TimeInfo.wait_time,
        total_time: totalTime,
        run_time: runTime,
      };

      return {
        updateOne: {
          filter: { train_no: train.train_no, from: path.from, to: path.to },
          update: { ...fieldsData },
        },
      };
    });

    // update train start time and end time fields
    await train.updateOne({
      start_time: `${startDate} ${startTime}`,
      end_time: jrnyEndDate.format(`${dateFormat} ${timeFormat}`),
    });

    console.log('Updated Schedule', scheduleBulkUpdates);

    // update train schedules
    await Schedule.bulkWrite(scheduleBulkUpdates);

    return Promise.resolve(Schedule.find({ train_no: train.train_no }));
  },

  /**
   * Deletes train schedules using the provided trainNo
   * @param {String} trainNo a train number
   * @returns a Promise of deleted schedule Object
   */
  deleteSchedules: async function (trainNo) {
    // check if train exist
    const train = await getTrainByTrainNo(trainNo);

    /*  check the schedule collection if there is
    any existing schedule with the train's train_no */
    const noOfSchedules = await Schedule.find({
      train_no: train.train_no,
    }).count();

    if (noOfSchedules < 1) {
      throw ApiError.badRequest(
        `No schedules found for train '${train.train_no}'`
      );
    }

    // update train start time, end time, and isScheduled fields
    await train.updateOne({
      start_time: '',
      end_time: '',
      is_scheduled: false,
    });

    // update seats aval_jrnys
    await updateSeats(train.train_no, { aval_jrnys: [], status: false });

    // if exist delete the record
    return Promise.resolve(Schedule.deleteMany({ train_no: train.train_no }));
  },

  /**
   * updates number of available tickets for schedules
   * @param {[String]} jrnyPaths lists of journey paths
   * @param {String} seatType type of seat
   * @param {Number} countIncValue increment value
   * @param {Boolean} status if ticket is available or not
   * @param {Number} statusChangeValue the number when status should change
   * @returns a Promise of update result
   */
  updateAvailableTicketsCount: function (
    jrnyPaths,
    seatType,
    countIncValue,
    status,
    statusChangeValue
  ) {
    return Promise.resolve(
      Schedule.updateMany(
        {
          jrny_path: { $in: [...jrnyPaths] },
          tickets: { $elemMatch: { seat_type: seatType } },
        },
        {
          $inc: {
            'tickets.$[elemFilter1].curr_count': countIncValue,
          },

          $set: { 'tickets.$[elemFilter2].is_available': status },
        },
        {
          arrayFilters: [
            { 'elemFilter1.seat_type': seatType },
            {
              'elemFilter2.seat_type': seatType,
              'elemFilter2.curr_count': status
                ? { $gte: statusChangeValue }
                : { $lte: statusChangeValue },
            },
          ],
        }
      )
    );
  },
};
