var PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-adapter-memory'))
var test = require('tap').test

var getApi = require('../../')

test('token rejection', function (t) {
  var api = getApi({
    PouchDB: PouchDB,
    secret: 'secret'
  })

  api.accounts.add({
    id: 'user123',
    username: 'foo',
    password: 'secret'
  })

  .then(function (account) {
    t.is(account.username, 'foo', 'creates account')

    return api.account({id: 'user123'}).tokens.add({
      id: 'secrettoken',
      type: 'passwordreset',
      timeout: 0
    })
  })

  .then(function (token) {
    t.is(token.createdAt, token.expiresAt, 'token created with createdAt and expiresAt same')

    return api.sessions.add({
      account: {
        token: 'secrettoken'
      }
    })
  })

  .then(function () {
    t.fail('sessions.add() should reject expired token')
  })

  .catch(function (error) {
    t.is(error.name, 'Not Found')
    t.is(error.status, 404)
    t.is(error.message, 'Token expired')
    t.end()
  })
})
