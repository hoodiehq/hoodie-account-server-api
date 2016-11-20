module.exports = isValidTokenType

function isValidTokenType (token) {
  var validPattern = /^[a-z][a-z0-9\-_]*$/

  if (typeof token !== 'string' ||
  !validPattern.test(token)) {
    return false
  }

  return true
}
