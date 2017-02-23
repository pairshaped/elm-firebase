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


type Tagger msg
    = Result Firebase.Errors.Error Snapshot

type MySub msg
    = MySub String Reference (Snapshot -> msg)


subMap : (a -> b) -> MySub a -> MySub b
subMap func subMsg =
    case subMsg of
        MySub event ref tagger ->
            MySub event ref (tagger >> func)


-- Effect management/State


type alias State msg =
    { subs : List ( Process.Id, MySub msg )
    }


init : Task Never (State msg)
init =
    Task.succeed
        { subs = []
        }


type SelfMsg msg
    = ManageSubscriptions { toAdd : List (MySub msg), toRemove: List (MySub msg) }
    -- | SubscribeTo (MySub msg)
    -- | Update String Reference Snapshot
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
        _ = Debug.log "Reference.onEffects" (router, newSubs, oldState)


        currentSubs : List (MySub msg)
        currentSubs =
            List.map Tuple.second oldState.subs


        toAdd : List (MySub msg)
        toAdd =
            let
                notSubscribed (MySub newEvent newReference _) =
                    currentSubs
                        |> List.filter (\(MySub event reference _) -> event == newEvent && (toString reference) == (toString newReference))
                        |> List.isEmpty
            in
                newSubs
                    |> List.filter notSubscribed


        -- toRemove : List (MySub msg)
        -- toRemove =
        --     let
        --         subscribed oldSub =
        --             not (List.member oldSub newSubs)
        --     in
        --         currentSubs
        --             |> List.filter subscribed
    in
        Platform.sendToSelf
            router
            (ManageSubscriptions { toAdd = toAdd, toRemove = [] })
            &> Task.succeed oldState


onSelfMsg : Platform.Router msg (SelfMsg msg) -> (SelfMsg msg) -> State msg -> Task Never (State msg)
onSelfMsg router selfMsg oldState =
    let
        _ = Debug.log "Reference.onSelfMsg" (router, selfMsg, oldState)
    in
        case selfMsg of
            ManageSubscriptions { toAdd, toRemove } ->
                let
                    addSubscription : MySub msg -> Task x (State msg) -> Task x (State msg)
                    addSubscription mySub lastTask =
                        let
                            _ = Debug.log "addSubscription" mySub

                            nativeTask event reference tagger =
                                let
                                    listen : Task Error Snapshot -> Task Error Snapshot
                                    listen prev =
                                      Task.andThen (\snapshot -> Platform.sendToApp router (tagger snapshot)) prev
                                        |> Debug.log "nativeTask.listen"
                                        |> Process.sleep 1
                                        |> listen
                                in
                                    Native.Database.Reference.on event reference
                                        |> Task.andThen (\snapshot -> Platform.sendToApp router (tagger snapshot))
                                        |> listen

                            insertProcess state pid =
                                let
                                    pidSub : ( Process.Id, MySub msg )
                                    pidSub =
                                        ( pid, mySub )
                                            |> Debug.log "pidSub"
                                in
                                    List.append state.subs [pidSub]
                        in
                            case mySub of
                                MySub event reference tagger ->
                                    Task.map2
                                        (\pid state -> { state | subs = insertProcess state pid })
                                        (Process.spawn (nativeTask event reference tagger))
                                        lastTask

                    addAll : Task x (State msg) -> Task x (State msg)
                    addAll initialState =
                        List.foldl
                            addSubscription
                            initialState
                            toAdd
                in
                    addAll (Task.succeed oldState)
