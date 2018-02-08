var simple = require('simple-mock')
var test = require('tap').test

var addAccount = require('../../../lib/accounts/add')

test('addAccount', function (group) {
  group.test('with empty username', function (t) {
    t.plan(3)

    var state = {
      cache: {
        set: function () {
          throw new Error('should not call cache.set')
        }
      }
    }
    addAccount(state, {
      username: ''
    })

    .then(function () {
      t.fail('addAccount should reject')
    })

    .catch(function (error) {
      t.is(error.name, 'Bad Request')
      t.is(error.status, 400)
      t.is(error.message, 'username must be set')
    })
  })

  group.test('with profile', function (t) {
    t.plan(1)

    var state = {
      cache: {
        set: simple.stub().resolveWith({})
      },
      setupPromise: Promise.resolve()
    }

    addAccount(state, {
      username: 'foo',
      profile: {
        name: 'bar'
      }
    })

    .then(function () {
      var doc = state.cache.set.lastCall.arg
      t.deepEqual(doc.profile, {name: 'bar'})
    })

    .catch(t.catch)
  })

  group.test('with profile and options', function (t) {
    // test passing in a profile with options for branch coverage
    t.plan(1)

    var state = {
      cache: {
        set: simple.stub().resolveWith({})
      },
      setupPromise: Promise.resolve()
    }
    var options = {}

    addAccount(state, {
      username: 'foo',
      profile: {
        name: 'bar'
      }
    }, options)

    .then(function () {
      var doc = state.cache.set.lastCall.arg
      t.deepEqual(doc.profile, {name: 'bar'})
    })

    .catch(t.catch)
  })

  group.test('sets default createdAt', function (t) {
    t.plan(1)

    var state = {
      cache: {
        set: simple.stub().resolveWith({})
      },
      setupPromise: Promise.resolve()
    }

    addAccount(state, {
      username: 'foo'
    })

    .then(function () {
      var doc = state.cache.set.lastCall.arg
      t.notEqual(doc.createdAt, undefined)
    })

    .catch(t.catch)
  })

  group.test('with existing username', function (t) {
    t.plan(3)

    var state = {
      cache: {
        set: simple.stub().rejectWith({ status: 409 })
      },
      setupPromise: Promise.resolve()
    }

    addAccount(state, {
      username: 'foo',
      profile: {
        name: 'bar'
      }
    })

    .then(function () {
      t.fail('addAccount should reject')
    })

    .catch(function (error) {
      t.is(error.name, 'Conflict')
      t.is(error.status, 409)
      t.is(error.message, 'An account with that username already exists')
    })
  })

  group.test('with username containing uppercase letters', function (t) {
    t.plan(1)

    var state = {
      cache: {
        set: simple.stub().resolveWith({})
      },
      setupPromise: Promise.resolve()
    }

    addAccount(state, {
      username: 'userWithCAPS'
    })

    .then(function () {
      var doc = state.cache.set.lastCall.arg
      t.deepEqual(doc.name, 'userwithcaps')
    })

    .catch(t.catch)
  })

  group.test('with other error', function (t) {
    t.plan(3)

    var expectedError = {
      name: 'Custom error',
      status: 999,
      message: 'Testing a non-409 error is re-thrown'
    }
    var state = {
      cache: {
        set: simple.stub().rejectWith(expectedError)
      },
      setupPromise: Promise.resolve()
    }

    addAccount(state, {
      username: 'foo',
      profile: {
        name: 'bar'
      }
    })

    .then(function () {
      t.fail('addAccount should reject')
    })

    .catch(function (error) {
      t.is(error.name, 'Custom error')
      t.is(error.status, 999)
      t.is(error.message, 'Testing a non-409 error is re-thrown')
    })
  })

  group.end()
})
