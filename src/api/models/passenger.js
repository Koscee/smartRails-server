const mongoose = require('mongoose');
const formatName = require('../utils/formatName');
const { checkFieldBlank, checkEmailValid } = require('../validations');

const { Schema } = mongoose;

function customMessage(field) {
  return `${field} should not be blank`;
}

const PassengerSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, 'first_name is required'],
      set: formatName,
    },

    middle_name: { type: String, set: formatName },

    last_name: {
      type: String,
      required: [true, 'last_name is required'],
      set: formatName,
    },

    ID_type: {
      type: String,
      required: [true, 'ID_type is required'],
      lowercase: true,
      validate: [checkFieldBlank, customMessage('ID_type')],
    },

    ID_no: {
      type: String,
      required: [true, 'ID_no is required'],
      validate: [checkFieldBlank, customMessage('ID_no')],
    },

    ID_exp_date: {
      type: String,
      required: [true, 'ID_exp_date is required'],
      validate: [checkFieldBlank, customMessage('ID_exp_date')],
    },

    gender: {
      type: String,
      required: [true, 'gender is required'],
      uppercase: true,
      enum: {
        values: ['M', 'F'],
        message: "gender should be either 'M' or 'F'",
      },
    },

    dOB: {
      type: String,
      required: [true, 'dOB is required'],
      validate: [checkFieldBlank, customMessage('dOB')],
    },

    nationality: {
      type: String,
      required: [true, 'nationality is required'],
      validate: [checkFieldBlank, customMessage('nationality')],
    },

    phone_no: {
      type: String,
      required: [true, 'phone_no is required'],
      validate: [checkFieldBlank, customMessage('phone_no')],
    },

    email: {
      type: String,
      lowercase: true,
      validate: [checkEmailValid, 'invalid email'],
    },

    added_by: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
  }
);

// creates a full_name virtual field
PassengerSchema.virtual('full_name').get(function () {
  const { first_name, middle_name, last_name } = this;
  return `${first_name} ${middle_name} ${last_name}`;
});

const Passenger = mongoose.model('passenger', PassengerSchema);

module.exports = Passenger;
