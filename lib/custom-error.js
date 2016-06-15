'use strict'

/**
 * CustomError constructor
 * @param {Number} code    The Error code
 * @param {String} message The Error text
 */
function CustomError (code, message) {
  this.code = code
  this.message = message
}

CustomError.prototype = Object.create(Error.prototype)
CustomError.constructor = CustomError

module.exports = CustomError
