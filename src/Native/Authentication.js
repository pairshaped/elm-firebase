/*global firebase, _elm_lang$core$Native_Scheduler, _pairshaped$elm_firebase$Native_Shared, F2, F3 */

var _pairshaped$elm_firebase$Native_Authentication = function () { // eslint-disable-line no-unused-vars

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Authentication"].concat(Array.prototype.slice.call(arguments))
    //
    // console.log.apply(console, args)
  }


  var authToModel = function (auth) {
    var getAuth = function () {
      return auth
    }

    return {
      ctor: "Auth",
      auth: getAuth
    }
  }


  var userToModel = function (user) {
    debug(".userToModel", user)

    var getUser = function () {
      return user
    }

    return {
      ctor: "User",
      user: getUser
    }
  }


  // Authentication methods


  var init = function (appModel) {
    debug(".init", appModel)
    var app = appModel.app()

    return authToModel(firebase.auth(app))
  }


  var app = function (authModel) {
    debug(".app", authModel)
    var auth = authModel.auth()

    return _pairshaped$elm_firebase$Native_Shared.appToModel(auth.app)
  }


  var currentUser = function (authModel) {
    debug(".currentUser", authModel)
    var auth = authModel.auth()

    return userToModel(
      auth.currentUser
        ? { ctor: "Just", _0: auth.currentUser }
        : { ctor: "Nothing }"}
    )
  }


  var confirmPasswordReset = function (code, password, authModel) {
    debug(".confirmPasswordReset", code, password, authModel)
    var auth = authModel.auth()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.confirmPasswordReset(code, password)
        .then(function () {
          callback(
            _elm_lang$core$Native_Scheduler.succeed(
              { ctor: "_Tuple0" }
            )
          )
        })
        .catch(function (err) {
          callback(
            _elm_lang$core$Native_Scheduler.fail(_pairshaped$elm_firebase$Native_Shared.errorToModel(err))
          )
        })
    })
  }


  var createUserWithEmailAndPassword = function (email, password, authModel) {
    debug(".createUserWithEmailAndPassword", email, password, authModel)
    var auth = authModel.auth()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.confirmPasswordReset(email, password)
        .then(function (user) {
          callback(
            _elm_lang$core$Native_Scheduler.succeed(
              userToModel(user)
            )
          )
        })
        .catch(function (err) {
          callback(
            _elm_lang$core$Native_Scheduler.fail(_pairshaped$elm_firebase$Native_Shared.errorToModel(err))
          )
        })
    })
  }


  var fetchProvidersForEmail = function (email, authModel) {
    debug(".fetchProvidersForEmail", email, authModel)
    var auth = authModel.auth()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.fetchProvidersForEmail(email)
        .then(function (providers) {
          callback(
            _elm_lang$core$Native_Scheduler.succeed(providers)
          )
        })
    })
  }

  var onAuthStateChanged = function (authModel, tagger) {
    debug(".onAuthStateChanged", authModel)
    var auth = authModel.auth()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      if (!auth.__elmFirebaseAuthChangedUnsubscribeFn) {
        auth.__elmFirebaseAuthChangedUnsubscribeFn = auth.onAuthStateChanged(function (user) {
          var maybeUserModel = user ?
            { ctor: "Just", _0: userToModel(user) } :
            { ctor: "Nothing" }

          _elm_lang$core$Native_Scheduler.rawSpan(
            tagger(maybeUserModel)
          )
        })
      }
      callback(_elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" }))
    })
  }

  var offAuthStateChanged = function (authModel) {
    debug(".offAuthStateChanged", authModel)
    var auth = authModel.auth()

    if (auth.__elmFirebaseAuthChangedUnsubscribeFn) {
      auth.__elmFirebaseAuthChangedUnsubscribeFn()
      delete auth.__elmFirebaseAuthChangedUnsubscribeFn
    }

    return { ctor: "_Tuple0" }
  }

  var sendPasswordResetEmail = function (email, authModel) {
    debug(".sendPasswordResetEmail", email, authModel)
    var auth = authModel.auth()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.sendPasswordResetEmail(email)
        .then(function () {
          callback(
            _elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" })
          )
        })
    })
  }


  var _signInHandler = function (promise, callback) {
    promise
      .then(function (user) {
        callback(
          _elm_lang$core$Native_Scheduler.succeed(userToModel(user))
        )
      })
      .catch(function (err) {
        callback(
          _elm_lang$core$Native_Scheduler.fail(_pairshaped$elm_firebase$Native_Shared.errorToModel(err))
        )
      })
  }


  var signInAnonymously = function (authModel) {
    debug(".signInAnonymously", authModel)
    var auth = authModel.auth()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      _signInHandler(auth.signInAnonymously(), callback)
    })
  }


  var signInWithEmailAndPassword = function (email, password, authModel) {
    debug(".signInWithEmailAndPassword", email, password, authModel)
    var auth = authModel.auth()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      _signInHandler(auth.signInWithEmailAndPassword(email, password), callback)
    })
  }


  var signOut = function (authModel) {
    debug(".signOut", authModel)
    var auth = authModel.auth()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.signOut()
        .then(function () {
          callback(_elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" }))
        })
    })
  }


  var verifyPasswordResetCode = function (code, authModel) {
    debug(".verifyPasswordResetCode", code, authModel)
    var auth = authModel.auth()

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.verifyPasswordResetCode(code)
        .then(function (email) {
          callback(
            _elm_lang$core$Native_Scheduler.succeed(email)
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
    "init": init,
    "app": app,
    "currentUser": currentUser,
    "confirmPasswordReset": F3(confirmPasswordReset),
    "createUserWithEmailAndPassword": F3(createUserWithEmailAndPassword),
    "fetchProvidersForEmail": F2(fetchProvidersForEmail),
    "onAuthStateChanged": F2(onAuthStateChanged),
    "offAuthStateChanged": offAuthStateChanged,
    "sendPasswordResetEmail": F2(sendPasswordResetEmail),
    "signInAnonymously": signInAnonymously,
    "signInWithEmailAndPassword": F3(signInWithEmailAndPassword),
    "signOut": signOut,
    "verifyPasswordResetCode": F2(verifyPasswordResetCode)
  }
}()
