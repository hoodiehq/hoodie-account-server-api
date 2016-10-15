module.exports = accountApi

var EventEmitter = require('events').EventEmitter

var setup = require('./lib/setup')

var addSession = require('./lib/sessions/add')
var findSession = require('./lib/sessions/find')
var removeSession = require('./lib/sessions/remove')

var addAccount = require('./lib/accounts/add')
var findAccount = require('./lib/accounts/find')
var findAllAccounts = require('./lib/accounts/find-all')
var updateAccount = require('./lib/accounts/update')
var removeAccount = require('./lib/accounts/remove')
var accountsOn = require('./lib/accounts/on')

var startListeningToAccountChanges = require('./lib/utils/start-listening-to-account-changes')

function accountApi (options) {
  var accountsEmitter = new EventEmitter()
  var state = {
    db: options.db,
    secret: options.secret,
    accountsEmitter: accountsEmitter
  }

  // returns promise
  var setupPromise = setup(state)

  accountsEmitter.once('newListener', startListeningToAccountChanges.bind(null, state))

  return {
    sessions: {
      add: promiseThen.bind(null, setupPromise, addSession.bind(null, state)),
      find: promiseThen.bind(null, setupPromise, findSession.bind(null, state)),
      remove: promiseThen.bind(null, setupPromise, removeSession.bind(null, state))
    },
    accounts: {
      add: promiseThen.bind(null, setupPromise, addAccount.bind(null, state)),
      find: promiseThen.bind(null, setupPromise, findAccount.bind(null, state)),
      findAll: promiseThen.bind(null, setupPromise, findAllAccounts.bind(null, state)),
      remove: promiseThen.bind(null, setupPromise, removeAccount.bind(null, state)),
      update: promiseThen.bind(null, setupPromise, updateAccount.bind(null, state)),
      on: accountsOn.bind(null, state)
    }
  }
}

function promiseThen (promise, method) {
  var args = Array.prototype.slice.call(arguments, 2)
  return promise.then(function () {
    return method.apply(null, args)
  })
}
