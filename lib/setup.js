module.exports = setup

var usersDesignDocs = [
  require('./db/users-view-by-id'),
  require('./db/users-view-by-token')
]

function setup (state) {
  if (state.setupPromise) {
    return state.setupPromise
  }

  state.setupPromise = state.db.bulkDocs(usersDesignDocs)

  .then(function () {
    return state.db.installUsersBehavior()
  })

  return state.setupPromise
}
