module.exports = validatePassword

var internals = validatePassword.internals = {}
internals.crypto = require('crypto')

function validatePassword (password, salt, iterations, derivedKey, callback) {
  internals.crypto.pbkdf2(
    password, salt, iterations, 20, 'sha1', function (error, derivedKeyCheck) {
      if (error) {
        return callback(error)
      }

      callback(null, derivedKeyCheck.toString('hex') === derivedKey)
    }
  )
}
