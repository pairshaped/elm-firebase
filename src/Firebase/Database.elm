module Firebase.Database
    exposing
        ( init
        , ref
        )

{-| Firebase.Database handles database initialization and getting an initial reference

# Methods
@docs init, ref
-}

import Firebase
import Native.Database
import Firebase.Database.Types exposing (Database, Reference)


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
