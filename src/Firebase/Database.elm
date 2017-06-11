module Firebase.Database
    exposing
        ( init
        , ref
        , eventString
        )

{-| Firebase.Database handles database initialization and getting an initial reference

# Methods
@docs init, ref
-}

import Firebase
import Native.Database
import Firebase.Database.Types exposing (Database, Reference, Event(..))


{-| Given a Firebase.App, return its Database object

Maps to `firebase.app.App#database()`
-}
init : Firebase.App -> Database
init =
    Native.Database.init


{-| Given a Firebase.App, return its Database object

Maps to `firebase.app.App#database()`
-}
ref : Maybe String -> Database -> Reference
ref =
    Native.Database.ref

eventString : Event -> String
eventString event =
    case event of
        Value ->
            "value"
        ChildAdded ->
            "child_added"
        ChildMoved ->
            "child_moved"
        ChildChanged ->
            "child_changed"
        ChildRemoved ->
            "child_removed"
