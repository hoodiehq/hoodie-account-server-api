module.exports = toDocProperties

function toDocProperties (account) {
  var doc = {
    _id: 'org.couchdb.user:' + account.username,
    roles: ['id:' + account.id].concat(account.roles)
  }

  ;[
    'createdAt',
    'name',
    'password',
    'profile',
    'signedUpAt',
    'updatedAt'
  ].forEach(function (property) {
    if (property in account) {
      doc[property] = account[property]
    }
  })

  return doc
}
