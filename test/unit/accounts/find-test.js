var simple = require('simple-mock')
var test = require('tap').test

var findAccount = require('../../../lib/accounts/find')

test('findAccount', function (group) {
  group.test('with `options` in arguments', function (t) {
    t.plan(1)

    var state = {
      setupPromise: Promise.resolve(),
      db: {
        query: simple.stub().resolveWith({
          rows: [
            {
              doc: {
                _id: 'org.couchdb.user:foo',
                _rev: '1-234',
                name: 'foo',
                roles: ['id:user123'],
                profile: {
                  name: 'bar'
                }
              }
            }
          ]
        })
      }
    }
    findAccount(state, 'user123', {include: 'profile'})

    .then(function (accounts) {
      t.deepEqual(accounts, {
        id: 'user123',
        username: 'foo',
        roles: [],
        profile: {
          name: 'bar'
        }
      })
    })

    .catch(t.catch)
  })

  group.test('without `options` in arguments', function (t) {
    t.plan(1)

    var state = {
      setupPromise: Promise.resolve(),
      db: {
        query: simple.stub().resolveWith({
          rows: [
            {
              doc: {
                _id: 'org.couchdb.user:foo',
                _rev: '1-234',
                name: 'foo',
                roles: ['id:user123'],
                profile: {
                  name: 'bar'
                }
              }
            }
          ]
        })
      }
    }
    findAccount(state, 'user123')

    .then(function (accounts) {
      t.deepEqual(accounts, {
        id: 'user123',
        username: 'foo',
        roles: []
      })
    })

    .catch(t.catch)
  })

  group.end()
})
