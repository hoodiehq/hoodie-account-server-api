var simple = require('simple-mock')
var test = require('tap').test
var PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-adapter-memory'))

var getApi = require('../../')

test('cache', function (t) {
  var api = getApi({
    PouchDB: PouchDB,
    secret: 'secret'
  })

  simple.mock(PouchDB.prototype, 'get').callOriginal()

  api.accounts.add({
    id: 'user123',
    username: 'foo',
    password: 'foosecret',
    createdAt: '1970-01-01T00:00:00.000Z',
    signedUpAt: '1970-01-01T11:11:11.111Z'
  })

  .then(function (account) {
    t.is(account.username, 'foo', 'creates account')

    return api.sessions.add({
      account: {
        username: account.username
      }
    })
  })

  .then(function (session) {
    return api.sessions.find(session.id)
  })

  .then(function (session) {
    t.is(PouchDB.prototype.get.callCount, 0, 'caches account after put')
    t.ok(session.id, 'creates session')
    simple.restore()
    t.end()
  })

  .catch(t.error)
})
