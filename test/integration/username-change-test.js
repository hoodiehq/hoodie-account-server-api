var PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-adapter-memory'))
var simple = require('simple-mock')
var test = require('tap').test

var getApi = require('../../')

test('walkthrough', function (t) {
  t.plan(7)

  var addHandler = simple.stub()
  var removeHandler = simple.stub()
  var updateHandler = simple.stub()

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

    api.accounts.on('add', addHandler)
    api.accounts.on('remove', removeHandler)
    api.accounts.on('update', updateHandler)

    return api.accounts.update('user123', {
      username: 'newfoo'
    })
  })

  .then(function (account) {
    t.is(account.username, 'newfoo', 'renames username')

    return new Promise(function (resolve) {
      setTimeout(resolve, 10)
    })
  })

  .then(function () {
    t.is(addHandler.callCount, 0, 'does not emit "add" event for username change')
    t.is(removeHandler.callCount, 0, 'does not emit "remove" event for username change')
    t.is(updateHandler.callCount, 1, 'emits "update" event for username change')

    removeHandler.reset()
    updateHandler.reset()

    return api.accounts.remove('user123')
  })

  .then(function () {
    return new Promise(function (resolve) {
      setTimeout(resolve, 10)
    })
  })

  .then(function () {
    t.is(removeHandler.callCount, 1, 'emits "remove" event for remove')
    t.is(updateHandler.callCount, 0, 'does not emit "update" event for remove')
  })

  .catch(t.error)
})
