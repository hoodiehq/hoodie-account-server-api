module.exports = isTokenExpired

function isTokenExpired (token) {
  return Date.parse(token.expiresAt) <= Date.now()
}
