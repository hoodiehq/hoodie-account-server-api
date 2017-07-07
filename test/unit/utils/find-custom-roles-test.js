var test = require('tap').test

var findCustomRoles = require('../../../lib/utils/find-custom-roles')

test('findCustomRoles', function (group) {
  group.test('_admin', function (t) {
    var role = '_admin'

    t.is(findCustomRoles.internals.isntInteralRole(role), false)

    t.end()
  })

  group.test('starts with id:', function (t) {
    var role = 'id:1234'

    t.is(findCustomRoles.internals.isntInteralRole(role), false)

    t.end()
  })

  group.test('is not internal role', function (t) {
    var role = 'id1234'

    t.is(findCustomRoles.internals.isntInteralRole(role), true)

    t.end()
  })

  group.end()
})
