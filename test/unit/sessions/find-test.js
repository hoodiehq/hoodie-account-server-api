var simple = require('simple-mock')
var test = require('tap').test

var findSession = require('../../../lib/sessions/find')

test('findSession', function (group) {
  group.test('user not found', function (t) {
    findSession({
      setupPromise: Promise.resolve(),
      cache: {
        get: simple.stub().rejectWith(new Error('oops'))
      }
    }, 'sessionid')

    .then(function () {
      t.fail('should not resolve')
    })

    .catch(function (error) {
      t.is(error.message, 'oops')
      t.end()
    })
  })

  group.test('user found but session invalid', function (t) {
    findSession({
      setupPromise: Promise.resolve(),
      secret: 'secret',
      cache: {
        get: simple.stub().resolveWith({
          salt: 'salt123'
        })
      }
    }, 'sessionid')

    .then(function () {
      t.fail('should not resolve')
    })

    .catch(function (error) {
      t.is(error.message, 'Session invalid')
      t.end()
    })
  })

  group.test('user found and session valid', function (t) {
    simple.mock(findSession.internals, 'isValidSessionId').returnWith(true)
    findSession({
      setupPromise: Promise.resolve(),
      secret: 'secret',
      cache: {
        get: simple.stub().resolveWith({
          roles: ['id:user123'],
          salt: 'salt123'
        })
      }
    }, 'sessionid')

    .then(function (session) {
      t.is(session.id, 'sessionid')
      t.end()
    })

    .catch(t.error)
  })

  group.end()
})
