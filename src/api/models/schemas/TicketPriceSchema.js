const mongoose = require('mongoose');

const { Schema } = mongoose;

const TicketPriceSchema = new Schema({
  seat_type: String,
  base_price: Number,
  actual_price: Number,
  discount: { type: Number, default: 0 },
  curr_count: Number,
  // TODO: add a hook function tha automaticaly sets this field using d curr_count value
  is_available: { type: Boolean, default: false },
});

module.exports = TicketPriceSchema;
