module Firebase.Database.Snapshot exposing (..)

import Json.Decode exposing (decodeValue, nullable, string)
import Firebase.Database.Types exposing (Snapshot, Reference)
import Native.Database.Snapshot


key : Snapshot -> Maybe String
key =
    Native.Database.Snapshot.key


ref : Snapshot -> Reference
ref =
    Native.Database.Snapshot.ref


child : String -> Snapshot -> Snapshot
child =
    Native.Database.Snapshot.child


exists : Snapshot -> Bool
exists =
    Native.Database.exists


exportVal : Snapshot -> Json.Decode.Value
exportVal =
    Native.Database.Snapshot.exportVal


getPriority : Snapshot -> Json.Decode.Value
getPriority =
    Native.Database.Snapshot.getPriority


hasChild : String -> Snapshot -> Bool
hasChild =
    Native.Database.Snapshot.hasChild


hasChildren : Snapshot -> Bool
hasChildren =
    Native.Database.Snapshot.hasChildren


numChildren : Snapshot -> Int
numChildren =
    Native.Database.Snapshot.numChildren


value : Snapshot -> Json.Decode.Value
value =
    Native.Database.Snapshot.value


prevKey : Snapshot -> Maybe String
prevKey =
    Native.Database.Snapshot.prevKey
