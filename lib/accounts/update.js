module.exports = updateAccount

var _ = require('lodash')

var findUserDoc = require('../utils/find-user-doc-by-username-or-id-or-token')
var toAccount = require('../utils/doc-to-account')
var toDocProperties = require('../utils/account-to-doc-properties')

function updateAccount (state, idOrObject, change, options) {
  if (!options) {
    options = {}
  }
  return findUserDoc(state.db, idOrObject)

  .then(function (doc) {
    var newAccount, docProperties
    var oldAccount = toAccount(doc, {
      includeProfile: true
    })

    if (typeof change === 'function') {
      newAccount = change(_.clone(oldAccount))
    } else {
      newAccount = _.merge({}, oldAccount, change)
    }

    if (oldAccount.username !== newAccount.username) {
      // changing the username requires 2 operations:
      // 1) create a new doc (with the new name)
      // 2) delete the old doc
      var oldDoc = doc

      // the new doc will NOT include the username or the _rev
      doc = _.merge(
        _.omit(doc, ['_rev']),
        {
          _id: 'org.couchdb.user:' + newAccount.username,
          name: newAccount.username,
          renamed: {
            _id: doc._id,
            _rev: doc._rev
          }
        }
      )

      docProperties = toDocProperties(newAccount)
      Object.keys(docProperties).forEach(function (property) {
        doc[property] = docProperties[property]
      })

      // 1) add the new doc
      return state.db.put(doc)

      .then(function (response) {
        doc._rev = response.rev

        // delete the old doc and add the renamed field
        var deletedDoc = _.defaultsDeep({
          _deleted: true,
          renamed: {
            _id: response.id,
            _rev: response.rev
          }
        }, oldDoc)

        // 2) delete the old doc
        return state.db.put(deletedDoc)
      })

      .then(() => doc)
    }

    // we set the "renamed" property when renaming a username and use it to
    // detect a username change in event handling. So we have to get rid of it
    // later to make sure the correct events are emitted
    doc = _.merge(
      _.omit(doc, ['renamed']),
      {
        _deleted: newAccount._deleted
      }
    )

    docProperties = toDocProperties(newAccount)
    Object.keys(docProperties).forEach(function (property) {
      doc[property] = docProperties[property]
    })

    return state.db.put(doc)

    .then(function (response) {
      doc._rev = response.rev
      return doc
    })
  })

  .then(function (doc) {
    var promise = Promise.resolve()

    if (idOrObject.token) {
      promise = promise.then(function () {
        delete doc.tokens[idOrObject.token]
        return state.db.put(doc)
      })
    }

    return promise.then(function () {
      return toAccount(doc, {
        includeProfile: options.include === 'profile'
      })
    })
  })
}
