var simple = require('simple-mock')
var test = require('tap').test

var docToAccount = require('../../../lib/utils/doc-to-account')

var doc = {
  _id: 'org.couchdb.user:test',
  _rev: '1-eba81bfea3cb604b9dcafa9fb853cf45',
  type: 'user',
  name: 'test',
  roles: [
    'id:ekmn30j', 'myrole'
  ],
  iterations: 10,
  password_scheme: 'pbkdf2',
  salt: '11a1dd1e517f1c21001671a01981561f918016e1b911614f',
  derived_key: 'eb71cf0befb5491a910122c30eb28dbefb4d5e48',
  foo: 'bar',
  profile: {
    profileFoo: 'bar'
  },
  tokens: {
    secretToken: {
      type: 'verification',
      tokenFoo: 'bar'
    }
  }
}

test('docToAccount', function (group) {
  group.test('test custom property', function (t) {
    t.plan(1)

    t.deepEqual(docToAccount(doc), {
      id: 'ekmn30j',
      username: 'test',
      roles: ['myrole'],
      foo: 'bar'
    }, 'returns custom property on account')
  })

  group.test('include profile', function (t) {
    t.plan(1)

    t.deepEqual(docToAccount(doc, {includeProfile: true}), {
      id: 'ekmn30j',
      username: 'test',
      roles: ['myrole'],
      foo: 'bar',
      profile: {
        profileFoo: 'bar'
      }
    }, 'returns profile if options.includeProfile passed')
  })

  group.test('no account ID', function (t) {
    t.plan(1)

    simple.mock(docToAccount.internals, 'findIdInRoles').returnWith(undefined)

    t.throws(
      function () { docToAccount(doc) },
      docToAccount.internals.errors.FORBIDDEN_ID_ROLE_MISSING
    )
  })

  group.end()
})
