module.exports = promiseThen

function promiseThen (promise, method) {
  var args = Array.prototype.slice.call(arguments, 2)
  return promise.then(function () {
    return method.apply(null, args)
  })
}
