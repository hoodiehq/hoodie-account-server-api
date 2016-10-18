module.exports = findUserDoc

var PouchDBErrors = require('pouchdb-errors')

function findUserDoc (db, idOrObject) {
  var id = idOrObject
  var username
  var tokenId

  if (typeof idOrObject === 'object') {
    id = idOrObject.id
    username = idOrObject.username
    tokenId = idOrObject.token
  }

  if (username) {
    return db.get('org.couchdb.user:' + username)
  }

  if (id) {
    return db.query('byId', {
      key: id,
      include_docs: true
    }).then(function (response) {
      if (response.rows.length === 0) {
        throw PouchDBErrors.MISSING_DOC
      }

      return response.rows[0].doc
    })
  }

  return db.query('byToken', {
    key: tokenId,
    include_docs: true
  }).then(function (response) {
    if (response.rows.length === 0) {
      throw PouchDBErrors.MISSING_DOC
    }

    return response.rows[0].doc
  })
}
