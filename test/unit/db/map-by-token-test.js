var simple = require('simple-mock')
var test = require('tap').test

var mapByToken = require('../../../lib/db/map-by-token')

test('db:mapByToken', function (t) {
  var emits
  simple.mock(global, 'emit').callFn(function (key, value) {
    emits.push({
      key: key,
      value: value
    })
  })

  emits = []
  mapByToken({})
  t.deepEqual(emits, [])

  emits = []
  mapByToken({
    tokens: {
      token123: {
        foo: 'bar'
      }
    }
  })
  t.deepEqual(emits, [{
    key: 'token123',
    value: {
      foo: 'bar'
    }
  }])

  simple.restore()
  t.end()
})
