var test = require('tap').test

var accountToDocProperties = require('../../../lib/utils/account-to-doc-properties')

test('docToAccount', function (t) {
  t.deepEqual(accountToDocProperties({
    id: 'ekmn30j',
    username: 'test',
    roles: ['myrole'],
    foo: 'bar'
  }), {
    _id: 'org.couchdb.user:test',
    roles: ['id:ekmn30j', 'myrole'],
    foo: 'bar'
  }, 'returns custom property on account')

  t.end()
})
