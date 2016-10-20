var simple = require('simple-mock')
var test = require('tap').test

var removeSession = require('../../../lib/sessions/remove')
var internals = removeSession.internals

test('removeSession', function (group) {
  group.test('session not found', function (t) {
    t.plan(1)

    simple.mock(internals, 'findSession').rejectWith(new Error('Opps'))
    removeSession({}, 'sessionid')

    .then(function () {
      t.fail('removeSession should reject')
    })

    .catch(function (error) {
      t.is(error.message, 'Opps')
    })

    simple.restore()
  })

  // prepared for https://github.com/hoodiehq/camp/issues/58
  group.test('session found', {skip: false}, function (t) {
    t.plan(2)

    simple.mock(internals, 'findSession').resolveWith({
      id: 'sessionid',
      account: {
        username: 'foo'
      }
    })
    removeSession({}, 'sessionid')

    .then(function (session) {
      t.is(session.id, 'sessionid')
      t.is(session.account.username, 'foo')
    })

    .catch(t.error)

    simple.restore()
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
    removeSession({}, 'sessionid', {include: 'account.profile'})

    .then(function (session) {
      t.is(session.id, 'sessionid')
      t.is(session.account.username, 'foo')
      t.is(session.account.profile.name, 'Foo Bar')
    })

    .catch(t.error)

    simple.restore()
  })

  group.end()
})
