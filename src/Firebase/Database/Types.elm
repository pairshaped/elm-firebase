module Firebase.Database.Types exposing (..)

{-| Temporary documentation to enable testing.

# Types
@docs Database

@docs Reference

--}

{-| Somrthisg
--}
type Database
    = Database


type Reference
    = Reference


type Query
    = Query


type Snapshot
    = Snapshot


type OnDisconnect
    = OnDisconnect

{-| Designates a realtime database event.

See [firebase.database.Reference#on](https://firebase.google.com/docs/reference/node/firebase.database.Reference#on)
for more information on event types.
--}
type Event
    = Value
    | ChildAdded
    | ChildMoved
    | ChildChanged
    | ChildRemoved

