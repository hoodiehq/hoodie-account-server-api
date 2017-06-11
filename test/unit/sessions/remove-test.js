var simple = require('simple-mock')
var test = require('tap').test

var removeSession = require('../../../lib/sessions/remove')
var internals = removeSession.internals

test('removeSession', function (group) {
  group.afterEach(function (done) {
    simple.restore()
    done()
  })

  group.test('session not found', function (t) {
    t.plan(1)

    simple.mock(internals, 'findSession').rejectWith(new Error('Opps'))
    removeSession({setupPromise: Promise.resolve()}, 'sessionid')

    .then(function () {
      t.fail('removeSession should reject')
    })

    .catch(function (error) {
      t.is(error.message, 'Opps')
    })
  })

  group.test('session found', function (t) {
    t.plan(2)

    simple.mock(internals, 'findSession').resolveWith({
      id: 'sessionid',
      account: {
        username: 'foo'
      }
    })

    removeSession({setupPromise: Promise.resolve()}, 'sessionid')

    .then(function (session) {
      t.is(session.id, 'sessionid')
      t.is(session.account.username, 'foo')
    })

    .catch(t.error)
  })

  group.test('session found', function (t) {
    t.plan(3)

    simple.mock(internals, 'findSession').resolveWith({
      id: 'sessionid',
      account: {
        username: 'foo',
        profile: {
          name: 'Foo Bar'
        }
      }
    })

    removeSession({setupPromise: Promise.resolve()}, 'sessionid', {include: 'account.profile'})

    .then(function (session) {
      t.is(session.id, 'sessionid')
      t.is(session.account.username, 'foo')
      t.is(session.account.profile.name, 'Foo Bar')
    })

    .catch(t.error)
  })

  group.end()
})
