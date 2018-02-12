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


  var errorToModel = function (err) {
    return {
      ctor: "Error",
      _0: err.code,
      _1: err.message
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

  // shorthand for native APIs
  var nativeBinding = _elm_lang$core$Native_Scheduler.nativeBinding;
  var succeed = _elm_lang$core$Native_Scheduler.succeed;

  var sourceOnSnapshot = function (eventType, source, tagger) {
    return nativeBinding(function (callback) {
      source.on(eventType, _pairshaped$elm_firebase$Native_Shared$onSnapshot.bind(window, tagger))

      callback(succeed({ ctor: "_Tuple0" }))
    })
  }


  var sourceOffSnapshot = function (eventType, source) {
    return nativeBinding(function (callback) {
      source.off(eventType, _pairshaped$elm_firebase$Native_Shared$onSnapshot)

      callback(succeed({ ctor: "_Tuple0" }))
    })
  }


  var sourceOnceSnapshot = function (eventType, source) {
    return nativeBinding(function (callback) {
      source.once(eventType, function (snapshot) {
        callback(
          succeed(
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
