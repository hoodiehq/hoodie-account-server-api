module.exports = toAccount

var errors = require('../utils/errors')
var findCustomRoles = require('./find-custom-roles')
var findIdInRoles = require('./find-id-in-roles')
var isntProtectedAccountProperty = require('./isnt-protected-account-property')

function toAccount (doc, options) {
  var accountId = findIdInRoles(doc.roles)

  if (!accountId) {
    throw errors.FORBIDDEN_ID_ROLE_MISSING
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
