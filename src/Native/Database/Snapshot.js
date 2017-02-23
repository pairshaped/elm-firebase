var _pairshaped$elm_firebase$Native_Database_Snapshot = function () {

  // Utilities

  var debug = function () {
    // var args = ["Native.Firebase.Snapshot"].concat(Array.prototype.slice.call(arguments));
    //
    // console.log.apply(console, args);
  };


  // Snapshot methods


  var key = function (snapshotModel) {
    debug(".key", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshot.key
      ? { ctor: "Just", _0: snapshot.key }
      : { ctor: "Nothing" };
  }

  var ref = function (snapshotModel) {
    debug(".ref", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return _pairshaped$elm_firebase$Native_Shared.referenceToModel(snapshot.ref);
  }

  var child = function (path, snapshotModel) {
    debug(".child", path, snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return _pairshaped$elm_firebase$Native_Shared.snapshotToModel(snapshot.child(path));
  }

  var exists = function (snapshotModel) {
    debug(".exists", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshot.exists()
      ? { ctor: "True" }
      : { ctor: "False" }
  }

  var exportVal = function (snapshotModel) {
    debug(".exportVal", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshot.exportVal();
  }

  var getPriority = function (snapshotModel) {
    debug(".getPriority", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshot.getPriority();
  }

  var value = function (snapshotModel) {
    debug(".value", snapshotModel);
    var snapshot = snapshotModel.snapshot();

    return snapshot.val();
  }

  var prevKey = function (snapshotModel) {
    debug(".prevKey", snapshotModel);

    return snapshotModel.prevKey;
  }

  return {
    "key": key,
    "ref": ref,
    "child": F2(child),
    "exists": exists,
    "exportVal": exportVal,
    "getPriority": getPriority,
    "value": value,
    "prevKey": prevKey
  }
}()

