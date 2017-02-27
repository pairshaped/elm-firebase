/*global _pairshaped$elm_firebase$Native_Shared, F2, F3 */

var _pairshaped$elm_firebase$Native_Database_Query = function () { // eslint-disable-line no-unused-vars

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Database.Query"].concat(Array.prototype.slice.call(arguments))
    //
    // console.log.apply(console, args)
  }


  var maybeWithDefault = function (fallback, maybe) {
    return maybe.ctor == "Nothing"
      ? fallback
      : maybe._0
  }


  // Query methods


  var ref = function (queryModel) {
    debug(".ref", queryModel)
    var query = queryModel.query()

    return query.ref
  }


  var startAt = function (value, maybeKey, queryModel) {
    debug(".startAt", value, maybeKey, queryModel)
    var query = queryModel.query()

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      query.startAt(value, maybeWithDefault(undefined, maybeKey))
    )
  }


  var endAt = function (value, maybeKey, queryModel) {
    debug(".endAt", value, maybeKey, queryModel)
    var query = queryModel.query()

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      query.endAt(value, maybeWithDefault(undefined, maybeKey))
    )
  }


  var equalTo = function (value, maybeKey, queryModel) {
    debug(".equalTo", value, maybeKey, queryModel)
    var query = queryModel.query()

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      query.equalTo(value, maybeWithDefault(undefined, maybeKey))
    )
  }


  var limitToFirst = function (limit, queryModel) {
    debug(".limitToFirst", limit, queryModel)
    var query = queryModel.query()

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(query.limitToFirst(limit))
  }


  var limitToLast = function (limit, queryModel) {
    debug(".limitToLast", limit, queryModel)
    var query = queryModel.query()

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(query.limitToLast(limit))
  }


  var once = function (eventType, queryModel) {
    debug(".queryOnce", eventType, queryModel)
    var query = queryModel.query()

    return _pairshaped$elm_firebase$Native_Shared.sourceOnceSnapshot(eventType, query)
  }


  var on = function (eventType, queryModel, tagger) {
    debug(".on", eventType, queryModel, tagger)
    var query = queryModel.query()

    return _pairshaped$elm_firebase$Native_Shared.sourceOnSnapshot(eventType, query, tagger)
  }


  var off = function (eventType, queryModel) {
    debug(".off", eventType, queryModel)
    var query = queryModel.query()

    return _pairshaped$elm_firebase$Native_Shared.sourceOffSnapshot(eventType, query)
  }


  // Helper


  var uuid = function (queryModel) {
    debug(".uuid", queryModel)

    return queryModel.uuid
  }


  return {
    "ref": ref,
    "startAt": F3(startAt),
    "endAt": F3(endAt),
    "equalTo": F3(equalTo),
    "limitToFirst": F2(limitToFirst),
    "limitToLast": F2(limitToLast),
    "once" : F2(once),
    "on" : F3(on),
    "off" : F2(off),
    "uuid": uuid
  }
}()
