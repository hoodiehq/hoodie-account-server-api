var test = require('tap').test

var account = require('../../../lib/account')

test('add', function (group) {
  group.test('with invalid symbols', function (t) {
    t.plan(3)

    account().tokens.add({
      id: 'secrettoken',
      type: 'abc$123'
    })

    .then(function () {
      t.fail('tokens.add should reject')
    })

    .catch(function (error) {
      t.is(error.name, 'Bad Request')
      t.is(error.status, 400)
      t.is(error.message, 'Token type must consist of lowercase letters (a-z), digits (0-9), _ and - only. Must begin with a letter')
    })
  })

  group.test('when type is not set at all', function (t) {
    t.plan(3)

    account().tokens.add({
      id: 'secrettoken'
    })

    .then(function () {
      t.fail('tokens.add should reject')
    })

    .catch(function (error) {
      t.is(error.name, 'Bad Request')
      t.is(error.status, 400)
      t.is(error.message, 'Token type must consist of lowercase letters (a-z), digits (0-9), _ and - only. Must begin with a letter')
    })
  })

  group.end()
})
