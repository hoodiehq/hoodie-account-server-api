module.exports = addAccount

var uuid = require('uuid')

var setup = require('../setup')

var errors = require('../utils/errors')
var toAccount = require('../utils/doc-to-account')

function addAccount (state, properties, options) {
  if (!options) {
    options = {}
  }

  if (properties.username === '') {
    return Promise.reject(errors.USERNAME_EMPTY)
  }

  var lowercaseUsername = properties.username.toLowerCase()

  /*
    lowercaseUsername value will be used to create the accountKey.

    We require this since the user lookup is based on this key and
    @hoodie/account-server looks up for the user using the lowercase
    version of the accountKey.
    See https://github.com/hoodiehq/hoodie-account-server/issues/271

    We also need to change the name parameter inside the doc to use
    the lowercase version since pouchdb-users requires the doc ID to
    be of the form 'org.couchdb.user:<name>'
  */

  var accountKey = 'org.couchdb.user:' + lowercaseUsername
  var accountId = properties.id || uuid.v4()

  var doc = {
    _id: accountKey,
    type: 'user',
    name: lowercaseUsername,
    password: properties.password,
    createdAt: properties.createdAt || new Date().toISOString(),
    signedUpAt: properties.signedUpAt,
    roles: [
      'id:' + accountId
    ].concat(properties.roles || [])
  }

  if (properties.profile) {
    doc.profile = properties.profile
  }

  return setup(state)

  .then(function () {
    return state.cache.set(doc)
  })

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
