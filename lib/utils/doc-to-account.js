module.exports = toAccount

var findCustomRoles = require('./find-custom-roles')
var isntProtectedAccountProperty = require('./isnt-protected-account-property')

var internals = toAccount.internals = {}
internals.errors = require('../utils/errors')
internals.findIdInRoles = require('./find-id-in-roles')

function toAccount (doc, options) {
  var accountId = internals.findIdInRoles(doc.roles)

  if (!accountId) {
    throw internals.errors.FORBIDDEN_ID_ROLE_MISSING
  }

  var username = doc.name
  var roles = findCustomRoles(doc.roles)
  var account = {
    id: accountId,
    username: username,
    roles: roles
  }

  if (options && options.includeProfile) {
    account.profile = doc.profile
  }

  Object.keys(doc)
    .filter(isntProtectedAccountProperty)
    .forEach(function (property) {
      account[property] = doc[property]
    })

  return account
}
