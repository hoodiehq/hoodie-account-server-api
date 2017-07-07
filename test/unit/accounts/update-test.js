var simple = require('simple-mock')
var test = require('tap').test

var updateAccount = require('../../../lib/accounts/update')

test('updateAccount', function (group) {
  group.test('with update function', function (t) {
    t.plan(1)

    var state = {
      setupPromise: Promise.resolve(),
      cache: {
        get: simple.stub().resolveWith({
          _id: 'org.couchdb.user:foo',
          _rev: '1-234',
          name: 'foo',
          roles: ['id:user123'],
          profile: {
            name: 'bar'
          }
        }),
        set: simple.stub().resolveWith({})
      }
    }
    updateAccount(state, {
      username: 'foo'
    }, function (account) {
      account.profile = {}
      return account
    })

    .then(function () {
      var doc = state.cache.set.lastCall.arg
      t.deepEqual(doc.profile, {})
    })

    .catch(t.error)
  })

  group.test('update function with options', function (t) {
    t.plan(1)

    var state = {
      setupPromise: Promise.resolve(),
      cache: {
        get: simple.stub().resolveWith({
          _id: 'org.couchdb.user:foo',
          _rev: '1-234',
          name: 'foo',
          roles: ['id:user123'],
          profile: {
            name: 'bar'
          }
        }),
        set: simple.stub().resolveWith({})
      }
    }
    var options = { include: 'profile' }

    updateAccount(state, {
      username: 'foo'
    }, function (account) {
      account.profile.name = 'baz'
      return account
    }, options)

    .then(function (doc) {
      t.deepEqual(doc.profile, { name: 'baz' })
    })

    .catch(t.catch)
  })

  group.test('with username change via update function', function (t) {
    t.plan(4)

    var state = {
      setupPromise: Promise.resolve(),
      cache: {
        get: simple.stub().resolveWith({
          _id: 'org.couchdb.user:foo',
          _rev: '1-234',
          name: 'foo',
          roles: ['id:user123'],
          profile: {
            name: 'bar'
          }
        }),
        set: simple.stub().resolveWith({})
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
      t.is(state.cache.set.callCount, 2)
      var newDoc = state.cache.set.calls[0].arg
      var removedDoc = state.cache.set.calls[1].arg
      t.deepEqual(newDoc.profile, {})
      t.is(newDoc.name, 'newfoo')
      t.is(removedDoc._deleted, true)
    })

    .catch(t.error)
  })

  group.end()
})
