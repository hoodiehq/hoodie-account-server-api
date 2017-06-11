module.exports = account

var setup = require('./setup')

var addTokenToUserDoc = require('./utils/add-token-to-user-doc')
var errors = require('./utils/errors')
var findUserDoc = require('./utils/find-user-doc-by-username-or-id-or-token')
var isValidTokenType = require('./utils/is-valid-token-type')

function account (state, findAccountOptions) {
  return {
    tokens: {
      add: function (tokenOptions) {
        if (!isValidTokenType(tokenOptions.type)) {
          return Promise.reject(errors.TOKEN_TYPE_INVALID)
        }

        return setup(state)

        .then(function () {
          return addTokenToUserDoc(state.db, state.cache, findAccountOptions, tokenOptions)
        })
      },
      find: function (id) {
        return setup(state)

        .then(function () {
          return findUserDoc(state.db, state.cache, findAccountOptions)
        })

        .then(function (userDoc) {
          var token = userDoc.tokens[id]
          token.id = id
          return token
        })
      }
    }
  }
}
