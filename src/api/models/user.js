const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLE } = require('../constants');
const { checkEmailValid, checkFieldBlank } = require('../validations');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'username is required'],
      validate: [checkFieldBlank, 'username should not be blank'],
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'email is required'],
      validate: [checkEmailValid, 'invalid email'],
    },

    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: [6, 'password must be at least 6 characters long'],
    },

    role: { type: String, uppercase: true, default: ROLE.USER },

    phone_no: {
      type: String,
      default: '',
      //   validate: [checkFieldBlank, 'phone_no should not be blank'],
    },

    is_loggedIn: { type: String, default: false },

    // refers to the station name of the admin
    station: String,
  },

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// encrypt password before saving user record
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
