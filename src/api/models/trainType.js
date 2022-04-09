const mongoose = require('mongoose');

const { Schema } = mongoose;

const TrainTypeSchema = new Schema(
  {
    name: { type: String, required: [true, 'name is required'], unique: true },

    max_speed: { type: Number, required: [true, 'max_speed is required'] },

    min_speed: Number,

    avg_speed: { type: Number, default: 0 },

    rail_type: {
      type: String,
      required: [true, 'rail_type is required'],
      enum: {
        values: ['High speed', 'Conventional'],
        message: "'{VALUE}' is not a valid rail type",
      },
    },

    seat_types: {
      type: [String],
      validate: {
        validator: (seatTypes) =>
          seatTypes.length > 0 && seatTypes !== undefined,
        message: 'seat types are required',
      },
    },

    description: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

TrainTypeSchema.pre('save', function (next) {
  this.avg_speed = (this.max_speed + this.min_speed) / 2;
  next();
});

const TrainType = mongoose.model('trainType', TrainTypeSchema);

module.exports = TrainType;
