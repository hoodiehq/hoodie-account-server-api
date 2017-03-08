module.exports = findAccount

var findUserDoc = require('../utils/find-user-doc-by-username-or-id-or-token')
var toAccount = require('../utils/doc-to-account')

function findAccount (state, idOrObject, options) {
  if (!options) {
    options = {}
  }
  return findUserDoc(state.db, state.cache, idOrObject)

  .then(function (doc) {
    return toAccount(doc, {
      includeProfile: options.include === 'profile'
    })
  })
}
