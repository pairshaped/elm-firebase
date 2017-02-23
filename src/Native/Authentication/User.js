var _pairshaped$elm_firebase$Native_Authentication_User = function () {

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Authentication"].concat(Array.prototype.slice.call(arguments));
    //
    // console.log.apply(console, args);
  };


  var authToModel = function (auth) {
    debug(".authToModel", auth);

    var getAuth = function () {
      return auth;
    };

    return {
      ctor: "Auth",
      auth: getAuth
    }
  }


  var userToModel = function (user) {
    debug(".userToModel", user);

    var getUser = function () {
      return user;
    };

    return {
      ctor: "User",
      user: getUser
    }
  }


  var errorToModel = function (err) {
    debug(".errorToModel", err);

    return {
      ctor: "User",
      _0: err.code,
      _1: err.message
    }
  }


  // Authentication methods

  var propertyMethods = [
    "displayName", "email", "emailVerified", "isAnonymous", "photoURL",
    "providerId", "uid"
  ].reduce(function (methods, attr) {
    methods[attr] = function (userModel) {
      debug("." + attr, userModel);
      var user = userModel.user();

      return user[attr];
    }

    return methods
  }, {})


  var reload = function (userModel) {
    debug(".reload", userModel);
    var user = userModel.user();

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      user.reload()
        .then(function () {
          callback(_elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" }));
        })
    })
  }


  var toJSON = function (userModel) {
    debug(".reload", userModel);
    var user = userModel.user();

    return user.toJSON()
  }


  //


  return {
    "displayName": propertyMethods.displayName,
    "email": propertyMethods.email,
    "emailVerified": propertyMethods.emailVerified,
    "isAnonymous": propertyMethods.isAnonymous,
    "photoURL": propertyMethods.photoURL,
    "providerId": propertyMethods.providerId,
    "uid": propertyMethods.uid,
    "reload": reload,
    "toJSON": toJSON
  }
}()
