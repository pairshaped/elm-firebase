effect module Firebase.Database.Reference
    where { subscription = MySub }
    exposing
        ( key
        , parent
        , child
        , set
        , update
        , updateMulti
        , push
        , remove
        , orderByChild
        , orderByKey
        , orderByPriority
        , orderByValue
        , toString
        , once
        , on
        , isEqual
        )

import Json.Encode
import Task exposing (Task)
import Firebase.Database exposing (eventString)
import Firebase.Database.Types exposing (Reference, Snapshot, Query, OnDisconnect, Event)
import Firebase.Errors exposing (Error)
import Native.Database.Reference


key : Reference -> String
key =
    Native.Database.Reference.key


parent : Reference -> Reference
parent =
    Native.Database.Reference.parent


child : String -> Reference -> Reference
child =
    Native.Database.Reference.child


set : Json.Encode.Value -> Reference -> Task Error ()
set =
    Native.Database.Reference.set


update : Json.Encode.Value -> Reference -> Task Error ()
update =
    Native.Database.Reference.update


updateMulti : List ( String, Json.Encode.Value ) -> Reference -> Task Error ()
updateMulti pathsWithValues ref =
    update (Json.Encode.object pathsWithValues) ref


push : Reference -> Reference
push =
    Native.Database.Reference.push


remove : Reference -> Task x ()
remove =
    Native.Database.Reference.remove


orderByChild : String -> Reference -> Query
orderByChild =
    Native.Database.Reference.orderByChild


orderByKey : Reference -> Query
orderByKey =
    Native.Database.Reference.orderByKey


orderByPriority : Reference -> Query
orderByPriority =
    Native.Database.Reference.orderByPriority


orderByValue : Reference -> Query
orderByValue =
    Native.Database.Reference.orderByValue


toString : Reference -> String
toString =
    Native.Database.Reference.toString


onDisconnect : Reference -> OnDisconnect
onDisconnect =
    Native.Database.Reference.onDisconnect


isEqual : Reference -> Reference -> Bool
isEqual =
    Native.Database.Reference.isEqual


once : Event -> Reference -> Task x Snapshot
once event =
    Native.Database.Reference.once (eventString event)


on : Event -> Reference -> (Snapshot -> msg) -> Sub msg
on event reference tagger =
    subscription (MySub (eventString event) reference tagger)



-- Effect manager


type MySub msg
    = MySub String Reference (Snapshot -> msg)



-- TODO: What/how does this work.


subMap : (a -> b) -> MySub a -> MySub b
subMap func subMsg =
    case subMsg of
        MySub event ref tagger ->
            MySub event ref (tagger >> func)



-- Effect management/State


type alias State msg =
    { subs : List (MySub msg)
    }


init : Task x (State msg)
init =
    Task.succeed
        { subs = []
        }


type SelfMsg msg
    = ManageSubscriptions { toAdd : List (MySub msg), toRemove : List (MySub msg) }
    | Update (Snapshot -> msg) Snapshot



-- Do task 1, discard it's return value, then do task 2


(&>) t1 t2 =
    Task.andThen (\_ -> t2) t1


onEffects :
    Platform.Router msg (SelfMsg msg)
    -> List (MySub msg)
    -> State msg
    -> Task never (State msg)
onEffects router newSubs oldState =
    let
        toAdd : List (MySub msg)
        toAdd =
            let
                notSubscribed (MySub newEvent newReference _) =
                    oldState.subs
                        |> List.filter (\(MySub event reference _) -> event == newEvent && (isEqual reference newReference))
                        |> List.isEmpty
            in
                newSubs
                    |> List.filter notSubscribed

        toRemove : List (MySub msg)
        toRemove =
            let
                subscribed (MySub oldEvent oldReference tagger) =
                    newSubs
                        |> List.filter (\(MySub event reference _) -> event == oldEvent && (isEqual reference oldReference))
                        |> List.isEmpty
            in
                oldState.subs
                    |> List.filter subscribed
    in
        Platform.sendToSelf
            router
            (ManageSubscriptions { toAdd = toAdd, toRemove = toRemove })
            &> Task.succeed { oldState | subs = newSubs }


onSelfMsg : Platform.Router msg (SelfMsg msg) -> SelfMsg msg -> State msg -> Task x (State msg)
onSelfMsg router selfMsg oldState =
    case selfMsg of
        ManageSubscriptions { toAdd, toRemove } ->
            let
                addAll : Task x (State msg) -> Task x (State msg)
                addAll initialState =
                    List.foldl
                        addSubscription
                        initialState
                        toAdd

                addSubscription : MySub msg -> Task x (State msg) -> Task x (State msg)
                addSubscription mySub lastTask =
                    let
                        nativeTask : String -> Reference -> (Snapshot -> msg) -> Task x ()
                        nativeTask event reference tagger =
                            Native.Database.Reference.on
                                event
                                reference
                                (\snapshot -> Platform.sendToSelf router (Update tagger snapshot))
                    in
                        case mySub of
                            MySub event reference tagger ->
                                (nativeTask event reference tagger)
                                    &> lastTask

                removeAll : Task x (State msg) -> Task x (State msg)
                removeAll initialState =
                    List.foldl
                        removeSubscription
                        initialState
                        toRemove

                removeSubscription : MySub msg -> Task x (State msg) -> Task x (State msg)
                removeSubscription mySub lastTask =
                    case mySub of
                        MySub event reference tagger ->
                            let
                                nativeTask : String -> Reference -> Task x ()
                                nativeTask event reference =
                                    Native.Database.Reference.off
                                        event
                                        reference
                            in
                                (nativeTask event reference)
                                    &> lastTask
            in
                (Task.succeed oldState)
                    |> removeAll
                    |> addAll

        Update tagger snapshot ->
            Platform.sendToApp router (tagger snapshot)
                &> Task.succeed oldState
