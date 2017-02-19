var _mrozbarry$elm_firebase$Native_Database = function () {

  // Utilities

  var debug = function () {
    var args = ["Native.Firebase.debug"].concat(Array.prototype.slice.call(arguments));

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


  var queryToModel = function (query) {
    var getQuery = function () {
      return query;
    };

    return {
      ctor: "Query",
      query: getQuery
    };
  };


  var dataSnapshotToModel = function (dataSnapshot) {
    var getDataSnapshot = function () {
      return dataSnapshot;
    };

    return {
      ctor: "DataSnapshot",
      dataSnapshot: getDataSnapshot
    };
  };


  var maybeWithDefault = function (fallback, maybe) {
    if (maybe.ctor == "Nothing") {
      return fallback
    } else {
      return maybe._value
    }
  }


  var wrapOnce = function (eventType, source) {
    debug("Firebase.Database.wrapOnce", eventType, source);

    var firebaseEvent =
      eventType.ctor
      .replace(
        /([A-Z])/g,
        function (cap) { return "_" + cap.toLowerCase(); }
      )
      .replace(/^_/, "");

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.once(firebaseEvent, function (snapshot) {
        _elm_lang$core$Native_Scheduler.succeed(dataSnapshotToModel(snapshot))
      }, function (err) {
        var ctor =
          err.code
          .split("/")[1]
          .replace(/-([a-z])/g, function (char) { return char[1].toUpperCase(); })
          .replace(/^([a-z])/, function (firstChar) { return firstChar.toUpperCase(); });

        _elm_lang$core$Native_Scheduler.fail({ ctor: code, _0: err.message })
      })
    })
  }

  // Firebase.database methods

  var init = function (appModel) {
    debug("Firebase.Database.init", appModel);
    var database = firebase.database(appModel.app())

    return databaseToModel(database);
  };


  var root = function (dbModel) {
    debug("Firebase.Database.root", dbModel);
    var reference = dbModel.database().root();

    return referenceToModel(reference);
  }


  var ref = function (path, dbModel) {
    debug("Firebase.Database.ref", path, dbModel);
    var reference = dbModel.database().ref(path);

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


  // Firebase.database.query methods


  var startAt = function (value, maybeKey, queryModel) {
    debug("Firebase.Database.startAt", value, key, queryModel);
    var query = queryModel.query();

    return queryToModel(query.startAt(value, maybeWithDefault(undefined maybeKey)));
  }


  var endAt = function (value, maybeKey, queryModel) {
    debug("Firebase.Database.endAt", value, key, queryModel);
    var query = queryModel.query();

    return queryToModel(query.endAt(value, maybeWithDefault(undefined maybeKey)));
  }


  var equalTo = function (value, maybeKey, queryModel) {
    debug("Firebase.Database.equalTo", value, key, queryModel);
    var query = queryModel.query();

    return queryToModel(query.equalTo(value, maybeWithDefault(undefined maybeKey)));
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


  // Native export

  return {
    "init": init,
    "root": root,
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
    "queryOnce" : F2(queryOnce)
  };
}();
