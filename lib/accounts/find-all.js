module.exports = findAllAccount

var isHoodieAccountDoc = require('../utils/is-hoodie-account-doc')
var toAccount = require('../utils/doc-to-account')

function findAllAccount (state, options) {
  return state.db.allDocs({
    include_docs: true,
    startkey: 'org.couchdb.user:',
    // https://wiki.apache.org/couchdb/View_collation#String_Ranges
    endkey: 'org.couchdb.user:\ufff0'
  })

  .then(function (response) {
    options = options || {}
    return response.rows
      .filter(function (row) {
        return isHoodieAccountDoc(row.doc)
      })
      .map(function (row) {
        return toAccount(row.doc, {
          includeProfile: options.include === 'profile'
        })
      })
  })
}
