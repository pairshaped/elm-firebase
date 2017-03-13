module Firebase.Database.OnDisconnect
    exposing
        ( cancel
        , remove
        , set
        , setWithPriority
        , update
        , updateMulti
        )


import Json.Encode
import Firebase.Database.Types exposing (OnDisconnect)
import Firebase.Errors exposing (Error)
import Native.Database.OnDisconnect


cancel : OnDisconnect -> Task Error ()
cancel =
    Native.Database.OnDisconnect.cancel


remove : OnDisconnect -> Task Error ()
remove =
    Native.Database.OnDisconnect.remove


set : Json.Encode.Value -> OnDisconnect -> Task Error ()
set =
    Native.Database.OnDisconnect.set


setWithPriority : Json.Encode.Value -> Json.Encode.Value -> OnDisconnect -> Task Error ()
setWithPriority =
    Native.Database.OnDisconnect.setWithPriority


update : Json.Encode.Value -> OnDisconnect -> Task Error ()
update =
    Native.Database.OnDisconnect.update


updateMulti : List ( String, Json.Encode.Value ) -> OnDisconnect -> Task Error ()
updateMulti updates onDisconnect =
    update (Json.Encode.object updates) onDisconnect
