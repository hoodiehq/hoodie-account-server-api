var simple = require('simple-mock')
var test = require('tap').test

var Cache = require('../../../lib/utils/cache')

test('cache', function (group) {
  group.test('caches user doc', function (t) {
    var db = {
      get: simple.stub().resolveWith('doc'),
      changes: simple.stub().returnWith({
        on: simple.stub()
      })
    }
    var cache = Cache(db)

    cache.get('123')

    .then(function () {
      return cache.get('123')
    })

    .then(function () {
      t.is(db.get.callCount, 1)
      t.end()
    })

    .catch(t.error)
  })

  group.end()
})
