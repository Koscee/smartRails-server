const mongoose = require('mongoose');
const TicketPriceSchema = require('./schemas/TicketPriceSchema');

const { Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    origin: String,

    destination: String,

    from: String,

    from_cn: { type: String, default: '' },

    to: String,

    to_cn: { type: String, default: '' },

    jrny_path: String,

    train_no: String,

    rail_type: String,

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

ScheduleSchema.pre('save', async function (next) {
  this.jrny_path = `${this.from}-${this.to}`;
  const Station = mongoose.model('station');
  const from = await Station.findOne({ en_name: this.from }, { cn_name: 1 });
  const to = await Station.findOne({ en_name: this.to }, { cn_name: 1 });
  this.from_cn = from.cn_name;
  this.to_cn = to.cn_name;
  next();
});

const Schedule = mongoose.model('schedule', ScheduleSchema);

module.exports = Schedule;
