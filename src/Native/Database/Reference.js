var _mrozbarry$elm_firebase$Native_Database_Reference = function () {

  // Utilities

  var debug = function () {
    var args = ["Native.Firebase.Database.Reference"].concat(Array.prototype.slice.call(arguments));

    console.log.apply(console, args);
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


  // Callback handlers


  var wrapOnce = function (eventType, source) {
    debug(".wrapOnce", eventType, source);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.once(eventType, function (snapshot) {
        debug(".wrapOnce.succeed", eventType, source, snapshot)
        callback(_elm_lang$core$Native_Scheduler.succeed(snapshotToModel(snapshot)))

      }, function (err) {
        var ctor =
          err.code
          .split("/")[1]
          .replace(/-([a-z])/g, function (char) { return char[1].toUpperCase(); })
          .replace(/^([a-z])/, function (firstChar) { return firstChar.toUpperCase(); });

        debug(".wrapOnce.fail", eventType, source, err)
        callback(_elm_lang$core$Native_Scheduler.fail({ ctor: "Error", _0: err.code, _1: err.message }))

      })
    })
  }


  var onCallback = function (eventType, reference, nativeCallback, snapshot, prevKey) {
    debug(".onCallback", { eventType, reference, nativeCallback, snapshot, prevKey })
    return nativeCallback(
      _elm_lang$core$Native_Scheduler.succeed(snapshotToModel(snapshot, prevKey))
    )
  }


  var wrapOn = function (eventType, source) {
    debug(".wrapOn", eventType, source);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.on(eventType, onCallback.bind(window, eventType, source, callback));
    })
  }


  var wrapOff = function (eventType, source) {
    debug(".wrapOff", eventType, source);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.off(eventType, onCallbackWithPrevKey)
    })
  }


  // Reference methods

  var child = function (path, refModel) {
    debug(".child", path, refModel);
    var reference = refModel.reference().child(path);

    return referenceToModel(reference);
  };


  var set = function (json, refModel) {
    debug(".set", json, refModel);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel.reference().set(json, function () {
        _elm_lang$core$Native_Scheduler.succeed([])
      })
    })
  };


  var update = function (json, refModel) {
    debug(".update", json, refModel);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel.reference().update(json, function () {
        _elm_lang$core$Native_Scheduler.succeed([])
      })
    })
  };


  var remove = function (refModel) {
    debug(".remove", json, refModel);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel.reference().remove(function () {
        _elm_lang$core$Native_Scheduler.succeed([])
      })
    })
  };


  var orderByChild = function (path, refModel) {
    debug(".orderByChild", order, refModel);
    var ref = refModel.reference();

    return queryToModel(ref.orderByChild(path));
  }


  var orderByKey = function (refModel) {
    debug(".orderByKey", refModel);
    var ref = refModel.reference();

    return queryToModel(ref.orderByKey());
  }


  var orderByPriority = function (refModel) {
    debug(".orderByPriority", refModel);
    var ref = refModel.reference();

    return queryToModel(ref.orderByPriority());
  }


  var orderByValue = function (refModel) {
    debug(".orderByValue", refModel);
    var ref = refModel.reference();

    return queryToModel(ref.orderByValue());
  };


  var toString = function (refModel) {
    debug(".toString", refModel);
    var ref = refModel.reference();

    return ref.toString();
  }


  var once = function (eventType, refModel) {
    debug(".once", eventType, refModel);
    var ref = refModel.reference();

    return wrapOnce(eventType, ref);
  }


  var on = function (eventType, refModel) {
    debug(".on", eventType, refModel);
    var ref = refModel.reference();

    return wrapOn(eventType, ref);
  }


  var off = function (eventType, refModel) {
    debug(".off", eventType, refModel);
    var ref = refModel.reference();

    return wrapOff(eventType, ref);
  }


  return {
    "child": F2(child),
    "set": F2(set),
    "update": F2(update),
    "remove": remove,
    "orderByChild": F2(orderByChild),
    "orderByKey": orderByKey,
    "orderByPriority": orderByPriority,
    "orderByValue": orderByValue,
    "toString" : toString,
    "once" : F2(once),
    "on" : F2(on),
    "off" : F2(off)
  }
}()

