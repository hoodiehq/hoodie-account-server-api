var simple = require('simple-mock')
var test = require('tap').test

var findAllAccount = require('../../../lib/accounts/find-all')

test('findAllAccount', function (group) {
  group.test('with `options` in arguments', function (t) {
    t.plan(1)

    var state = {
      db: {
        allDocs: simple.stub().resolveWith({
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
    findAllAccount(state, {include: 'profile'})

    .then(function (accounts) {
      t.deepEqual(accounts[0], {
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
      db: {
        allDocs: simple.stub().resolveWith({
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
    findAllAccount(state)

    .then(function (accounts) {
      t.deepEqual(accounts[0], {
        id: 'user123',
        username: 'foo',
        roles: []
      })
    })

    .catch(t.catch)
  })

  group.end()
})
