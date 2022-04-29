const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    status: String,

    passenger: { type: Schema.Types.ObjectId, ref: 'passenger' },

    schedule: { type: Schema.Types.ObjectId, ref: 'schedule' },

    seat: { type: Schema.Types.ObjectId, ref: 'seat' },

    paid_amount: Number,

    refund_amount: { type: Number, default: 0 },

    // booked_by: { type: Schema.Types.ObjectId, ref: 'user' },

    // booked_at: String,
  },

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Booking = mongoose.model('booking', BookingSchema);

module.exports = Booking;
