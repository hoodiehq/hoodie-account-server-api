module.exports = toDocProperties

function toDocProperties (account) {
  var doc = {
    _id: 'org.couchdb.user:' + account.username,
    name: account.username,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    signedUpAt: account.signedUpAt,
    profile: account.profile,
    roles: ['id:' + account.id].concat(account.roles)
  }

  return doc
}
