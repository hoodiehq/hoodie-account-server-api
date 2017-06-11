module.exports = findSession
var internals = module.exports.internals = {}

var setup = require('../setup')

var decodeSessionId = require('../utils/couchdb-decode-session-id')
var errors = require('../utils/errors')
var toAccount = require('../utils/doc-to-account')

internals.isValidSessionId = require('../utils/couchdb-is-valid-session-id')

function findSession (state, id, options) {
  if (!options) {
    options = {}
  }
  var username = decodeSessionId(id).name

  return setup(state)

  .then(function () {
    return state.cache.get('org.couchdb.user:' + username)
  })

  .then(function (user) {
    if (!internals.isValidSessionId(state.secret, user.salt, id)) {
      throw errors.MISSING_SESSION
    }

    return user
  })

  .then(function (doc) {
    var account = toAccount(doc, {
      includeProfile: options.include === 'account.profile'
    })

    var session = {
      id: id,
      account: account
    }

    return session
  })
}
