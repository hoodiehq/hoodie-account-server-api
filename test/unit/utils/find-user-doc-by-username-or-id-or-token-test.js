var simple = require('simple-mock')
var test = require('tap').test

var PouchDBErrors = require('pouchdb-errors')

var findUserDocByUsernameOrIdOrToken =
    require('../../../lib/utils/find-user-doc-by-username-or-id-or-token')

test('findUserDocByUsernameOrIdOrToken', function (group) {
  group.test('PouchDB missing doc', function (t) {
    t.plan(1)

    var cache = simple.stub()
    var response = {
      rows: []
    }
    var db = {
      query: simple.stub().resolveWith(response)
    }

    findUserDocByUsernameOrIdOrToken(db, cache, 'id1234')

    .then(function () {
      t.fail('should reject with pounch DB MISSING_DOC error')
    })

    .catch(function (error) {
      t.is(error, PouchDBErrors.MISSING_DOC)
    })
  })

  group.end()
})
