module.exports = setup

var usersDesignDocs = [
  require('./db/users-view-by-id'),
  require('./db/users-view-by-token')
]

function setup (state) {
  return state.db.bulkDocs(usersDesignDocs)

  .then(function () {
    return state.db.installUsersBehavior()
  })
}
