
/*global _elm_lang$core$Native_Scheduler, _pairshaped$elm_firebase$Native_Shared, F2, F3 */

var _pairshaped$elm_firebase$Native_Database_OnDisconnect = function () { // eslint-disable-line no-unused-vars

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Database.OnDisconnect"].concat(Array.prototype.slice.call(arguments))
    //
    // console.log.apply(console, args)
  }


  // OnDisconnect methods

  var cancel = function (model) {
    debug(".cancel")
    var onDisconnect = model.onDisconnect()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      onDisconnect
        .cancel()
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

  var remove = function (model) {
    debug(".remove")
    var onDisconnect = model.onDisconnect()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      onDisconnect
        .remove()
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

  var set = function (value, model) {
    debug(".set")
    var onDisconnect = model.onDisconnect()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      onDisconnect
        .set(value)
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

  var setWithPriority = function (value, priority, model) {
    debug(".setWithPriority")
    var onDisconnect = model.onDisconnect()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      onDisconnect
        .setWithPriority(value, priority)
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

  var update = function (value, model) {
    debug(".update")
    var onDisconnect = model.onDisconnect()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      onDisconnect
        .update(value)
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

  //

  return {
    "cancel": cancel,
    "remove": remove,
    "set": F2(set),
    "setWithPriority": F3(setWithPriority),
    "update": F2(update)
  }
}()
