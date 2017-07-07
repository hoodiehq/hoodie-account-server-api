var test = require('tap').test

var errors = require('../../../lib/utils/errors')

test('errors', function (group) {
  group.test('options with name', function (t) {
    t.plan(3)

    var options = {
      name: 'With Message',
      message: 'Error with name',
      status: '401'
    }
    var hoodieError = errors.internals.hoodieError(options)

    t.is(hoodieError.name, options.name)
    t.is(hoodieError.message, options.message)
    t.is(hoodieError.status, options.status)
  })

  group.test('options without name', function (t) {
    t.plan(3)

    var options = {
      message: 'Error without name',
      status: '401'
    }
    var hoodieError = errors.internals.hoodieError(options)

    t.is(hoodieError.name, 'Error')
    t.is(hoodieError.message, options.message)
    t.is(hoodieError.status, options.status)
  })

  group.end()
})
