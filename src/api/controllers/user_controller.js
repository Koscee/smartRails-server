const { userService } = require('../services');
const HttpStatus = require('../utils/httpStatusCodes');

module.exports = {
  /**  @METHOD: handles POST request to
   *    /api/users/register and /api/users/admin/register
   * */
  register: async function (req, res, next) {
    const userData = req.body;
    const { isAdmin } = req;

    const newUser = await userService.registerUser(userData, isAdmin);
    res.status(HttpStatus.CREATED).send(newUser);
  },

  /* ****  @METHOD: handles POST request to /api/users/login *** */
  login: async function (req, res, next) {
    const userDetails = req.body;

    const tokenObj = await userService.authenticateUser(userDetails);
    res.status(HttpStatus.OK).send(tokenObj);
  },

  /* ****  @METHOD: handles GET request to /api/users/logout *** */
  logout: async function (req, res, next) {
    const { user } = req;
    // set login status to false and clears the tokenObject
    const tokenObj = await userService.logoutUser(user.id);
    res.status(HttpStatus.OK).send(tokenObj);
  },

  /* ****  @METHOD: handles GET request to /api/users *** */
  getAll: async function (req, res, next) {
    const { user } = req;

    const users = await userService.getUsers(user.id);
    res.status(HttpStatus.OK).send(users);
  },

  /* ****  @METHOD: handles GET request to /api/users/:id *** */
  getById: async function (req, res, next) {
    const userId = req.params.id;

    const user = await userService.getUserById(userId);
    res.status(HttpStatus.OK).send(user);
  },

  /* ****  @METHOD: handles PUT request to /api/users/:id *** */
  update: async function (req, res, next) {
    const userId = req.params.id;
    const userProps = req.body;

    const updatedUser = await userService.updateUser(userId, userProps);
    res.status(HttpStatus.OK).send(updatedUser);
  },

  /* ****  @METHOD: handles DELETE request to /api/users/:id *** */
  delete: async function (req, res, next) {
    const userId = req.params.id;

    const deletedUser = await userService.deleteUser(userId);
    res
      .status(HttpStatus.OK)
      .send(`User '${deletedUser.email}' was deleted successfuly`);
  },
};
