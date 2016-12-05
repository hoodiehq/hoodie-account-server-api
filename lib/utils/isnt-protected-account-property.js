module.exports = isProtectedAccountProperty

var PROTECTED_PROPERTIES = [
  'derived_key',
  'id',
  'iterations',
  'name',
  'password_scheme',
  'profile',
  'renamed',
  'roles',
  'salt',
  'tokens',
  'type',
  'username'
]

function isProtectedAccountProperty (property) {
  if (property[0] === '_') {
    return false
  }

  return PROTECTED_PROPERTIES.indexOf(property) === -1
}
