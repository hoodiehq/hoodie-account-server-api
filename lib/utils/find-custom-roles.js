module.exports = findCustomRoles

var internals = findCustomRoles.internals = {}

function findCustomRoles (roles) {
  return roles.filter(internals.isntInteralRole)
}

internals.isntInteralRole = function isntInteralRole (role) {
  if (role === '_admin') {
    return false
  }

  if (role.substr(0, 3) === 'id:') {
    return false
  }

  return true
}
