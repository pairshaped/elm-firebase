module Firebase.Database exposing
  ( Database
  , Reference
  , Event(..)

  , init
  , root
  , ref
  , child
  )

import Json.Encode
import Firebase
import Firebase.Errors
import Native.Database



-- Types


type Database = Database
type Query = Query
type DataSnapshot = DataSnapshot


type Event
    = Value
    | ChildAdded
    | ChildChanged
    | ChildRemoved
    | ChildMoved


-- Methods/Database


init : Firebase.App -> Database
init = Firebase.Native.Database.init


root : Database -> Reference
root = Firebase.Native.Database.root


ref : String -> Database -> Reference
ref = Firebase.Native.Database.ref



-- Methods/Reference


child : String -> Reference -> Reference
child = Firebase.Native.Database.child


set : Json.Encode.Value -> msg -> Reference -> Task Never Never
set = Firebase.Native.Database.set


update : Json.Encode.Value -> msg -> Reference -> Task Never Never
update = Firebase.Native.Database.update


orderByChild : String -> Reference -> Query
orderByChild = Firebase.Native.Database.orderByChild


orderByKey : Reference -> Query
orderByKey = Firebase.Native.Database.orderByKey


orderByPriority : Reference -> Query
orderByPriority = Firebase.Native.Database.orderByPriority


orderByValue : Reference -> Query
orderByChild = Firebase.Native.Database.orderByValue


toString : Reference -> String
toString = Firebase.Native.Database.toString


referenceOnce : Event -> Reference -> Task Never DataSnapshot
referenceOnce = Firebase.Native.Database.referenceOnce



-- Methods/Query


startAt : Json.Encode.Value -> Maybe String -> Query -> Query
startAt = Firebase.Native.Database.startAt


endAt : Json.Encode.Value -> Maybe String -> Query -> Query
endAt = Firebase.Native.Database.endAt


equalTo : Json.Encode.Value -> Maybe String -> Query -> Query
equalTo = Firebase.Native.Database.equalTo


limitToFirst : Int -> Query -> Query
limitToFirst = Firebase.Native.Database.limitToFirst


limitToLast : Int -> Query -> Query
limitToLast = Firebase.Native.Database.limitToLast


queryOnce : Event -> Query -> Task Never DataSnapshot
queryOnce = Firebase.Native.Database.once
