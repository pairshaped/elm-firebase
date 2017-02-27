/*global _pairshaped$elm_firebase$Native_Shared, F2 */

var _pairshaped$elm_firebase$Native_Database_Snapshot = function () { // eslint-disable-line no-unused-vars

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Snapshot"].concat(Array.prototype.slice.call(arguments))
    //
    // console.log.apply(console, args)
  }


  // Snapshot methods


  var key = function (snapshotModel) {
    debug(".key", snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return snapshot.key
      ? { ctor: "Just", _0: snapshot.key }
      : { ctor: "Nothing" }
  }

  var ref = function (snapshotModel) {
    debug(".ref", snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return _pairshaped$elm_firebase$Native_Shared.referenceToModel(snapshot.ref)
  }

  var child = function (path, snapshotModel) {
    debug(".child", path, snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return _pairshaped$elm_firebase$Native_Shared.snapshotToModel(snapshot.child(path))
  }

  var exists = function (snapshotModel) {
    debug(".exists", snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return snapshot.exists()
      ? { ctor: "True" }
      : { ctor: "False" }
  }

  var exportVal = function (snapshotModel) {
    debug(".exportVal", snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return snapshot.exportVal()
  }

  var getPriority = function (snapshotModel) {
    debug(".getPriority", snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return snapshot.getPriority()
  }


  var hasChild = function (path, snapshotModel) {
    debug(".hasChild", path, snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return snapshot.hasChild(path)
  }


  var hasChildren = function (snapshotModel) {
    debug(".hasChildren", snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return snapshot.hasChildren()
  }


  var numChildren = function (snapshotModel) {
    debug(".numChildren", snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return snapshot.numChildren()
  }


  var value = function (snapshotModel) {
    debug(".value", snapshotModel)
    var snapshot = snapshotModel.snapshot()

    return snapshot.val()
  }

  var prevKey = function (snapshotModel) {
    debug(".prevKey", snapshotModel)

    return snapshotModel.prevKey
  }

  return {
    "key": key,
    "ref": ref,
    "child": F2(child),
    "exists": exists,
    "exportVal": exportVal,
    "getPriority": getPriority,
    "hasChild": F2(hasChild),
    "hasChildren": hasChildren,
    "numChildren": numChildren,
    "value": value,
    "prevKey": prevKey
  }
}()

