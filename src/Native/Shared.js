/*global _elm_lang$core$Native_Scheduler */

/* This will be hoisted to the top of the elm function wrapper, but not be exposed to
 * the global scope.
 */
function _pairshaped$elm_firebase$Native_Shared$onSnapshot (tagger, snapshot, prevKey) {
  _elm_lang$core$Native_Scheduler.rawSpawn(
    tagger(
      _pairshaped$elm_firebase$Native_Shared.snapshotToModel(snapshot, prevKey)
    )
  )
}

var _pairshaped$elm_firebase$Native_Shared = function () {
  var databaseToModel = function (database) {
    var getDatabase = function () {
      return database
    }

    return {
      ctor: "Database",
      database: getDatabase
    }
  }


  var referenceToModel = function (reference) {
    var getReference = function () {
      return reference
    }

    return {
      ctor: "Reference",
      reference : getReference
    }
  }


  var snapshotToModel = function (snapshot, prevKey) {
    var getDataSnapshot = function () {
      return snapshot
    }

    return {
      ctor: "Snapshot",
      snapshot: getDataSnapshot,
      prevKey: prevKey
        ? { ctor: "Just", _0: prevKey }
        : { ctor: "Nothing" }
    }
  }


  var queryToModel = function (query) {
    var getQuery = function () {
      return query
    }

    return {
      ctor: "Query",
      query: getQuery
    }
  }


  var sourceOnSnapshot = function (eventType, source, tagger) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.on(eventType, _pairshaped$elm_firebase$Native_Shared$onSnapshot.bind(window, tagger))

      callback(_elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" }))
    })
  }


  var sourceOffSnapshot = function (eventType, source) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.off(eventType, _pairshaped$elm_firebase$Native_Shared$onSnapshot)

      callback(_elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" }))
    })
  }


  var sourceOnceSnapshot = function (eventType, source) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.once(eventType, function (snapshot) {
        callback(
          _elm_lang$core$Native_Scheduler.succeed(
            _pairshaped$elm_firebase$Native_Shared.snapshotToModel(snapshot)
          )
        )

      }, function (err) {
        callback(
          _elm_lang$core$Native_Scheduler.fail(
            { ctor: "Error", _0: err.code, _1: err.message }
          )
        )

      })
    })
  }

  //


  /* Note: no Fn(..) elm interop. These are meant to be used as helpers
   * to other parts of the native bindings and not from elm itself.
   */
  return {
    "appToModel": appToModel,
    "databaseToModel": databaseToModel,
    "referenceToModel": referenceToModel,
    "snapshotToModel": snapshotToModel,
    "errorToModel": errorToModel,
    "queryToModel": queryToModel,
    "sourceOnSnapshot": sourceOnSnapshot,
    "sourceOffSnapshot": sourceOffSnapshot,
    "sourceOnceSnapshot": sourceOnceSnapshot
  }
}()
