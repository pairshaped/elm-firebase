effect module Firebase.Database.Query
    where { subscription = MySub }
    exposing
        ( ref
        , startAt
        , endAt
        , equalTo
        , limitToFirst
        , limitToLast
        , once
        , on
        )

import Json.Encode
import Task exposing (Task)
import Firebase.Database.Types exposing (Query, Reference, Snapshot)
import Native.Database.Query


ref : Query -> Reference
ref =
    Native.Database.Query.ref


startAt : Json.Encode.Value -> Maybe String -> Query -> Query
startAt =
    Native.Database.Query.startAt


endAt : Json.Encode.Value -> Maybe String -> Query -> Query
endAt =
    Native.Database.Query.endAt


equalTo : Json.Encode.Value -> Maybe String -> Query -> Query
equalTo =
    Native.Database.Query.equalTo


limitToFirst : Int -> Query -> Query
limitToFirst =
    Native.Database.Query.limitToFirst


limitToLast : Int -> Query -> Query
limitToLast =
    Native.Database.Query.limitToLast


once : String -> Query -> Task Never Snapshot
once =
    Native.Database.Query.once


on : String -> Query -> (Snapshot -> msg) -> Sub msg
on event query tagger =
    subscription (MySub event query tagger)


uuid : Query -> String
uuid =
    Native.Database.Query.uuid



-- Effect manager


type MySub msg
    = MySub String Query (Snapshot -> msg)



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
        isSameQuery : Query -> Query -> Bool
        isSameQuery a b =
            (uuid a) == (uuid b)

        toAdd : List (MySub msg)
        toAdd =
            let
                notSubscribed (MySub newEvent newQuery _) =
                    oldState.subs
                        |> List.filter (\(MySub event query _) -> event == newEvent && (isSameQuery query newQuery))
                        |> List.isEmpty
            in
                newSubs
                    |> List.filter notSubscribed

        toRemove : List (MySub msg)
        toRemove =
            let
                subscribed (MySub oldEvent oldQuery _) =
                    newSubs
                        |> List.filter (\(MySub event query _) -> event == oldEvent && (isSameQuery query oldQuery))
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
                        nativeTask : String -> Query -> (Snapshot -> msg) -> Task x ()
                        nativeTask event query tagger =
                            Native.Database.Query.on
                                event
                                query
                                (\snapshot -> Platform.sendToSelf router (Update tagger snapshot))
                    in
                        case mySub of
                            MySub event query tagger ->
                                (nativeTask event query tagger)
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
                        MySub event query tagger ->
                            let
                                nativeTask : String -> Query -> Task x ()
                                nativeTask event query =
                                    Native.Database.Query.off
                                        event
                                        query
                            in
                                (nativeTask event query)
                                    &> lastTask
            in
                (Task.succeed oldState)
                    |> removeAll
                    |> addAll

        Update tagger snapshot ->
            Platform.sendToApp router (tagger snapshot)
                &> Task.succeed oldState
