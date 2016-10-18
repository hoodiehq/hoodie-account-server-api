module.exports = {
  _id: '_design/byToken',
  views: {
    byToken: {
      map: require('./map-by-token').toString()
    }
  }
}
