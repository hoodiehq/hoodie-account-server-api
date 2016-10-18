module.exports = {
  _id: '_design/byId',
  views: {
    byId: {
      map: require('./map-by-id').toString()
    }
  }
}
