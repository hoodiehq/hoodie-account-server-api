module.exports = {}

module.exports.internals = {
  hoodieError: hoodieError
}

function hoodieError (options) {
  var error = new Error(options.message)
  error.name = options.name || error.name
  error.status = options.status

  return error
}

module.exports.UNAUTHORIZED_PASSWORD = hoodieError({
  name: 'Unauthorized',
  message: 'Invalid credentials',
  status: 401
})

module.exports.FORBIDDEN_ID_ROLE_MISSING = hoodieError({
  name: 'Forbidden',
  message: '"id:..." role missing (https://github.com/hoodiehq/hoodie-account-server/blob/master/how-it-works.md#id-role)',
  status: 403
})

module.exports.MISSING_SESSION = hoodieError({
  name: 'Not Found',
  message: 'Session invalid',
  status: 404
})

module.exports.USERNAME_EXISTS = hoodieError({
  name: 'Conflict',
  message: 'An account with that username already exists',
  status: 409
})

module.exports.USERNAME_EMPTY = hoodieError({
  name: 'Bad Request',
  message: 'username must be set',
  status: 400
})

module.exports.TOKEN_TYPE_INVALID = hoodieError({
  name: 'Bad Request',
  message: 'Token type must consist of lowercase letters (a-z), digits (0-9), _ and - only. Must begin with a letter',
  status: 400
})

module.exports.TOKEN_EXPIRED = hoodieError({
  name: 'Not Found',
  message: 'Token expired',
  status: 404
})
