const mongoose = require('mongoose');
const PointSchema = require('./schemas/PointSchema');
const CarriageSchema = require('./schemas/TrainCarriageSchema');

const { Schema } = mongoose;

const TrainSchema = new Schema(
  {
    train_no: {
      type: String,
      required: [true, 'train number is required'],
      unique: true,
      validate: {
        validator: (trainNo) => trainNo !== ' ',
        message: 'train number should not be blank',
      },
    },

    // train_type: String

    total_cars: { type: Number, default: 0 },

    pssngr_capacity: { type: Number, default: 0 },

    service_class: { type: Schema.Types.ObjectId, ref: 'trainType' },

    carriages: [CarriageSchema],

    route: { type: Schema.Types.ObjectId, ref: 'route' },

    start_time: { type: String, default: '' },

    end_time: { type: String, default: '' },

    is_scheduled: { type: Boolean, default: false },

    in_service: { type: Boolean, default: true },

    curr_location: { type: PointSchema, default: {} },

    curr_speed: { type: Number, default: 0 },

    curr_station: { type: String, default: '' },

    nxt_station: { type: String, default: '' },

    // added_by: { type: Schema.Types.ObjectId, ref: 'admin' },

    // updated_by: { type: Schema.Types.ObjectId, ref: 'admin' },
  },

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// calculates the total_cars and pssngr_capacity before saving a train
TrainSchema.pre('save', function (next) {
  let totalNumOfCars = 0;
  let totalNumOfPssngrs = 0;

  this.carriages.forEach(({ cars, max_seats_per_car }) => {
    totalNumOfCars += cars.length;
    cars.forEach(() => {
      totalNumOfPssngrs += parseInt(max_seats_per_car, 10);
    });
  });

  this.total_cars = totalNumOfCars;
  this.pssngr_capacity = totalNumOfPssngrs;

  next();
});

// creates seats after a new train is added
TrainSchema.post('save', async (doc, next) => {
  const Seat = mongoose.model('seat');
  const seats = [];

  const generateSeats = async () => {
    for (const carriage of doc.carriages) {
      for (const car_no of carriage.cars) {
        const seatCount = await Seat.find({
          train_no: doc.train_no,
          car_no,
        }).count();
        for (let i = seatCount; i < carriage.max_seats_per_car; i += 1) {
          const seat = {
            type: carriage.seat_type,
            sno: `${i + 1}`,
            car_no: car_no,
            train_no: doc.train_no,
            //   aval_jrnys: [],
            //   status: 0,
          };
          seats.push(seat);
        }
      }
    }
  };

  await generateSeats();

  console.log('TRAIN POST SAVE seats', seats);
  await Seat.create(seats);
  next();
});

// deletes associated seats after a train is deleted
TrainSchema.post('deleteOne', { document: true, query: false }, (doc, next) => {
  const Seat = mongoose.model('seat');

  Seat.deleteMany({ train_no: doc.train_no }).then(() => next());
});

const Train = mongoose.model('train', TrainSchema);

module.exports = Train;
