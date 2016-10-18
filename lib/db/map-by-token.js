/* global emit */
module.exports = function (doc) {
  if (!doc.tokens) {
    return
  }

  var tokenIds = Object.keys(doc.tokens)
  for (var i = 0; i < tokenIds.length; i++) {
    if (doc.tokens[tokenIds[i]]) {
      emit(tokenIds[i], doc.tokens[tokenIds[i]])
    }
  }
}
