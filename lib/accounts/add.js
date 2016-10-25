module.exports = addAccount

var uuid = require('uuid')

var errors = require('../utils/errors')
var toAccount = require('../utils/doc-to-account')

function addAccount (state, properties, options) {
  if (!options) {
    options = {}
  }

  if (properties.username === '') {
    return Promise.reject(errors.USERNAME_EMPTY)
  }

  var accountKey = 'org.couchdb.user:' + properties.username
  var accountId = properties.id || uuid.v4()

  var doc = {
    _id: accountKey,
    type: 'user',
    name: properties.username,
    password: properties.password,
    createdAt: properties.createdAt,
    signedUpAt: properties.signedUpAt,
    roles: [
      'id:' + accountId
    ].concat(properties.roles || [])
  }

  if (properties.profile) {
    doc.profile = properties.profile
  }

  return state.db.put(doc)

  .catch(function (error) {
    if (error.status === 409) {
      throw errors.USERNAME_EXISTS
    }
    throw error
  })

  .then(function () {
    return toAccount(doc, {
      includeProfile: options.include === 'profile'
    })
  })
}
