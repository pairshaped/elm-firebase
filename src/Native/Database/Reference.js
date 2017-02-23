var _pairshaped$elm_firebase$Native_Database_Reference = function () {

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Database.Reference"].concat(Array.prototype.slice.call(arguments));
    //
    // console.log.apply(console, args);
  };


  // Callback handlers


  var wrapOnce = function (eventType, source) {
    debug(".wrapOnce", eventType, source);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      source.once(eventType, function (snapshot) {
        callback(
          _elm_lang$core$Native_Scheduler.succeed(
            _pairshaped$elm_firebase$Native_Shared.snapshotToModel(snapshot)
          )
        )

      }, function (err) {
        var ctor =
          err.code
          .split("/")[1]
          .replace(/-([a-z])/g, function (char) { return char[1].toUpperCase(); })
          .replace(/^([a-z])/, function (firstChar) { return firstChar.toUpperCase(); });

        callback(
          _elm_lang$core$Native_Scheduler.fail({ ctor: "Error", _0: err.code, _1: err.message })
        )

      })
    })
  }


  // Reference methods

  var child = function (path, refModel) {
    debug(".child", path, refModel);
    var reference = refModel.reference().child(path);

    return _pairshaped$elm_firebase$Native_Shared.referenceToModel(reference);
  };


  var set = function (json, refModel) {
    debug(".set", json, refModel);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel.reference().set(json, function () {
        _elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" })
      })
    })
  };


  var update = function (json, refModel) {
    debug(".update", json, refModel);

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel.reference().update(json, function () {
        _elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" })
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

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      ref.orderByChild(path)
    );
  }


  var orderByKey = function (refModel) {
    debug(".orderByKey", refModel);
    var ref = refModel.reference();

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      ref.orderByKey()
    );
  }


  var orderByPriority = function (refModel) {
    debug(".orderByPriority", refModel);
    var ref = refModel.reference();

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      ref.orderByPriority()
    );
  }


  var orderByValue = function (refModel) {
    debug(".orderByValue", refModel);
    var ref = refModel.reference();

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      ref.orderByValue()
    );
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


  var on = function (eventType, refModel, tagger) {
    debug(".on", eventType, refModel, tagger)
    var ref = refModel.reference();

    return _pairshaped$elm_firebase$Native_Shared.sourceOnSnapshot(eventType, ref, tagger);
  }


  var off = function (eventType, refModel) {
    debug(".off", eventType, refModel);
    var ref = refModel.reference();

    return _pairshaped$elm_firebase$Native_Shared.sourceOffSnapshot(eventType, ref);
  }


  // Helpers

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
    "on" : F3(on),
    "off" : F2(off)
  }
}()

