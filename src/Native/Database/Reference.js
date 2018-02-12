/*global _pairshaped$elm_firebase$Native_Shared, _elm_lang$core$Native_Scheduler, F2, F3 */

var _pairshaped$elm_firebase$Native_Database_Reference = function () { // eslint-disable-line no-unused-vars

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Database.Reference"].concat(Array.prototype.slice.call(arguments))
    //
    // console.log.apply(console, args)
  }

  // shorthand for native APIs
  var unit = {ctor: '_Tuple0'};
  var nativeBinding = _elm_lang$core$Native_Scheduler.nativeBinding;
  var succeed = _elm_lang$core$Native_Scheduler.succeed;
  var fail = _elm_lang$core$Native_Scheduler.fail;

  // shorthand for shared APIs
  var nativeShared = _pairshaped$elm_firebase$Native_Shared;

  // Reference methods


  var key = function (refModel) {
    debug(".key", refModel)
    var reference = refModel.reference()

    return reference.key
  }

  var parent = function (refModel) {
    debug(".parent", refModel)
    var reference = refModel.reference()

    return reference.parent
  }

  var child = function (path, refModel) {
    debug(".child", path, refModel)
    var reference = refModel.reference().child(path)

    return nativeShared.referenceToModel(reference)
  }


  var set = function (json, refModel) {
    debug(".set", json, refModel)

    return nativeBinding(function (callback) {
      refModel
        .reference()
        .set(json)
        .then(function () {
          callback(
              succeed(unit)
            )
        })
        .catch(function (err) {
          callback(
              fail(nativeShared.errorToModel(err))
            )
        })
    })
  }


  var update = function (json, refModel) {
    debug(".update", json, refModel)

    return nativeBinding(function (callback) {
      refModel
        .reference()
        .update(json)
        .then(function () {
          callback(
            succeed(unit)
          )
        })
        .catch(function (err) {
          callback(
              fail(nativeShared.errorToModel(err))
            )
        })
    })
  }


  var push = function (refModel) {
    debug(".remove", refModel)
    var ref = refModel.reference()

    return nativeShared.referenceToModel(ref.push())
  }


  var remove = function (refModel) {
    debug(".remove", refModel)

    return nativeBinding(function (callback) {
      refModel.reference().remove(function () {
        callback(
          succeed(unit)
        )
      })
    })
  }


  var orderByChild = function (path, refModel) {
    debug(".orderByChild", path, refModel)
    var ref = refModel.reference()

    return nativeShared.queryToModel(
      ref.orderByChild(path)
    )
  }


  var orderByKey = function (refModel) {
    debug(".orderByKey", refModel)
    var ref = refModel.reference()

    return nativeShared.queryToModel(
      ref.orderByKey()
    )
  }


  var orderByPriority = function (refModel) {
    debug(".orderByPriority", refModel)
    var ref = refModel.reference()

    return nativeShared.queryToModel(
      ref.orderByPriority()
    )
  }


  var orderByValue = function (refModel) {
    debug(".orderByValue", refModel)
    var ref = refModel.reference()

    return nativeShared.queryToModel(
      ref.orderByValue()
    )
  }


  var toString = function (refModel) {
    debug(".toString", refModel)
    var ref = refModel.reference()

    return ref.toString()
  }


  var onDisconnect = function (refModel) {
    debug(".onDisconnect", refModel)
    var ref = refModel.reference()

    var getOnDisconnect = function () {
      return ref.onDisconnect()
    }

    // Reference is the only thing that uses .onDisconnect(), so
    // I'm not going to make a helper for it.
    return { ctor: "OnDisconnect", onDisconnect: getOnDisconnect }
  }


  var once = function (eventType, refModel) {
    debug(".once", eventType, refModel)
    var ref = refModel.reference()

    return nativeShared.sourceOnceSnapshot(eventType, ref)
  }


  var on = function (eventType, refModel, tagger) {
    debug(".on", eventType, refModel, tagger)
    var ref = refModel.reference()

    return nativeShared.sourceOnSnapshot(eventType, ref, tagger)
  }


  var off = function (eventType, refModel) {
    debug(".off", eventType, refModel)
    var ref = refModel.reference()

    return nativeShared.sourceOffSnapshot(eventType, ref)
  }

  var isEqual = function (refModelA, refModelB) {
    debug(".isEqual", refModelA, refModelB)

    return refModelA.reference().isEqual(refModelB.reference())
  }


  // Helpers


  return {
    "key": key,
    "parent": parent,
    "child": F2(child),
    "set": F2(set),
    "update": F2(update),
    "push": push,
    "remove": remove,
    "orderByChild": F2(orderByChild),
    "orderByKey": orderByKey,
    "orderByPriority": orderByPriority,
    "orderByValue": orderByValue,
    "toString" : toString,
    "onDisconnect": onDisconnect,
    "once": F2(once),
    "on": F3(on),
    "off": F2(off),
    "isEqual": F2(isEqual)
  }
}()
