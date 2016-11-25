module.exports = account

var addTokenToUserDoc = require('./utils/add-token-to-user-doc')
var errors = require('./utils/errors')
var findUserDoc = require('./utils/find-user-doc-by-username-or-id-or-token')
var isValidTokenType = require('./utils/is-valid-token-type')

function account (setupPromise, state, findAccountOptions) {
  return {
    tokens: {
      add: function (tokenOptions) {
        if (!isValidTokenType(tokenOptions.type)) {
          return Promise.reject(errors.TOKEN_TYPE_INVALID)
        }

        if (!tokenOptions.hasOwnProperty('timeout')) {
          tokenOptions.timeout = 7200
        }

        return setupPromise

        .then(function () {
          return addTokenToUserDoc(state.db, findAccountOptions, tokenOptions)
        })
      },
      find: function (id) {
        return setupPromise

        .then(function () {
          return findUserDoc(state.db, findAccountOptions)
        })

        .then(function (userDoc) {
          return userDoc.tokens[id]
        })
      }
    }
  }
}
