/*global global, require, _pairshaped$elm_firebase$Native_Shared, firebase, _elm_lang$core$Native_List, _elm_lang$core$Native_Scheduler, F2 */

/*
 * This is to get elm-test to load up firebase immediately. There currently isn't a good
 * solution, since it may conflict with tools like webpack, but this resolves my immediate
 * problem, and I'm open to PRs/other solutions.
 */
if (typeof global == "object" && !global.firebase && typeof require == "function") {
  global.firebase = require("firebase/firebase-node")
}


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

  var app = function (dummy) {
    debug("Firebase.app", dummy)

    try {
      var app = firebase.app()

      if (app) {
        return {
          ctor: "Just",
          _0: {
            ctor: "App",
            app: function () { return app }
          }
        }
      }
    } catch (e) {
      // No op
      // firebase.app() can throw an error if an app hasn't been initialized.
    }

    return { ctor: "Nothing" }
  }


  // Firebase.App methods


  var init = function (config) {
    debug("Firebase.init", config)
    var app = firebase.initializeApp(config)

    return _pairshaped$elm_firebase$Native_Shared.appToModel(app)
  }

  var initWithName = function (config, name) {
    debug("Firebase.initWithName", config, name)
    var app = firebase.initializeApp(config, name)

    return _pairshaped$elm_firebase$Native_Shared.appToModel(app)
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
    "app": app,
    "init": init,
    "initWithName": F2(initWithName),
    "deinit": deinit,
    "name": name,
    "options": options
  }
}()
