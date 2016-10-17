module.exports = toAccount

var errors = require('../utils/errors')
var findCustomRoles = require('./find-custom-roles')
var findIdInRoles = require('./find-id-in-roles')

function toAccount (doc, options) {
  var accountId = findIdInRoles(doc.roles)

  if (!accountId) {
    throw errors.FORBIDDEN_ID_ROLE_MISSING
  }

  var username = doc.name
  var roles = doc.roles
  var createdAt = doc.createdAt
  var signedUpAt = doc.signedUpAt
  var account = {
    id: accountId,
    username: username,
    createdAt: createdAt,
    signedUpAt: signedUpAt,
    roles: findCustomRoles(roles)
  }

  if (options.includeProfile) {
    account.profile = doc.profile
  }

  return account
}
