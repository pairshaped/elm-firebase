var _pairshaped$elm_firebase$Native_Authentication = function () {

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Authentication"].concat(Array.prototype.slice.call(arguments));
    //
    // console.log.apply(console, args);
  };


  var authToModel = function (auth) {
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


  var init = function (appModel) {
    debug(".init", appModel);
    var app = appModel.app();

    return firebase.auth(app);
  }


  var currentUser = function (authModel) {
    debug(".currentUser", authModel);
    var auth = authModel.auth();

    return userToModel(
      auth.currentUser
        ? { ctor: "Just", _0: auth.currentUser }
        : { ctor: "Nothing }"}
    );
  }


  var confirmPasswordReset = function (code, password, authModel) {
    debug(".confirmPasswordReset", code, password, authModel);
    var auth = authModel.auth();

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.confirmPasswordReset(code, password)
        .then(function () {
          callback(
            _elm_lang$core$Native_Scheduler.succeed(
              { ctor: "_Tuple0" }
            )
          );
        })
        .catch(function (err) {
           _elm_lang$core$Native_Scheduler.fail(errorToModel(err))
        });
    });
  }


  var createUserWithEmailAndPassword = function (email, password, authModel) {
    debug(".createUserWithEmailAndPassword", email, password, authModel);
    var auth = authModel.auth();

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.confirmPasswordReset(code, password)
        .then(function (user) {
          callback(
            _elm_lang$core$Native_Scheduler.succeed(
              userToModel(user)
            )
          );
        })
        .catch(function (err) {
           _elm_lang$core$Native_Scheduler.fail(errorToModel(err))
        })
    });
  }


  var fetchProvidersForEmail = function (email, authModel) {
    debug(".fetchProvidersForEmail", email, authModel);
    var auth = authModel.auth();

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.fetchProvidersForEmail(email)
        .then(function (providers) {
          callback(
            _elm_lang$core$Native_Scheduler.succeed(providers)
          );
        })
    });
  }

  var sendPasswordResetEmail = function (email, authModel) {
    debug(".sendPasswordResetEmail", email, authModel);
    var auth = authModel.auth();

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.sendPasswordResetEmail(email)
        .then(function () {
          callback(
            _elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" })
          );
        })
    });
  }


  var _signInHandler = function (promise, callback) {
    promise
      .then(function (user) {
        callback(
          _elm_lang$core$Native_Scheduler.succeed(userToModel(user))
        );
      })
      .catch(function (err) {
        callback(
          _elm_lang$core$Native_Scheduler.fail(errorToModel(err))
        );
      })
  }


  var signInAnonymously = function (authModel) {
    debug(".signInAnonymously", authModel);
    var auth = authModel.auth();

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      _signInHandler(auth.signInAnonymously(), callback)
    });
  }


  var signInWithEmailAndPassword = function (email, password, authModel) {
    debug(".signInWithEmailAndPassword", email, password, authModel);
    var auth = authModel.auth();

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      _signInHandler(auth.signInWithEmailAndPassword(email, password), callback)
    });
  }


  var signOut = function (email, password, authModel) {
    debug(".signOut", email, password, authModel);
    var auth = authModel.auth();

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.signOut()
        .then(function () {
          _elm_lang$core$Native_Scheduler.succeed({ ctor: "_Tuple0" })
        })
    });
  }


  var verifyPasswordResetCode = function (code, authModel) {
    debug(".verifyPasswordResetCode", email, password, authModel);
    var auth = authModel.auth();

    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      auth.verifyPasswordResetCode(code)
        .then(function (email) {
          _elm_lang$core$Native_Scheduler.succeed(email)
        })
        .catch(function (err) {
           _elm_lang$core$Native_Scheduler.fail(errorToModel(err))
        })
    });
  }


  //


  return {
    "init": init,
    "confirmPasswordReset": F3(confirmPasswordReset),
    "createUserWithEmailAndPassword": F3(createUserWithEmailAndPassword),
    "fetchProvidersForEmail": F2(fetchProvidersForEmail),
    "sendPasswordResetEmail": F2(sendPasswordResetEmail),
    "signInAnonymously": signInAnonymously,
    "signInWithEmailAndPassword": F3(signInWithEmailAndPassword),
    "signOut": signOut,
    "verifyPasswordResetCode": F2(verifyPasswordResetCode)
  }
}()
