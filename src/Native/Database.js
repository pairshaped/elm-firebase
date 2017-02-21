var _mrozbarry$elm_firebase$Native_Database = function () {

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.debug"].concat(Array.prototype.slice.call(arguments));
    //
    // console.log.apply(console, arguments);
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


  var queryToModel = function (query) {
    var getQuery = function () {
      return query;
    };

    return {
      ctor: "Query",
      query: getQuery
    };
  };


  var snapshotToModel = function (snapshot, prevKey) {
    var getDataSnapshot = function () {
      return snapshot;
    };

    return {
      ctor: "DataSnapshot",
      snapshot: getDataSnapshot,
      prevKey: prevKey
    };
  };


  var maybeWithDefault = function (fallback, maybe) {
    return maybe.ctor == "Nothing"
      ? fallback
      : maybe._0
  }

  var variableToMaybe = function (variable) {
    return variable
      ? { ctor: "Just", _0 : variable }
      : { ctor: "Nothing" }
  }


  var eventTypeToFirebaseEvent = function (eventType) {
    debug("Firebase.Database.eventTypeToFirebaseEvent", eventType);

    var firebaseEvent =
      eventType.ctor
      .replace(
        /([A-Z])/g,
        function (cap) { return "_" + cap.toLowerCase(); }
      )
      .replace(/^_/, "");

    return firebaseEvent
  }


  var wrapOnce = function (eventType, source) {
    debug("Firebase.Database.wrapOnce", eventType, source);
    var firebaseEvent = eventTypeToFirebaseEvent(eventType)

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.once(firebaseEvent, function (snapshot) {
        debug("Firebase.Database.wrapOnce.succeed", firebaseEvent, source, snapshot)
        callback(_elm_lang$core$Native_Scheduler.succeed(snapshotToModel(snapshot)))
      }, function (err) {
        var ctor =
          err.code
          .split("/")[1]
          .replace(/-([a-z])/g, function (char) { return char[1].toUpperCase(); })
          .replace(/^([a-z])/, function (firstChar) { return firstChar.toUpperCase(); });

        debug("Firebase.Database.wrapOnce.fail", firebaseEvent, source, err)
        callback(_elm_lang$core$Native_Scheduler.fail({ ctor: code, _0: err.message }))
      })
    })
  }


  var onCallback = function (nativeCallback, snapshot, prevKey) {
    var maybePrevKey = variableToMaybe(prevKey)

    return nativeCallback(
      _elm_lang$core$Native_Scheduler.succeed(
        snapshotToModel(snapshot, prevKey)
      )
    )
  }


  var wrapOn = function (eventType, source) {
    debug("Firebase.Database.wrapOn", eventType, source);
    var firebaseEvent = eventTypeToFirebaseEvent(eventType)

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.on(firebaseEvent, onCallback.bind(this, callback))
    })
  }

  var wrapOff = function (eventType, source) {
    debug("Firebase.Database.wrapOff", eventType, source);
    var firebaseEvent = eventTypeToFirebaseEvent(eventType)

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.off(firebaseEvent, onCallbackWithPrevKey)
    })
  }



  // Firebase.database methods

  var init = function (appModel) {
    debug("Firebase.Database.init", appModel, appModel.app());
    var database = firebase.database(appModel.app())

    return databaseToModel(database);
  };


  var ref = function (maybePath, dbModel) {
    debug("Firebase.Database.ref", maybePath, dbModel);
    var reference;
    if (maybePath.ctor == "Just") {
      reference = dbModel.database().ref(maybeWithDefault(undefined, maybePath));
    } else {
      reference = dbModel.database().ref()
    }

    return referenceToModel(reference);
  };


  // Firebase.database.ref methods


  var child = function (path, refModel) {
    debug("Firebase.Database.child", path, refModel);
    var reference = refModel.reference().child(path);

    return referenceToModel(reference);
  };


  var set = function (json, refModel) {
    debug("Firebase.Database.set", json, refModel);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel.reference().set(json, function () {
        _elm_lang$core$Native_Scheduler.succeed(true)
      })
    })
  };


  var update = function (json, refModel) {
    debug("Firebase.Database.update", json, refModel);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel.reference().update(json, function () {
        _elm_lang$core$Native_Scheduler.succeed(true)
      })
    })
  };


  var remove = function (refModel) {
    debug("Firebase.Database.remove", json, refModel);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel.reference().remove(function () {
        _elm_lang$core$Native_Scheduler.succeed(true)
      })
    })
  };


  var orderByChild = function (path, refModel) {
    debug("Firebase.Database.orderByChild", order, refModel);
    var ref = refModel.reference();

    return queryToModel(ref.orderByChild(path));
  }


  var orderByKey = function (refModel) {
    debug("Firebase.Database.orderByKey", refModel);
    var ref = refModel.reference();

    return queryToModel(ref.orderByKey());
  }


  var orderByPriority = function (refModel) {
    debug("Firebase.Database.orderByPriority", refModel);
    var ref = refModel.reference();

    return queryToModel(ref.orderByPriority());
  }


  var orderByValue = function (refModel) {
    debug("Firebase.Database.orderByValue", refModel);
    var ref = refModel.reference();

    return queryToModel(ref.orderByValue());
  };


  var toString = function (refModel) {
    debug("Firebase.Database.orderByValue", refModel);
    var ref = refModel.reference();

    return ref.toString();
  }


  var referenceOnce = function (eventType, refModel) {
    debug("Firebase.Database.referenceOnce", eventType, refModel);
    var ref = refModel.reference();

    return wrapOnce(eventType, ref);
  }


  var referenceOn = function (eventType, refModel) {
    debug("Firebase.Database.referenceOn", eventType, refModel);
    var ref = refModel.reference();

    return wrapOnce(eventType, ref);
  }


  // Firebase.database.query methods


  var startAt = function (value, maybeKey, queryModel) {
    debug("Firebase.Database.startAt", value, key, queryModel);
    var query = queryModel.query();

    return queryToModel(query.startAt(value, maybeWithDefault(undefined, maybeKey)));
  }


  var endAt = function (value, maybeKey, queryModel) {
    debug("Firebase.Database.endAt", value, key, queryModel);
    var query = queryModel.query();

    return queryToModel(query.endAt(value, maybeWithDefault(undefined, maybeKey)));
  }


  var equalTo = function (value, maybeKey, queryModel) {
    debug("Firebase.Database.equalTo", value, key, queryModel);
    var query = queryModel.query();

    return queryToModel(query.equalTo(value, maybeWithDefault(undefined, maybeKey)));
  }


  var limitToFirst = function (limit, queryModel) {
    debug("Firebase.Database.limitToFirst", limit, queryModel);
    var query = queryModel.query();

    return queryToModel(query.limitToFirst(limit));
  }


  var limitToLast = function (limit, queryModel) {
    debug("Firebase.Database.limitToLast", limit, queryModel);
    var query = queryModel.query();

    return queryToModel(query.limitToLast(limit));
  }


  var queryOnce = function (eventType, queryModel) {
    debug("Firebase.Database.queryOnce", eventType, queryModel);
    var query = refModel.query();

    return wrapOnce(eventType, query);
  }

  // Firebase.database.snapshot methods

  var snapshotKey = function (snapshotModel) {
    debug("Firebase.Database.snapshotKey", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return variableToMaybe(snapshot.key);
  }

  var snapshotRef = function (snapshotModel) {
    debug("Firebase.Database.snapshotRef", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return referenceToModel(snapshot.ref);
  }

  var snapshotChild = function (path, snapshotModel) {
    debug("Firebase.Database.snapshotChild", path, snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshotToModel(snapshot.child(path));
  }

  var snapshotExists = function (snapshotModel) {
    debug("Firebase.Database.snapshotExists", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshot.exists()
      ? { ctor: "True" }
      : { ctor: "False" }
  }

  var snapshotExportVal = function (snapshotModel) {
    debug("Firebase.Database.snapshotExportVal", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshot.exportVal();
  }

  var snapshotGetPriority = function (snapshotModel) {
    debug("Firebase.Database.snapshotGetPriority", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshot.getPriority();
  }

  var snapshotValue = function (snapshotModel) {
    debug("Firebase.Database.snapshotValue", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshot.val();
  }

  var snapshotPrevKey = function (snapshotModel) {
    debug("Firebase.Database.snapshotPrevKey", snapshotModel);

    return snapshotModel.prevKey;
  }


  // Native export

  return {
    "init": init,
    "ref": F2(ref),
    "child": F2(child),
    "set": F2(set),
    "update": F2(update),
    "remove": remove,
    "orderByChild": F2(orderByChild),
    "orderByKey": orderByKey,
    "orderByPriority": orderByPriority,
    "orderByValue": orderByValue,
    "toString" : toString,
    "referenceOnce" : F2(referenceOnce),
    "startAt": F3(startAt),
    "endAt": F3(endAt),
    "equalTo": F3(equalTo),
    "limitToFirst": F2(limitToFirst),
    "limitToLast": F2(limitToLast),
    "queryOnce" : F2(queryOnce),
    "snapshotKey": snapshotKey,
    "snapshotRef": snapshotRef,
    "snapshotChild": F2(snapshotChild),
    "snapshotExists": snapshotExists,
    "snapshotExportVal": snapshotExportVal,
    "snapshotGetPriority": snapshotGetPriority,
    "snapshotValue": snapshotValue,
    "snapshotPrevKey": snapshotPrevKey
  };
}();
