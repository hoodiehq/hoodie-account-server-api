module.exports = accountApi

var EventEmitter = require('events').EventEmitter

var account = require('./lib/account')

var addSession = require('./lib/sessions/add')
var findSession = require('./lib/sessions/find')
var removeSession = require('./lib/sessions/remove')

var addAccount = require('./lib/accounts/add')
var findAccount = require('./lib/accounts/find')
var findAllAccounts = require('./lib/accounts/find-all')
var updateAccount = require('./lib/accounts/update')
var removeAccount = require('./lib/accounts/remove')
var accountsOn = require('./lib/accounts/on')

var cache = require('./lib/utils/cache')

var startListeningToAccountChanges = require('./lib/utils/start-listening-to-account-changes')

function accountApi (options) {
  options.PouchDB.plugin(require('pouchdb-users'))
  var accountsEmitter = new EventEmitter()
  var db = new options.PouchDB(options.usersDb || '_users')
  var state = {
    db: db,
    secret: options.secret,
    accountsEmitter: accountsEmitter,
    cache: cache(db)
  }

  accountsEmitter.once('newListener', startListeningToAccountChanges.bind(null, state))

  return {
    sessions: {
      add: addSession.bind(null, state),
      find: findSession.bind(null, state),
      remove: removeSession.bind(null, state)
    },
    accounts: {
      add: addAccount.bind(null, state),
      find: findAccount.bind(null, state),
      findAll: findAllAccounts.bind(null, state),
      remove: removeAccount.bind(null, state),
      update: updateAccount.bind(null, state),
      on: accountsOn.bind(null, state)
    },
    account: account.bind(null, state)
  }
}
