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
        , isEqual
        )

{-| Firebase Database Queries

Queries are always built off `Firebase.Database.Reference` calls. See `Firebase.Database.Reference.orderBy*` methods to see how to kick off a query.

# Utility

@docs ref, isEqual

# Query qualifiers

@docs startAt, endAt, equalTo, limitToFirst, limitToLast

# Query execution

@docs once, on

For more information on all of these functions, see [the firebase docs](https://firebase.google.com/docs/reference/js/firebase.database.Query)

-}

import Json.Encode
import Task exposing (Task)
import Firebase.Database.Types exposing (Query, Reference, Snapshot)
import Native.Database.Query


{-| Given a query, return it's base reference

myRef : Firebase.Database.Types.Reference
myRef =
    myDatabase
        |> Firebase.Database.ref (Just "foo")
        |> Firebase.Database.child "bar"

myQuery : Firebase.Database.Types.Query
myQuery =
    myRef
        |> Firebase.Database.Reference.orderByKey

myQueryRef : Firebase.Database.Types.Reference
myQueryRef =
    Firebase.Database.Query.ref myQuery

Firebase.Database.Reference.isEqual myRef myQueryRef
-- => True

See [firebase.database.Query#ref](https://firebase.google.com/docs/reference/js/firebase.database.Query#ref) for more information
-}
ref : Query -> Reference
ref =
    Native.Database.Query.ref


{-| Given two queries, detect if they are the same.

According to the firebase documentation, "Two `Query` objects are equivalent if they represent the same location, have the same query parameters, and are from the same instance of `firebase.app.App`. Equivalent queries share the same sort order, limits, and starting and ending points."

See [firebase.database.Query#isEqual](https://firebase.google.com/docs/reference/js/firebase.database.Query#isEqual)
-}
isEqual : Query -> Query -> Bool
isEqual =
    Native.Database.Query.isEqual


{-| Given a Json value, optional string key, and query, specify the start point of a query.

Start at specifies the first value (is inclusive). If key is specified, you can decrease the total scope of the search.

The behaviour of startAt changes based on the ordering specified from the reference:

 - orderByChild: value represents the value of the specified child
 - orderByKey: value represents the the key
 - orderByValue: value represents the first instance of the given value
 - orderByPriority: value represents the priority (either a float or string). In all likelihood, you won't use this one.

If you're not using the optional key, pass a `Nothing` in its place.

See [firebase.database.Query#startAt](https://firebase.google.com/docs/reference/js/firebase.database.Query#startAt)
-}
startAt : Json.Encode.Value -> Maybe String -> Query -> Query
startAt =
    Native.Database.Query.startAt


{-| Given a Json value, optional string key, and query, specify the end point of a query.

End at specifies the last value (is inclusive). If key is specified, you can decrease the total scope of the search.

The behaviour of endAt changes based on the ordering specified from the reference:

 - orderByChild: value represents the value of the specified child
 - orderByKey: value represents the the key
 - orderByValue: value represents the last instance of the given value
 - orderByPriority: value represents the priority (either a float or string). In all likelihood, you won't use this one.

If you're not using the optional key, pass a `Nothing` in its place.

See [firebase.database.Query#endAt](https://firebase.google.com/docs/reference/js/firebase.database.Query#endAt)
-}
endAt : Json.Encode.Value -> Maybe String -> Query -> Query
endAt =
    Native.Database.Query.endAt


{-| Given a Json value, optional string key, and query, specify the target value of a query.

Equal to specifies the exact value. If key is specified, you can decrease the total scope of the search.

The behaviour of equalTo changes based on the ordering specified from the reference:

 - orderByChild: value represents the value of the specified child
 - orderByKey: value represents the the key
 - orderByValue: value represents all instances of the given value
 - orderByPriority: value represents the priority (either a float or string). In all likelihood, you won't use this one.

If you're not using the optional key, pass a `Nothing` in its place.

See [firebase.database.Query#equalTo](https://firebase.google.com/docs/reference/js/firebase.database.Query#equalTo)
-}
equalTo : Json.Encode.Value -> Maybe String -> Query -> Query
equalTo =
    Native.Database.Query.equalTo


{-| Given an integer limitation and query, specify to use only the first n objects from the resulting query.

See [firebase.database.Query#limitToFirst](https://firebase.google.com/docs/reference/js/firebase.database.Query#limitToFirst)
-}
limitToFirst : Int -> Query -> Query
limitToFirst =
    Native.Database.Query.limitToFirst


{-| Given an integer limitation and query, specify to use only the last n objects from the resulting query.

See [firebase.database.Query#limitToLast](https://firebase.google.com/docs/reference/js/firebase.database.Query#limitToLast)
-}
limitToLast : Int -> Query -> Query
limitToLast =
    Native.Database.Query.limitToLast


{-| Given an event type and query, return a task to capture the result of the query.

Event types include:

 - `"value"` - get the value of the objects matching the query.
 - `"child_added"` - get the first new child in the current query.
 - `"child_changed"` - get the first modified child in the current query.
 - `"child_removed"` - get the first child modified to by null in the current query.
 - `"child_moved"` - get the object where the key has changed in the current query.

Most likely, with one-off queries using `.once`, you'll be using `"value"`.

See [firebase.database.Query#once](https://firebase.google.com/docs/reference/js/firebase.database.Query#once)
-}
once : String -> Query -> Task x Snapshot
once =
    Native.Database.Query.once


{-| Given an event type and query, return a subscription to this query

Even types include:

 - `"value"` - watch all values matching this query
 - `"child_added"` - watch for all new children added matching this query
 - `"child_changed"` - watch for all modified children matching this query
 - `"child_removed"` - watch for all children that stop matching this query or are deleted
 - `"child_moved"` - watch for all children with modified keys matching this query

See [firebase.database.Query#once](https://firebase.google.com/docs/reference/js/firebase.database.Query#once)
-}
on : String -> Query -> (Snapshot -> msg) -> Sub msg
on event query tagger =
    subscription (MySub event query tagger)



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
        toAdd : List (MySub msg)
        toAdd =
            let
                notSubscribed (MySub newEvent newQuery _) =
                    oldState.subs
                        |> List.filter (\(MySub event query _) -> event == newEvent && (isEqual query newQuery))
                        |> List.isEmpty
            in
                newSubs
                    |> List.filter notSubscribed

        toRemove : List (MySub msg)
        toRemove =
            let
                subscribed (MySub oldEvent oldQuery _) =
                    newSubs
                        |> List.filter (\(MySub event query _) -> event == oldEvent && (isEqual query oldQuery))
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
