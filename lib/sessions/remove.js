module.exports = removeSession

var internals = module.exports.internals = {}
internals.findSession = require('./find')

var setup = require('../setup')

function removeSession (state, id, options) {
  return setup(state)

  .then(function () {
    return internals.findSession(state, id, options)
  })
}
