# Custom Errors [![npm](https://img.shields.io/npm/v/@blinkmobile/custom-errors.svg?maxAge=2592000)](https://www.npmjs.com/package/@blinkmobile/custom-errors)

Configuration driven error messages for nodejs.

## Install

```
npm i @blinkmobile/custom-errors
```

## Usage

via the static `#use` method:
```javascript
const ErrorFactory = require('@blinkmobile/custom-errors');
const errorMap = {
  100: 'Error saving data: {0}',
  200: 'File already exists'
};

const fileErrors = ErrorFactory.use(errorMap);

throw fileErrors(100, 'No filename specified')

// Error: Error saving data: No filename specified
```

or shorter:

```javascript
const fileErrors = require('@blinkmobile/custom-errors').use({
  100: 'Error saving data: {0}',
  200: 'File already exists'
});

throw fileErrors(100, 'No filename specified')

// Error: Error saving data: No filename specified
```

or via the constructor and the `create` method:

```javascript
const ErrorFactory = require('@blinkmobile/custom-errors');
const errorMap = {
  1000: 'Invalid Username: {0}',
  2000: 'Invalid Password'
};

const factory = new ErrorFactory(errorMap);
throw factory.create(2000)

// Error: Invalid Password
```

## Error messages and Placeholders

An error message has a unique number as its key, and it can have placeholders for customising the error. Placeholders are defined as a number inside curly braces, eg `{0}` or `{1}`

Placeholders are replaced with the tail of the arguments supplied to the `#create` function. You may leave out a placeholder by specifying `null` or `undefined`. Because of this, any consecutive spaces will be replaced with a single space.

```javascript
const ErrorFactory = require('@blinkmobile/custom-errors');
const errorMap = {
  100: 'Error saving data: {0} {1} {2}',
  200: 'File already exists'
};

const fileErrors = ErrorFactory.use(errorMap);

throw fileErrors(100, 'No filename specified')
// Error: Error saving data: No filename specified

const email = support@mycompany.com;
throw fileErrors(100, 'Disk Full', null, `contact ${email}` );
// Error: Error saving data: Disk Full contact support@mycompany.com
```
