module Firebase.Database
    exposing
        ( init
        , ref
        )


import Firebase
import Native.Database
import Firebase.Database.Types exposing (Database, Reference)


init : Firebase.App -> Database
init = Native.Database.init


ref : Maybe String -> Database -> Reference
ref = Native.Database.ref
