const bcrypt = require('bcryptjs');
const { ROLE } = require('../constants');
const { TOKEN_PREFIX } = require('../constants/securityConstants');
const ApiError = require('../exceptions/ApiError');
const { User } = require('../models');
const filterObjectKeys = require('../utils/filterObjectKeys');
const { generateToken } = require('../utils/jwtTokenProvider');

module.exports = {
  /**
   * Registers a new user using the provided userData
   * @param {user} userData an Object of user props
   * @returns a Promise of user Object
   */
  registerUser: async function (userData, isAdmin) {
    // check if user with the email exist
    const foundUser = await User.findOne({ email: userData.email }).count();
    if (foundUser) {
      throw ApiError.badRequest('User already exists');
    }
    // assign role
    if (userData.role && !Object.keys(ROLE).includes(userData.role)) {
      throw ApiError.badRequest('Invalid role');
    }
    userData.role = isAdmin ? userData.role || ROLE.ADMIN : ROLE.USER;
    let newUser = await User.create(userData);
    newUser = filterObjectKeys({ ...newUser._doc }, ['password', '__v']);

    return Promise.resolve(newUser);
  },

  /**
   * Authenticates a user using a provided valid userDetails
   * @param {userDetails} userDetails an Object of user login details
   * @returns a Promise of token Object
   */
  authenticateUser: async function (userDetails) {
    const { email, password } = userDetails;
    const mssg = 'Invalid email or password';

    // Get user from db
    const foundUser = email && (await User.findOne({ email }));
    console.log(foundUser);
    if (!foundUser) {
      throw ApiError.badRequest(mssg);
    }
    // compare password
    const passwordMatch =
      password && (await bcrypt.compare(password, foundUser.password));
    if (!passwordMatch) {
      throw ApiError.badRequest(mssg);
    }
    // set foundUser login status
    foundUser.is_loggedIn = true;
    await foundUser.updateOne({ is_loggedIn: true });

    // generate token
    const payload = {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };
    if (foundUser.station) {
      payload.station = foundUser.station;
    }
    const token = generateToken(payload);

    // send token
    return Promise.resolve({ success: true, token: TOKEN_PREFIX + token });
  },

  /**
   * logout a user
   * @returns a Promise of an empty Object.
   */
  logoutUser: async function (userId) {
    await User.updateOne({ _id: userId }, { is_loggedIn: false });
    return Promise.resolve({});
  },

  /**
   * Finds all users and returns their lists
   * @param {String} currentUserId
   * @returns a Promise array of user Objects.
   */
  getUsers: function (currentUserId) {
    return Promise.resolve(
      User.find({ _id: { $ne: currentUserId } })
        .sort({ updated_at: -1 })
        .select('-password')
    );
  },

  /**
   * Finds a particular user using the provided userId
   * @param {String} userId an Id (String)
   * @returns a Promise of user Object
   */
  getUserById: async function (userId) {
    const mssg = `user with id '${userId}' was not found.`;

    try {
      // find the user
      const foundUser = await User.findById(userId).select('-password');
      // if user doesnt exist throw notFound Error
      if (!foundUser) {
        throw ApiError.notFound(mssg);
      }
      // if user exist
      return foundUser;
    } catch (error) {
      // if invalid ID throw notFound Error
      if (error.kind === 'ObjectId') {
        throw ApiError.notFound(mssg);
      }
      throw error;
    }
  },

  /**
   * Updates an existing user using the provided userId and userProps
   * @param {String} userId a user id
   * @param {user} userProps an Object of user props
   * @returns a Promise of updated user Object
   */
  updateUser: async function (userId, userProps) {
    // checks if user exists and handle errors
    const user = await this.getUserById(userId);

    // if exist, set update props values
    Object.keys(userProps).forEach((key) => {
      user[key] = userProps[key];
    });
    console.log('Updated user', user);
    let updatedUser = await user.save();
    updatedUser = filterObjectKeys({ ...updatedUser._doc }, ['password']);
    return Promise.resolve(updatedUser);
  },

  /**
   * Deletes an existing user using the provided userId
   * @param {String} userId a user id
   * @returns a Promise of deleted user Object
   */
  deleteUser: async function (userId) {
    // checks if user exists and handle errors
    const user = await this.getUserById(userId);
    // if exist delete the record
    return Promise.resolve(user.deleteOne());
  },
};
