module.exports = isHoodieAccountDoc

var findIdInRoles = require('./find-id-in-roles')

function isHoodieAccountDoc (doc) {
  return !!findIdInRoles(doc.roles)
}
