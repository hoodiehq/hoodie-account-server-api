module.exports = cache

function cache (db) {
  var memory = {}

  db.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change', function (change) {
    if (change.deleted) {
      delete memory[change.id]
      return
    }
    memory[change.id] = change.doc
  })

  return {
    get: function (key) {
      if (memory[key]) {
        return Promise.resolve(memory[key])
      }

      return db.get(key)

      .then(function (doc) {
        memory[key] = doc
        return doc
      })
    },

    set: function (doc) {
      return db.put(doc)

      .then(function (response) {
        if (doc._deleted) {
          delete memory[doc._id]
          return response
        }

        doc._rev = response.rev
        memory[doc._id] = doc

        return response
      })
    }
  }
}
