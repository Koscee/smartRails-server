const mongoose = require('mongoose');
const TicketPriceSchema = require('./schemas/TicketPriceSchema');

const { Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    origin: String,

    destination: String,

    from: String,

    to: String,

    train_no: String,

    dep_date: String,

    arr_date: String,

    arr_time: String,

    dep_time: String,

    wait_time: String,

    total_time: Number,

    run_time: Number,

    distance: Number,

    tickets: { type: [TicketPriceSchema], default: [] },
  },

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// TODO: create a pre update middleware which will be triggered by booking
// it should check, if tickets.curr_count === 0, tickets.is_available = false

const Schedule = mongoose.model('schedule', ScheduleSchema);

module.exports = Schedule;
