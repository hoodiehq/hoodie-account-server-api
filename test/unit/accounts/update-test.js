var simple = require('simple-mock')
var test = require('tap').test

var updateAccount = require('../../../lib/accounts/update')

test('updateAccount', function (group) {
  group.test('with update function', function (t) {
    t.plan(1)

    var state = {
      db: {
        get: simple.stub().resolveWith({
          _id: 'org.couchdb.user:foo',
          _rev: '1-234',
          name: 'foo',
          roles: ['id:user123'],
          profile: {
            name: 'bar'
          }
        }),
        put: simple.stub().resolveWith({})
      }
    }
    updateAccount(state, {
      username: 'foo'
    }, function (account) {
      account.profile = {}
      return account
    })

    .then(function () {
      var doc = state.db.put.lastCall.arg
      t.deepEqual(doc.profile, {})
    })

    .catch(t.error)
  })

  group.test('with username change via update function', function (t) {
    t.plan(4)

    var state = {
      db: {
        get: simple.stub().resolveWith({
          _id: 'org.couchdb.user:foo',
          _rev: '1-234',
          name: 'foo',
          roles: ['id:user123'],
          profile: {
            name: 'bar'
          }
        }),
        put: simple.stub().resolveWith({})
      }
    }
    updateAccount(state, {
      username: 'foo'
    }, function (account) {
      account.username = 'newfoo'
      account.profile = {}

      return account
    })

    .then(function () {
      t.is(state.db.put.callCount, 2)
      var newDoc = state.db.put.calls[0].arg
      var removedDoc = state.db.put.calls[1].arg
      t.deepEqual(newDoc.profile, {})
      t.is(newDoc.name, 'newfoo')
      t.is(removedDoc._deleted, true)
    })

    .catch(t.error)
  })

  group.end()
})
