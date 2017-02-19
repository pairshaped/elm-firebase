var _mrozbarry$elm_firebase$Native_Firebase = function () {
  var debug = function () {
    // var args = ["Native.Firebase.debug"].concat(Array.prototype.slice.call(arguments));
    //
    // console.log.apply(console, arguments);
  };


  // Firebase methods


  var sdkVersion = firebase.SDK_VERSION


  var apps = function (dummy) {
    debug("Firebase.apps", dummy);
    return _elm_lang$core$Native_List.fromArray(firebase.apps);
  };


  // Firebase.App methods


  var init = function (config) {
    debug("Firebase.init", config);
    var app = firebase.initializeApp(config);

    var getApp = function () {
      return app;
    }

    return {
      ctor: "App",
      app: getApp
    };
  };

  var initWithName = function (config, name) {
    debug("Firebase.initWithName", config, name);
    var app = firebase.initializeApp(config, name);

    var getApp = function () {
      return app;
    }

    return {
      ctor: "App",
      app: getApp
    };
  };


  var name = function (model) {
    debug("Firebase.name", model);
    return model.app().name;
  };


  var options = function (model) {
    debug("Firebase.options", model);
    return model.app().options;
  };


  return {
    "sdkVersion": sdkVersion,
    "apps": apps,
    "init": init,
    "initWithName": F2(initWithName),
    "name": name,
    "options": options
  };
}();
