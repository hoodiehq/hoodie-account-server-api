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

  group.end()
})
