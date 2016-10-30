module.exports = startListeningToAccountChanges

var toAccount = require('./doc-to-account')

function startListeningToAccountChanges (state) {
  state.db.changes({
    since: 'now',
    live: true,
    include_docs: true
  })

  .on('change', function (change) {
    // ignore docs that aren’t accounts (e.g. design docs)
    if (!change.doc.name || !change.doc.roles) {
      return
    }

    var isNew = parseInt(change.doc._rev, 10) === 1
    var eventName = isNew ? 'add' : 'update'

    if (change.deleted) {
      eventName = 'remove'
    }

    // special case: a username change is technically a delete and a create of
    // a document in the users database, because the `_id` properties containt
    // the username assure uniqueness. In this case, we don’t want to emit
    // add & remove events, but a single update event.
    if (change.doc.renamed && eventName === 'add') {
      return
    }
    if (change.doc.renamed && eventName === 'remove') {
      eventName = 'update'
    }

    var account = toAccount(change.doc, {
      includeProfile: true
    })

    state.accountsEmitter.emit('change', eventName, account)
    state.accountsEmitter.emit(eventName, account)
  })
}
