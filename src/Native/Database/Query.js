var _pairshaped$elm_firebase$Native_Database_Query = function () {

  // Utilities

  var debug = function () {
    var args = ["Native.Firebase.Database.Query"].concat(Array.prototype.slice.call(arguments));

    console.log.apply(console, arguments);
  };

  var databaseToModel = function (database) {
    var getDatabase = function () {
      return database;
    };

    return {
      ctor: "Database",
      database: getDatabase
    };
  };


  var referenceToModel = function (reference) {
    var getReference = function () {
      return reference;
    };

    return {
      ctor: "Reference",
      reference : getReference
    };
  };


  var snapshotToModel = function (snapshot, prevKey) {
    var getDataSnapshot = function () {
      return snapshot;
    };

    return {
      ctor: "Snapshot",
      snapshot: getDataSnapshot,
      prevKey: prevKey ? { ctor: "Just", _0: prevKey } : { ctor: "Nothing" }
    };
  };


  var queryToModel = function (query) {
    var getQuery = function () {
      return query;
    };

    return {
      ctor: "Query",
      query: getQuery
    };
  };


  var maybeWithDefault = function (fallback, maybe) {
    return maybe.ctor == "Nothing"
      ? fallback
      : maybe._0
  }


  // Callback handlers


  var wrapOnce = function (eventType, source) {
    debug("Firebase.Database.wrapOnce", eventType, source);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.once(eventType, function (snapshot) {
        debug("Firebase.Database.wrapOnce.succeed", eventType, source, snapshot)
        callback(_elm_lang$core$Native_Scheduler.succeed(snapshotToModel(snapshot)))

      }, function (err) {
        var ctor =
          err.code
          .split("/")[1]
          .replace(/-([a-z])/g, function (char) { return char[1].toUpperCase(); })
          .replace(/^([a-z])/, function (firstChar) { return firstChar.toUpperCase(); });

        debug("Firebase.Database.wrapOnce.fail", eventType, source, err)
        callback(_elm_lang$core$Native_Scheduler.fail({ ctor: "Error", _0: err.code, _1: err.message }))

      })
    })
  }


  var onCallback = function (nativeCallback, snapshot, prevKey) {
    return nativeCallback(
      _elm_lang$core$Native_Scheduler.succeed(
        snapshotToModel(snapshot, prevKey)
      )
    )
  }


  var wrapOn = function (eventType, source) {
    debug("Firebase.Database.wrapOn", eventType, source);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.on(eventType, onCallback.bind(this, callback))
    })
  }

  var wrapOff = function (eventType, source) {
    debug("Firebase.Database.wrapOff", eventType, source);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.off(eventType, onCallbackWithPrevKey)
    })
  }

  //


  var startAt = function (value, maybeKey, queryModel) {
    debug(".startAt", value, key, queryModel);
    var query = queryModel.query();

    return queryToModel(query.startAt(value, maybeWithDefault(undefined, maybeKey)));
  }


  var endAt = function (value, maybeKey, queryModel) {
    debug(".endAt", value, key, queryModel);
    var query = queryModel.query();

    return queryToModel(query.endAt(value, maybeWithDefault(undefined, maybeKey)));
  }


  var equalTo = function (value, maybeKey, queryModel) {
    debug(".equalTo", value, key, queryModel);
    var query = queryModel.query();

    return queryToModel(query.equalTo(value, maybeWithDefault(undefined, maybeKey)));
  }


  var limitToFirst = function (limit, queryModel) {
    debug(".limitToFirst", limit, queryModel);
    var query = queryModel.query();

    return queryToModel(query.limitToFirst(limit));
  }


  var limitToLast = function (limit, queryModel) {
    debug(".limitToLast", limit, queryModel);
    var query = queryModel.query();

    return queryToModel(query.limitToLast(limit));
  }


  var once = function (eventType, queryModel) {
    debug(".queryOnce", eventType, queryModel);
    var query = refModel.query();

    return wrapOnce(eventType, query);
  }


  var on = function (eventType, queryModel) {
    debug(".on", eventType, queryModel);
    var query = refModel.query();

    return wrapOn(eventType, query);
  }


  var off = function (eventType, queryModel) {
    debug(".off", eventType, queryModel);
    var query = refModel.query();

    return wrapOff(eventType, query);
  }


  return {
    "startAt": F3(startAt),
    "endAt": F3(endAt),
    "equalTo": F3(equalTo),
    "limitToFirst": F2(limitToFirst),
    "limitToLast": F2(limitToLast),
    "once" : F2(once),
    "on" : F2(on)
    "off" : F2(off)
  }
}()
