module.exports = toDocProperties

var isntProtectedAccountProperty = require('./isnt-protected-account-property')

function toDocProperties (account) {
  var doc = {
    _id: 'org.couchdb.user:' + account.username,
    roles: ['id:' + account.id].concat(account.roles)
  }

  if (typeof account.profile === 'object') {
    doc.profile = account.profile
  }

  Object.keys(account)
    .filter(isntProtectedAccountProperty)
    .forEach(function (property) {
      doc[property] = account[property]
    })

  return doc
}
