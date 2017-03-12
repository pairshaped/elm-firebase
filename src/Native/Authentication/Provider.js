/*global firebase, F2, F3 */

var _pairshaped$elm_firebase$Native_Authentication_Provider = function () { // eslint-disable-line no-unused-vars

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Authentication.Provider"].concat(Array.prototype.slice.call(arguments));
    //
    // console.log.apply(console, args);
  }


  var providerToModel = function (provider) {
    var getProvider = function () {
      return provider
    }

    return {
      ctor: "Provider",
      provider: getProvider
    }
  }

  var authCredentialToModel = function (authCredential) {
    var getAuthCredential = function () {
      return authCredential
    }

    return {
      ctor: "AuthCredential",
      authCredential: getAuthCredential
    }
  }


  // Authentication methods

  var providerId = function (providerModel) {
    debug(".providerId", providerModel)
    var provider = providerModel.provider()

    return provider.providerId
  }

  var tokenCredential = function (token, providerModel) {
    debug(".tokenCredential", token, providerModel)
    var provider = providerModel.provider()

    return authCredentialToModel(provider.credential(token))
  }

  var emailPasswordCredential = function (email, password, providerModel) {
    debug(".emailPasswordCredential", email, password, providerModel)
    var provider = providerModel.provider()

    return authCredentialToModel(provider.credential(email, password))
  }

  var email = function (dummy) {
    debug(".email", dummy)

    return providerToModel(new firebase.auth.EmailAuthProvider())
  }

  var facebook = function (dummy) {
    debug(".facebook", dummy)

    return providerToModel(new firebase.auth.FacebookAuthProvider())
  }

  var github = function (dummy) {
    debug(".github", dummy)

    return providerToModel(new firebase.auth.GithubAuthProvider())
  }

  var google = function (dummy) {
    debug(".google", dummy)

    return providerToModel(new firebase.auth.GoogleAuthProvider())
  }

  var twitter = function (dummy) {
    debug(".twitter", dummy)

    return providerToModel(new firebase.auth.TwitterAuthProvider())
  }

  var addScope = function (scopes, providerModel) {
    debug(".addScope", scopes, providerModel)
    var provider = providerModel.provider()

    provider.addScope(scopes)

    return providerToModel(provider)
  }

  var setCustomParameters = function (customOAuthParams, providerModel) {
    debug(".setCustomParameters", customOAuthParams, providerModel)
    var provider = providerModel.provider()

    provider.setCustomParameters(customOAuthParams)

    return providerToModel(provider)
  }

  //


  return {
    "providerId": providerId,
    "tokenCredential": F2(tokenCredential),
    "emailPasswordCredential": F3(emailPasswordCredential),
    "email": email,
    "facebook": facebook,
    "github": github,
    "google": google,
    "twitter": twitter,
    "addScope": F2(addScope),
    "setCustomParameters": F2(setCustomParameters)
  }
}()

