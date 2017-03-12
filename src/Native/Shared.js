/*global _elm_lang$core$Native_Scheduler, Uint32Array */

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
  // Translated from http://codepen.io/avesus/pen/wgQmaV?editors=0012
  // as part of this thread; http://stackoverflow.com/a/21963136/661764
  var uuidGenerator = function () {
    var lut = "x".repeat(256).split("").map(function (_, idx) {
      return (idx < 16 ? "0" : "") + (idx).toString(16)
    })

    var formatUuid = function (params) {
      var d0 = params.d0
      var d1 = params.d1
      var d2 = params.d2
      var d3 = params.d3

      return (
          lut[d0       & 0xff]        + lut[d0 >>  8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + "-" +
          lut[d1       & 0xff]        + lut[d1 >>  8 & 0xff] + "-" +
          lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + "-" +
          lut[d2       & 0x3f | 0x80] + lut[d2 >>  8 & 0xff] + "-" +
          lut[d2 >> 16 & 0xff]        + lut[d2 >> 24 & 0xff] +
          lut[d3       & 0xff]        + lut[d3 >>  8 & 0xff] +
          lut[d3 >> 16 & 0xff]        + lut[d3 >> 24 & 0xff]
      )
    }

    var getRandomValuesFunc = window.crypto && window.crypto.getRandomValues ?
      function () {
        var dvals = new Uint32Array(4)
        window.crypto.getRandomValues(dvals)
        return {
          d0: dvals[0],
          d1: dvals[1],
          d2: dvals[2],
          d3: dvals[3]
        }
      } :
      function () {
        return {
          d0: Math.random() * 0x100000000 >>> 0,
          d1: Math.random() * 0x100000000 >>> 0,
          d2: Math.random() * 0x100000000 >>> 0,
          d3: Math.random() * 0x100000000 >>> 0
        }
      }

    return function () {
      return formatUuid(getRandomValuesFunc())
    }
  }


  var uuid = uuidGenerator()


  var appToModel = function (app) {
    var getApp = function () {
      return app
    }

    return {
      ctor: "App",
      app: getApp
    }
  }


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
      query: getQuery,
      uuid: uuid()
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
    "queryToModel": queryToModel,
    "sourceOnSnapshot": sourceOnSnapshot,
    "sourceOffSnapshot": sourceOffSnapshot,
    "sourceOnceSnapshot": sourceOnceSnapshot
  }
}()
