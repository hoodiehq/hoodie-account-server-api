var simple = require('simple-mock')
var test = require('tap').test

var addAccount = require('../../../lib/accounts/add')

test('addAccount', function (group) {
  group.test('with empty username', function (t) {
    t.plan(3)

    var state = {
      db: {
        put: function () {
          throw new Error('should not call db.put')
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
      db: {
        put: simple.stub().resolveWith({})
      }
    }
    addAccount(state, {
      username: 'foo',
      profile: {
        name: 'bar'
      }
    })

    .then(function () {
      var doc = state.db.put.lastCall.arg
      t.deepEqual(doc.profile, {name: 'bar'})
    })

    .catch(t.catch)
  })

  group.end()
})
