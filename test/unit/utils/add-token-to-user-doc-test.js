var simple = require('simple-mock')
var test = require('tap').test

var addTokenToUserDoc = require('../../../lib/utils/add-token-to-user-doc')

test('addTokenToUserDoc', function (group) {
  group.test('tokens item in userDoc object', function (t) {
    t.plan(1)

    var userDoc = {
      type: 'user',
      name: 'foo@example.com',
      roles: [ 'id:user123' ],
      tokens: {
        'secrettoken': {
          type: 'passwordreset',
          createdAt: '2017-07-10T02:00:09.666Z',
          expiresAt: '2017-07-10T04:00:09.666Z'
        }
      }
    }

    simple.mock(addTokenToUserDoc.internals, 'findUserDoc').resolveWith(userDoc)

    var db = simple.stub()
    var account = simple.stub()
    var cache = {
      set: simple.stub().resolveWith(simple.stub())
    }
    var newToken = { id: 'secrettoken', type: 'new passwordreset' }

    addTokenToUserDoc(db, cache, account, newToken)

    .then(function () {
      var modifiedUserDoc = cache.set.lastCall.arg

      t.is(
        modifiedUserDoc.tokens['secrettoken'].type,
        'new passwordreset',
        'new passwordreset token has replaced old'
      )
    })

    .catch(t.catch)
  })

  group.end()
})
