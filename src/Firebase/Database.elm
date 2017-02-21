effect module Firebase.Database
    where { subscription = MySub }
    exposing
        ( Database
        , Reference
        , Event(..)
        , database
        , root
        , ref
        , child
        )


import Json.Encode
import Task exposing (Task)
import Firebase
import Firebase.Errors exposing (Error)
import Native.Database



-- Types


type Database = Database
type Reference = Reference
type Query = Query
type DataSnapshot = DataSnapshot


type Event
    = Value
    | ChildAdded
    | ChildChanged
    | ChildRemoved
    | ChildMoved


-- Methods/Database


database : Firebase.App -> Database
database = Native.Database.init


root : Database -> Reference
root = Native.Database.root


ref : String -> Database -> Reference
ref = Native.Database.ref



-- Methods/Reference


child : String -> Reference -> Reference
child = Native.Database.child


set : Json.Encode.Value -> msg -> Reference -> Task Never Never
set = Native.Database.set


update : Json.Encode.Value -> msg -> Reference -> Task Never Never
update = Native.Database.update


orderByChild : String -> Reference -> Query
orderByChild = Native.Database.orderByChild


orderByKey : Reference -> Query
orderByKey = Native.Database.orderByKey


orderByPriority : Reference -> Query
orderByPriority = Native.Database.orderByPriority


orderByValue : Reference -> Query
orderByValue = Native.Database.orderByValue


toString : Reference -> String
toString = Native.Database.toString


referenceOnce : Event -> Reference -> Task Never DataSnapshot
referenceOnce = Native.Database.referenceOnce



-- Methods/Query


startAt : Json.Encode.Value -> Maybe String -> Query -> Query
startAt = Native.Database.startAt


endAt : Json.Encode.Value -> Maybe String -> Query -> Query
endAt = Native.Database.endAt


equalTo : Json.Encode.Value -> Maybe String -> Query -> Query
equalTo = Native.Database.equalTo


limitToFirst : Int -> Query -> Query
limitToFirst = Native.Database.limitToFirst


limitToLast : Int -> Query -> Query
limitToLast = Native.Database.limitToLast


queryOnce : Event -> Query -> Task Never DataSnapshot
queryOnce = Native.Database.once


queryOn : Event -> Query -> (DataSnapshot -> Maybe String -> msg) -> Sub msg
queryOn event query tagger =
    subscription (QueryOn event query tagger)


-- Methods/DataSnapshot

  -- TODO

-- Effect management/MySub


type Tagger msg
    = Result Firebase.Errors.Error DataSnapshot


type MySub msg
    = ReferenceOn Event Reference (DataSnapshot -> Maybe String -> msg)
    | ReferenceOff Event Reference (DataSnapshot -> Maybe String -> msg)
    | QueryOn Event Query (DataSnapshot -> Maybe String -> msg)
    | QueryOff Event Query (DataSnapshot -> Maybe String -> msg)


subMap : (a -> b) -> MySub a -> MySub b
subMap func subMsg =
    case subMsg of
        ReferenceOn event ref tagger ->
            ReferenceOn event ref (tagger >> func)

        ReferenceOff event ref tagger ->
            ReferenceOff event ref (tagger >> func)

        QueryOn event query tagger ->
            QueryOn event query (tagger >> func)

        QueryOff event query tagger ->
            QueryOff event query (tagger >> func)


-- Effect management/State


type alias State msg =
    { subs : List (MySub msg)
    }


init : Task Never (State msg)
init =
    Task.succeed
        { subs = []
        }


type SelfMsg
    = Snapshot DataSnapshot


onEffects : Platform.Router msg SelfMsg -> List (MySub msg) -> State msg -> Task never (State msg)
onEffects router newSubs oldState =
    let
        _ = Debug.log "onEffects" (router, newSubs, oldState)

        subsToAdd : List (MySub msg)
        subsToAdd =
            newSubs
                |> List.filter (\sub -> not (List.member sub oldState.subs))

        subsToRemove : List (MySub msg)
        subsToRemove =
            oldState.subs
                |> List.filter (\sub -> not (List.member sub newSubs))
    in
        Task.succeed oldState

onSelfMsg : Platform.Router msg SelfMsg -> SelfMsg -> State msg -> Task Never (State msg)
onSelfMsg router selfMsg oldState =
    let
        _ = Debug.log "onSelfMsg" (router, selfMsg, oldState)
    in
        Task.succeed oldState
