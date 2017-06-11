module.exports = removeAccount

var setup = require('../setup')

var updateAccount = require('./update')

function removeAccount (state, idOrObject, options) {
  return setup(state)

  .then(function () {
    return updateAccount(state, idOrObject, {
      _deleted: true
    }, options)
  })
}
