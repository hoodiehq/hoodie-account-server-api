module.exports = removeSession

var internals = module.exports.internals = {}
internals.findSession = require('./find')

function removeSession (state, id, options) {
  return internals.findSession(state, id, options)
}
