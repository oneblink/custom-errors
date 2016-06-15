'use strict'

const CustomError = require('./lib/custom-error.js')
const privateVars = new WeakMap()

/**
 * An object hash that maps error text to error codes
 * Error strings can contain placeholders which is replaced by the
 * corresponding string passed in to {@link ErrorFactory#create create}
 * Placeholders are numbers surrounded by {}, eg {1}
 *
 * @typedef {Object} ErrorConfiguration
 * @property {string} 1 The text of error code 1
 *
 * @example
 * {
 *   1: 'Invalid key {0}',
 *   2: 'Invalid password',
 *   3: 'Object requires the {0} property'
 * }
 */

/**
 * ErrorFactory for creating configuration driven Custom Errors
 */
class ErrorFactory {
  /**
   * Creates a new ErrorFactory instance
   * @param  {ErrorConfiguration} errorMessages The error configuration to use
   * @return {ErrorFactory}
   */
  constructor (errorMessages) {
    privateVars.set(this, {
      errors: null
    })

    this.errors = errorMessages
  }

  /**
   * Creates a new instance of ErrorFactory with the given error messages
   * @static
   * @param  {ErrorConfiguration} errorMessages A Javascript object that conforms to the ErrorConfiguration Spec
   * @return {function}               The [create function]{@link ErrorFactory#create} bound to a new instance of ErrorFactory, which uses `errorMessages` as its source
   */
  static use (errorMessages) {
    const factory = new ErrorFactory(errorMessages)

    return factory.create.bind(factory)
  }

  /**
   * If a message is supplied rather than a code, or if no ErrorConfiguration
   * Object has been supplied this will be used in its place
   *
   * Value: 0
   */
  get DEFAULT_CODE () {
    return 0
  }

  /**
   * If a message is supplied rather than a code, or if no ErrorConfiguration
   * Object has been supplied this will be used in its place
   *
   * Value 'Unknown Error'
   */
  get DEFAULT_MESSAGE () {
    return 'Unknown Error'
  }

  /**
   * Gets the error messages the instance is using
   * @return {Map} A Map of error codes and text
   */
  get errors () {
    return privateVars.get(this).errors
  }

  /**
   * Sets the error messages to use
   * @param  {ErrorConfiguration} errorMessages A Javascript object that conforms to the ErrorConfiguration Spec
   */
  set errors (errorMessages) {
    const errors = new Map()
    Object.keys(errorMessages || {}).forEach((key) => {
      errors.set(Number(key), errorMessages[key])
    })

    privateVars.get(this).errors = errors
  }

  /**
   * Constructs a CustomError
   *
   * If you use a custom message, the error code will be 0
   *
   * If the Error message contains placeholders, arguments[1..n] will be used
   * If the resulting message contains more than two consecutive spaces, they will
   * be replaced with one space
   * @param  {Number|string} code The error code to lookup, or a custom message
   * @return {CustomError}      A CustomError with the supplied code and corresponding message
   */
  create (code /* , ...values */) {
    if (!this.errors || !this.errors.has(code)) {
      code = this.DEFAULT_CODE
      let message = arguments[1] || this.DEFAULT_MESSAGE
      if (arguments.length === 1) {
        message = arguments[0] || this.DEFAULT_MESSAGE
      }
      return new CustomError(code, message)
    }

    const values = Array.prototype.slice.call(arguments, 1)
    const message = this.errors.get(code).replace(/{(\d)}/g, (match, index) => values[index] || '').replace(/(\s\s+)/g, ' ')

    return new CustomError(code, message)
  }
}

module.exports = ErrorFactory
