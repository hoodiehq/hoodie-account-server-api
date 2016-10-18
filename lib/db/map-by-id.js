/* global emit */
module.exports = function (doc) {
  if (!doc.roles) {
    return
  }

  var isAdmin = doc.roles.indexOf('_admin') !== -1
  if (isAdmin) {
    return
  }

  for (var i = 0; i < doc.roles.length; i++) {
    if (doc.roles[i].substr(0, 3) === 'id:') {
      emit(doc.roles[i].substr(3), null)
    }
  }
}
