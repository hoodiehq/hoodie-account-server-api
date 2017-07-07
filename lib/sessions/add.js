module.exports = addSession

var internals = addSession.internals = {}
internals.calculateSessionId = require('couchdb-calculate-session-id')

internals.setup = require('../setup')

internals.errors = require('../utils/errors')
internals.findUserDoc = require('../utils/find-user-doc-by-username-or-id-or-token')
internals.toAccount = require('../utils/doc-to-account')
internals.validatePassword = require('../utils/validate-password')

function addSession (state, options) {
  var promise = internals.setup(state)

  if (options.account.username) {
    promise = promise.then(function () {
      return state.cache.get('org.couchdb.user:' + options.account.username)
    })

    .then(function (doc) {
      // no auth, skip authentication (act as admin)
      if (!options.account.hasOwnProperty('password')) {
        return doc
      }

      return new Promise(function (resolve, reject) {
        internals.validatePassword(
          options.account.password,
          doc.salt,
          doc.iterations,
          doc.derived_key,
          function (error, isCorrectPassword) {
            if (error) {
              return reject(error)
            }

            if (!isCorrectPassword) {
              return reject(internals.errors.UNAUTHORIZED_PASSWORD)
            }

            resolve(doc)
          }
        )
      })
    })
  } else {
    promise = promise.then(function () {
      return internals.findUserDoc(state.db, state.cache, {
        token: options.account.token
      })
    })
  }

  return promise

  .then(function (doc) {
    var sessionTimeout = 3154000000
    if (options.hasOwnProperty('timeout')) {
      sessionTimeout = options.timeout
    }
    var sessionId = internals.calculateSessionId(
      doc.name,
      doc.salt,
      state.secret,
      Math.floor(Date.now() / 1000) + sessionTimeout
    )

    var promise = Promise.resolve()

    if (options.account.token) {
      promise = promise.then(function () {
        delete doc.tokens[options.account.token]
        return state.cache.set(doc)
      })
    }

    return promise.then(function () {
      var session = {
        id: sessionId,
        account: internals.toAccount(doc, {
          includeProfile: options.include === 'account.profile'
        })
      }

      return session
    })
  })
}
