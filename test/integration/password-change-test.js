var PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-adapter-memory'))
var test = require('tap').test

var getApi = require('../../')

test('walkthrough', function (t) {
  t.plan(3)

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

    return api.accounts.update('user123', {
      password: 'newsecret'
    })
  })

  .then(function (account) {
    t.pass('changes password')

    return api.sessions.add({
      account: {
        username: 'foo',
        password: 'newsecret'
      }
    })
  })

  .then(function () {
    t.pass('new password works for authentication')
  })

  .catch(t.error)
})
