effect module Firebase.Database.Reference
    where
        { subscription = MySub
        }
    exposing
        ( child
        , set
        , update
        , orderByChild
        , orderByKey
        , orderByPriority
        , orderByValue
        , toString
        , once
        , subscribe
        )

import Json.Decode
import Json.Encode
import Dict exposing (Dict)
import Task exposing (Task)
import Process
import Firebase.Database.Types exposing (Reference, Snapshot, Query)
import Firebase.Errors exposing (Error)
import Native.Database.Reference



child : String -> Reference -> Reference
child = Native.Database.Reference.child


set : Json.Encode.Value -> msg -> Reference -> Task Never Never
set = Native.Database.Reference.set


update : Json.Encode.Value -> msg -> Reference -> Task Never Never
update = Native.Database.Reference.update


orderByChild : String -> Reference -> Query
orderByChild = Native.Database.Reference.orderByChild


orderByKey : Reference -> Query
orderByKey = Native.Database.Reference.orderByKey


orderByPriority : Reference -> Query
orderByPriority = Native.Database.Reference.orderByPriority


orderByValue : Reference -> Query
orderByValue = Native.Database.Reference.orderByValue


toString : Reference -> String
toString = Native.Database.Reference.toString


once : String -> Reference -> Task Never Snapshot
once = Native.Database.Reference.once


subscribe : String -> Reference -> (Snapshot -> msg) -> Sub msg
subscribe event reference tagger =
    subscription (MySub event reference tagger)


-- Effect manager


type MySub msg
    = MySub String Reference (Snapshot -> msg)


subMap : (a -> b) -> MySub a -> MySub b
subMap func subMsg =
    case subMsg of
        MySub event ref tagger ->
            MySub event ref (tagger >> func)


-- Effect management/State


type alias State msg =
    { subs : List (MySub msg)
    }


init : Task Never (State msg)
init =
    Task.succeed
        { subs = []
        }


type SelfMsg msg
    = ManageSubscriptions { toAdd : List (MySub msg), toRemove: List (MySub msg) }
    | Update (Snapshot -> msg) Snapshot
    -- | UnsubscribeTo (Mysub msg)


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
                        |> List.filter (\(MySub event reference _) -> event == newEvent && (toString reference) == (toString newReference))
                        |> List.isEmpty
            in
                newSubs
                    |> List.filter notSubscribed


        toRemove : List (MySub msg)
        toRemove =
            let
                subscribed (MySub oldEvent oldReference _) =
                    newSubs
                        |> List.filter (\(MySub event reference _) -> event == oldEvent && (toString reference) == (toString oldReference))
                        |> List.isEmpty
            in
                oldState.subs
                    |> List.filter subscribed
    in
        Platform.sendToSelf
            router
            (ManageSubscriptions { toAdd = toAdd, toRemove = toRemove })
            &> Task.succeed { oldState | subs = newSubs }


onSelfMsg : Platform.Router msg (SelfMsg msg) -> (SelfMsg msg) -> State msg -> Task Never (State msg)
onSelfMsg router selfMsg oldState =
    case (Debug.log "onSelfMsg" selfMsg) of
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
                        _ = Debug.log "addSubscription" mySub

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
                              _ = Debug.log "removeSubscription" mySub

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
