/* API documentation for all the endpoints in testRoute.js */

/**
 * @api {get} /api/users Get All Users
 * @apiName GetUsers
 * @apiDescription This returns a list of all the Users information
 * @apiGroup User
 *
 * @apiSuccess {Object[]} users Users list
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "users": [
 *              {
 *                  "name": "John",
 *                  "age": 10
 *              },
 *              {
 *                  "name": "John",
 *                  "age": 10
 *              }
 *          ]
 *      }
 */
