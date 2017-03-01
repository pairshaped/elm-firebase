/*global _pairshaped$elm_firebase$Native_Shared, _elm_lang$core$Native_Scheduler, F2, F3 */

var _pairshaped$elm_firebase$Native_Database_Reference = function () { // eslint-disable-line no-unused-vars

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Database.Reference"].concat(Array.prototype.slice.call(arguments))
    //
    // console.log.apply(console, args)
  }


  // Reference methods


  var child = function (path, refModel) {
    debug(".child", path, refModel)
    var reference = refModel.reference().child(path)

    return _pairshaped$elm_firebase$Native_Shared.referenceToModel(reference)
  }


  var set = function (json, refModel) {
    debug(".set", json, refModel)

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel
        .reference()
        .set(json)
        .then(function () {
          callback(
              _elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" })
            )
        })
        .catch(function (err) {
          callback(
              _elm_lang$core$Native_Scheduler.fail(_pairshaped$elm_firebase$Native_Shared.errorToModel(err))
            )
        })
    })
  }


  var update = function (json, refModel) {
    debug(".update", json, refModel)

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel
        .reference()
        .update(json)
        .then(function () {
          callback(
            _elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" })
          )
        })
        .catch(function (err) {
          callback(
              _elm_lang$core$Native_Scheduler.fail(_pairshaped$elm_firebase$Native_Shared.errorToModel(err))
            )
        })
    })
  }


  var push = function (refModel) {
    debug(".remove", refModel)
    var ref = refModel.reference()

    return _pairshaped$elm_firebase$Native_Shared.referenceToModel(ref.push())
  }


  var remove = function (refModel) {
    debug(".remove", refModel)

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      refModel.reference().remove(function () {
        callback(
          _elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" })
        )
      })
    })
  }


  var orderByChild = function (path, refModel) {
    debug(".orderByChild", path, refModel)
    var ref = refModel.reference()

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      ref.orderByChild(path)
    )
  }


  var orderByKey = function (refModel) {
    debug(".orderByKey", refModel)
    var ref = refModel.reference()

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      ref.orderByKey()
    )
  }


  var orderByPriority = function (refModel) {
    debug(".orderByPriority", refModel)
    var ref = refModel.reference()

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      ref.orderByPriority()
    )
  }


  var orderByValue = function (refModel) {
    debug(".orderByValue", refModel)
    var ref = refModel.reference()

    return _pairshaped$elm_firebase$Native_Shared.queryToModel(
      ref.orderByValue()
    )
  }


  var toString = function (refModel) {
    debug(".toString", refModel)
    var ref = refModel.reference()

    return ref.toString()
  }


  var once = function (eventType, refModel) {
    debug(".once", eventType, refModel)
    var ref = refModel.reference()

    return _pairshaped$elm_firebase$Native_Shared.sourceOnceSnapshot(eventType, ref)
  }


  var on = function (eventType, refModel, tagger) {
    debug(".on", eventType, refModel, tagger)
    var ref = refModel.reference()

    return _pairshaped$elm_firebase$Native_Shared.sourceOnSnapshot(eventType, ref, tagger)
  }


  var off = function (eventType, refModel) {
    debug(".off", eventType, refModel)
    var ref = refModel.reference()

    return _pairshaped$elm_firebase$Native_Shared.sourceOffSnapshot(eventType, ref)
  }


  // Helpers


  return {
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
    "once" : F2(once),
    "on" : F3(on),
    "off" : F2(off)
  }
}()

