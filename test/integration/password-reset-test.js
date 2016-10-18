var PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-adapter-memory'))
var test = require('tap').test

var getApi = require('../../')

test('password reset', function (t) {
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
      id: 'secrettoken',
      type: 'passwordreset'
    })
  })

  .then(function (token) {
    t.is(token.id, 'secrettoken', 'token created')

    return api.accounts.find({
      token: 'secrettoken'
    })
  })

  .then(function (account) {
    t.is(account.username, 'foo', 'finds account by token')

    return api.accounts.update({
      token: 'secrettoken'
    }, {
      password: 'newsecret'
    })
  })

  .then(function (account) {
    t.pass('password updated')

    return api.accounts.update({
      token: 'secrettoken'
    }, {
      password: 'yetnewsecret'
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
