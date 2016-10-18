module.exports = account

var addTokenToUserDoc = require('./utils/add-token-to-user-doc')

function account (setupPromise, state, findAccountOptions) {
  return {
    tokens: {
      add: function (tokenOptions) {
        return setupPromise

        .then(function () {
          return addTokenToUserDoc(state.db, findAccountOptions, tokenOptions)
        })
      }
    }
  }
}
