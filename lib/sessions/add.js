module.exports = addSession

var calculateSessionId = require('couchdb-calculate-session-id')

var errors = require('../utils/errors')
var findUserDoc = require('../utils/find-user-doc-by-username-or-id-or-token')
var toAccount = require('../utils/doc-to-account')
var validatePassword = require('../utils/validate-password')

function addSession (state, options) {
  var promise

  if (options.account.username) {
    promise = state.db.get('org.couchdb.user:' + options.account.username)

    .then(function (doc) {
      // no auth, skip authentication (act as admin)
      if (!options.account.hasOwnProperty('password')) {
        return doc
      }

      if (options.account.password) {
        return new Promise(function (resolve, reject) {
          validatePassword(
            options.account.password,
            doc.salt,
            doc.iterations,
            doc.derived_key,
            function (error, isCorrectPassword) {
              if (error) {
                return reject(error)
              }

              if (!isCorrectPassword) {
                return reject(errors.UNAUTHORIZED_PASSWORD)
              }

              resolve(doc)
            }
          )
        })
      }
    })
  } else {
    promise = findUserDoc(state.db, {
      token: options.account.token
    })
  }

  return promise

  .then(function (doc) {
    var sessionTimeout = 3154000000
    if (options.hasOwnProperty('timeout')) {
      sessionTimeout = options.timeout
    }
    var sessionId = calculateSessionId(
      doc.name,
      doc.salt,
      state.secret,
      Math.floor(Date.now() / 1000) + sessionTimeout
    )

    var promise = Promise.resolve()

    if (options.account.token) {
      promise = promise.then(function () {
        delete doc.tokens[options.account.token]
        return state.db.put(doc)
      })
    }

    return promise.then(function () {
      var session = {
        id: sessionId,
        account: toAccount(doc, {
          includeProfile: options.include === 'account.profile'
        })
      }

      return session
    })
  })
}
