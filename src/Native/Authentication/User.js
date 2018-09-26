/*global _elm_lang$core$Native_Scheduler */

var _ucode$elm_firebase$Native_Authentication_User = function () { // eslint-disable-line no-unused-vars

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Authentication"].concat(Array.prototype.slice.call(arguments));
    //
    // console.log.apply(console, args);
  }


  // Authentication methods

  var propertyMethods = [
    "displayName", "email", "emailVerified", "isAnonymous", "photoURL",
    "providerId", "uid"
  ].reduce(function (methods, attr) {
    methods[attr] = function (userModel) {
      debug("." + attr, userModel)
      var user = userModel.user()

      return user[attr]
    }

    return methods
  }, {})


  var reload = function (userModel) {
    debug(".reload", userModel)
    var user = userModel.user()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      user.reload()
        .then(function () {
          callback(_elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" }))
        })
    })
  }


  var toJSON = function (userModel) {
    debug(".reload", userModel)
    var user = userModel.user()

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
