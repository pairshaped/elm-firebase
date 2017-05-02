/*global firebase, _ucode$elm_firebase$Native_Shared, F2 */

var _ucode$elm_firebase$Native_Database = function () { // eslint-disable-line no-unused-vars

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Database"].concat(Array.prototype.slice.call(arguments))
    //
    // console.log.apply(console, args)
  }


  var databaseToModel = function (database) {
    var getDatabase = function () {
      return database
    }

    return {
      ctor: "Database",
      database: getDatabase
    }
  }


  var maybeWithDefault = function (fallback, maybe) {
    return maybe.ctor == "Nothing"
      ? fallback
      : maybe._0
  }


  // Firebase.database methods


  var init = function (appModel) {
    debug("Firebase.Database.init", appModel, appModel.app())
    var database = firebase.database(appModel.app())

    return databaseToModel(database)
  }


  var ref = function (maybePath, dbModel) {
    debug("Firebase.Database.ref", maybePath, dbModel)
    var reference
    if (maybePath.ctor == "Just") {
      reference = dbModel.database().ref(maybeWithDefault(undefined, maybePath))
    } else {
      reference = dbModel.database().ref()
    }

    return _ucode$elm_firebase$Native_Shared.referenceToModel(reference)
  }


  //


  return {
    "init": init,
    "ref": F2(ref)
  }
}()
