var simple = require('simple-mock')
var t = require('tap').test

var addSession = require('../../../lib/sessions/add')

t('addSession', function (group) {
  var doc, state, options

  group.beforeEach(function (done) {
    simple.mock(addSession.internals, 'setup').resolveWith(simple.stub())

    doc = {
      _id: 'org.couchdb.user:foo',
      type: 'user',
      name: 'foo',
      createdAt: '1970-01-01T00:00:00.000Z',
      signedUpAt: '1970-01-01T11:11:11.111Z',
      roles: [ 'id:user123' ],
      iterations: 10,
      password_scheme: 'pbkdf2',
      salt: '1751e814e1da1811f21021aa11010d1fc19a14a1e81b5152',
      derived_key: '2417f36cb159e46028dbe42a3aa1428b370e4712',
      _rev: '1-c85dfa1c2a41cf5099b5db73295b358b'
    }

    state = {
      cache: {
        get: simple.stub().resolveWith(doc)
      },
      secret: 'supersecret'
    }

    options = {
      account: {
        username: 'foo'
      },
      include: 'account.profile'
    }

    simple.mock(addSession.internals, 'calculateSessionId')
    simple.mock(addSession.internals, 'toAccount')

    done()
  })

  group.test('validatePassword callback error', function (t) {
    t.plan(1)

    options.account.password = 'supersecret'

    var validateError = new Error('invalid password')
    simple.mock(addSession.internals, 'validatePassword').callFn(function (a, b, c, d, callback) {
      callback(validateError)
    })

    addSession(state, options)

    .then(function () {
      t.fail('password validation should reject')
    })

    .catch(function (error) {
      t.is(error, validateError)
    })
  })

  group.test('validatePassword unauthorized password', function (t) {
    t.plan(1)

    options.account.password = 'supersecret'

    simple.mock(addSession.internals, 'validatePassword').callFn(function (a, b, c, d, callback) {
      callback(null, false)
    })

    addSession(state, options)

    .then(function () {
      t.fail('password validation should reject')
    })

    .catch(function (error) {
      t.is(error, addSession.internals.errors.UNAUTHORIZED_PASSWORD)
    })
  })

  group.test('username with auth', function (t) {
    t.plan(2)

    var account = {
      id: 'user1234',
      username: 'foo',
      roles: ['admin'],
      profile: {
        name: 'bar'
      }
    }
    simple.mock(addSession.internals, 'toAccount').returnWith(account)
    simple.mock(addSession.internals, 'calculateSessionId').returnWith('session1234')
    addSession(state, options)

    .then(function (session) {
      t.is(state.cache.get.lastCall.arg, 'org.couchdb.user:foo')
      t.deepEqual(session, {
        id: 'session1234',
        account: account
      })
    })

    .catch(t.catch)
  })

  group.test('with session timeout', function (t) {
    t.plan(1)

    simple.mock(Date, 'now').returnWith(1499580562637)
    options.timeout = 1234

    var expectedTimeout = Math.floor(1499580562637 / 1000) + options.timeout

    addSession(state, options)

    .then(function (session) {
      t.is(addSession.internals.calculateSessionId.lastCall.args[3], expectedTimeout)
    })

    .catch(t.catch)
  })

  group.test('with account token', function (t) {
    t.plan(2)

    options.account.token = 'abcd1234'
    doc.tokens = {abcd1234: {}, efgh5678: {}}
    state.cache.set = simple.stub()

    addSession(state, options)

    .then(function (session) {
      t.deepEqual(doc.tokens, {efgh5678: {}}, 'token abcd1234 should be deleted')
      t.is(state.cache.set.lastCall.arg, doc, 'cache set is called with doc')
    })

    .catch(t.catch)
  })

  group.end()
})
