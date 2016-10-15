module.exports = setup

var usersDesignDoc = require('./db/users-design-doc')

function setup (state) {
  return state.db.put(usersDesignDoc)

  .catch(function (error) {
    if (error.name !== 'conflict') {
      throw error
    }
  })
}
