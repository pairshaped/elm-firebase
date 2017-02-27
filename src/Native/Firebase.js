/*global firebase, _elm_lang$core$Native_List, _elm_lang$core$Native_Scheduler, F2 */

console.log("Firebase elm wrapper native code--------------")

var _pairshaped$elm_firebase$Native_Firebase = function () { // eslint-disable-line no-unused-vars
  var debug = function () {
    // var args = ["Native.Firebase.debug"].concat(Array.prototype.slice.call(arguments))
    //
    // console.log.apply(console, arguments)
  }


  // Firebase methods


  var sdkVersion = firebase.SDK_VERSION


  var apps = function (dummy) {
    debug("Firebase.apps", dummy)
    return _elm_lang$core$Native_List.fromArray(firebase.apps)
  }


  // Firebase.App methods


  var init = function (config) {
    debug("Firebase.init", config)
    var app = firebase.initializeApp(config)

    var getApp = function () {
      return app
    }

    return {
      ctor: "App",
      app: getApp
    }
  }

  var initWithName = function (config, name) {
    debug("Firebase.initWithName", config, name)
    var app = firebase.initializeApp(config, name)

    var getApp = function () {
      return app
    }

    return {
      ctor: "App",
      app: getApp
    }
  }


  var deinit = function (model) {
    debug("Firebase.deinit", model)
    var app = model.app()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      app.delete().then(function () {
        callback(
          _elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" })
        )
      })
    })
  }


  var name = function (model) {
    debug("Firebase.name", model)
    return model.app().name
  }


  var options = function (model) {
    debug("Firebase.options", model)
    return model.app().options
  }


  return {
    "sdkVersion": sdkVersion,
    "apps": apps,
    "init": init,
    "initWithName": F2(initWithName),
    "deinit": deinit,
    "name": name,
    "options": options
  }
}()
