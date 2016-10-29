var PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-adapter-memory'))
var test = require('tap').test

var getApi = require('../../')

test('email verification', function (t) {
  var api = getApi({
    PouchDB: PouchDB,
    secret: 'secret'
  })

  api.accounts.add({
    id: 'user123',
    username: 'foo@example.com',
    password: 'foosecret'
  })

  .then(function (account) {
    t.is(account.username, 'foo@example.com', 'creates account')

    return api.account({id: 'user123'}).tokens.add({
      type: 'emailverification',
      new: 'otherfoo@example.com'
    })
  })

  .then(function (token) {
    return api.account({id: 'user123'}).tokens.find(token.id)
  })

  .then(function (token) {
    return api.accounts.update({
      token: token.id
    }, {
      password: 'newsecret',
      username: token.email
    })
  })

  .then(function (account) {
    t.pass('username updated')
    t.end()
  })

  .catch(t.error)
})
