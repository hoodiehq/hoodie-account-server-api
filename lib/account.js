module.exports = account

var addTokenToUserDoc = require('./utils/add-token-to-user-doc')
var findUserDoc = require('./utils/find-user-doc-by-username-or-id-or-token')

function account (setupPromise, state, findAccountOptions) {
  return {
    tokens: {
      add: function (tokenOptions) {
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
