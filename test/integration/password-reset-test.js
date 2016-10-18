var PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-adapter-memory'))
var test = require('tap').test

var getApi = require('../../')

test('password reset', function (t) {
  var tokenId
  var api = getApi({
    PouchDB: PouchDB,
    secret: 'secret'
  })

  api.accounts.add({
    id: 'user123',
    username: 'foo',
    password: 'foosecret'
  })

  .then(function (account) {
    t.is(account.username, 'foo', 'creates account')

    return api.account({id: 'user123'}).tokens.add({
      type: 'passwordreset'
    })
  })

  .then(function (token) {
    tokenId = token.id
    t.ok(token.id, 'token created')

    return api.sessions.add({
      account: {
        token: token.id
      }
    })
  })

  .then(function (session) {
    t.ok(session.account.id, 'session created')

    return api.sessions.add({
      account: {
        token: tokenId
      }
    })

    .then(function () {
      t.fail('token can only be used once')
      t.end()
    })

    .catch(function (error) {
      t.is(error.status, 404, 'token can only be used once')
      t.end()
    })
  })

  .catch(t.error)
})
