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

    var timeout = token.hasOwnProperty('timeout') ? token.timeout : 7200
    delete token.timeout
    var now = Date.now()
    token.createdAt = new Date(now).toISOString()
    token.expiresAt = new Date(now + (timeout * 1000)).toISOString()

    userDoc.tokens[id] = token

    return db.put(userDoc)

    .then(function (response) {
      token.id = id
      return token
    })
  })
}
