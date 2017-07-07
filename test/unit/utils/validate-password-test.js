var simple = require('simple-mock')
var test = require('tap').test

var validatePassword = require('../../../lib/utils/validate-password')

test('validatePassword', function (group) {
  group.test('pbkdf2 error', function (t) {
    t.plan(1)

    var pbkdf2Error = new Error('pbkdf2 error')
    simple.mock(validatePassword.internals.crypto, 'pbkdf2').callFn(
      function (password, salt, iterations, twenty, hash, next) {
        next(pbkdf2Error)
      }
    )

    var callback = function (error, isValidPassword) {
      if (typeof isValidPassword !== 'undefined') {
        t.fail('should fail early with error before checking password')
      }

      t.is(error, pbkdf2Error)
    }

    validatePassword('supersecret', 'pepper', 10, 'hashedpassword', callback)
  })

  group.end()
})
