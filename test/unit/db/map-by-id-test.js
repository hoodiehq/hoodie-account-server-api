var simple = require('simple-mock')
var test = require('tap').test

var mapById = require('../../../lib/db/map-by-id')

test('db:mapById', function (t) {
  var emits
  simple.mock(global, 'emit').callFn(function (key) {
    emits.push(key)
  })

  emits = []
  mapById({
    roles: []
  })
  t.deepEqual(emits, [])

  mapById({
    roles: ['id:abc4567', '_admin']
  })
  t.deepEqual(emits, [])

  mapById({
    roles: ['id:abc4567']
  })
  t.deepEqual(emits, ['abc4567'])

  emits = []
  mapById({
    roles: ['foo', 'id:abc4567', 'bar']
  })
  t.deepEqual(emits, ['abc4567'])

  emits = []
  mapById({
    roles: ['foo', 'id:123e4567-e89b-12d3-a456-426655440000', 'bar']
  })
  t.deepEqual(emits, ['123e4567-e89b-12d3-a456-426655440000'])

  simple.restore()
  t.end()
})
