module.exports = addTokenToUserDoc

var uuid = require('uuid')

var findUserDoc = require('./find-user-doc-by-username-or-id-or-token')

function addTokenToUserDoc (db, account, token) {
  return findUserDoc(db, account)

  .then(function (userDoc) {
    if (!userDoc.tokens) {
      userDoc.tokens = {}
    }

    var id = token.id || uuid.v4()
    delete token.id

    userDoc.tokens[id] = token

    return db.put(userDoc)

    .then(function (response) {
      token.id = id
      return token
    })
  })
}
