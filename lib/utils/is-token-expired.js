module.exports = isTokenExpired

function isTokenExpired (token) {
  var timeOutInMs = token.timeout * 1000
  var createdAtInMs = Date.parse(token.createdAt)
  
  return createdAtInMs + timeOutInMs >= Date.now()
}