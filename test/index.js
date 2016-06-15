'use strict'

const test = require('ava')
const ErrorFactory = require('../index.js')
const CustomError = require('../lib/custom-error.js')

test('default error code should be returned when #use is not called', (t) => {
  const errorFactory = new ErrorFactory()

  const err = errorFactory.create(100, 'blah')
  t.is(err.code, 0)
  t.is(err.message, 'blah')
})

test('it should return a custom error message', (t) => {
  let makeError = ErrorFactory.use({
    100: 'test ${0}'
  })
  const expectedText = 'a custom error message'
  let result = makeError(expectedText)
  t.is(result.message, expectedText)
  t.true(result instanceof CustomError)
  t.true(result instanceof Error)
})

test('it should replace the placeholder value', (t) => {
  let makeError = ErrorFactory.use({
    100: 'test {0}'
  })
  const expectedText = 'a custom error message'
  let result = makeError(100, expectedText)
  t.is(result.message, 'test ' + expectedText)
  t.true(result instanceof CustomError)
  t.true(result instanceof Error)
})

test('it should replace multiple placeholders', (t) => {
  let makeError = ErrorFactory.use({
    100: 'hi {0}, here is your custom message: {1}'
  })
  const expectedText = 'hi simon, here is your custom message: you rock!'
  let result = makeError(100, 'simon', 'you rock!')
  t.is(result.message, expectedText)
  t.is(result.code, 100)
  t.true(result instanceof CustomError)
  t.true(result instanceof Error)
})

test('it should replace multiple placeholders, and handle empty placeholders', (t) => {
  let makeError = ErrorFactory.use({
    100: 'hi {0}, here is your {1} message: {2}'
  })
  const expectedText = 'hi simon, here is your message: you rock!'
  let result = makeError(100, 'simon', null, 'you rock!')
  t.is(result.message, expectedText)
  t.is(result.code, 100)
  t.true(result instanceof CustomError)
  t.true(result instanceof Error)
})

test('template strings should work', (t) => {
  let makeError = ErrorFactory.use({
    100: 'hi {0}'
  })
  const expectedText = 'hi simon'
  const name = 'simon'
  let result = makeError(100, `${name}`)
  t.is(result.message, expectedText)
  t.is(result.code, 100)
  t.true(result instanceof CustomError)
  t.true(result instanceof Error)
})

test('code with no values should work', (t) => {
  let makeError = ErrorFactory.use({
    100: 'hi {0}'
  })
  const expectedText = 'hi '
  let result = makeError(100)
  t.is(result.message, expectedText)
  t.is(result.code, 100)
  t.true(result instanceof CustomError)
  t.true(result instanceof Error)
})

test('constructor usage should be the same as #use', (t) => {
  const errorFactory = new ErrorFactory({
    100: 'hi {0}'
  })

  const expectedText = 'hi simon'
  const result = errorFactory.create(100, 'simon')
  t.is(result.message, expectedText)
  t.is(result.code, 100)
  t.true(result instanceof CustomError)
  t.true(result instanceof Error)
})

test('throwing the custom error works as expected', (t) => {
  const expectedText = 'hi simon'
  const result = ErrorFactory.use({
    100: 'hi {0}'
  })(100, 'simon')

  t.is(result.message, expectedText)
  t.is(result.code, 100)
  t.true(result instanceof CustomError)
  t.true(result instanceof Error)
  t.throws(() => { throw result })
})

test('throwing the custom error works as expected #2', (t) => {
  const makeError = ErrorFactory.use({
    100: 'hi {0}'
  })

  t.throws(() => { throw makeError(100, 'simon') })
})

test('#use with params should create a new instance', (t) => {
  const expectedText = 'goodbye simon'
  const makeError = ErrorFactory.use({
    100: 'goodbye {0}'
  })
  const result = makeError(100, 'simon')

  t.is(result.message, expectedText)
  t.is(result.code, 100)
  t.true(result instanceof CustomError)
  t.true(result instanceof Error)
  t.throws(() => { throw result })

  const otherError = ErrorFactory.use({
    100: 'hi {0}'
  })(100, 'simon')

  t.not(result.message, otherError.message)
})
