effect module Firebase.Authentication.StateChange
    where { subscription = MySub }
    exposing
        ( on
        )


import Task exposing (Task)
import Firebase
import Firebase.Errors exposing (Error)
import Firebase.Authentication
import Native.Authentication.State


on : Auth -> (Maybe User -> msg) -> Sub msg
on auth tagger =
    subscription (MySub auth tagger)



-- Effect manager


type MySub msg
    = MySub Auth (Maybe User -> msg)




-- TODO: What/how does this work.


subMap : (a -> b) -> MySub a -> MySub b
subMap func subMsg =
    case subMsg of
        MySub appName tagger ->
            MySub appName (tagger >> func)



-- Effect management/State


type alias State msg =
    { subs : List (MySub msg)
    , cancelCallbacks : Dict String (() -> Task x ())
    }


init : Task x (State msg)
init =
    Task.succeed
        { subs = []
        , cancelCallbacks = []
        }


type SelfMsg msg
    = AddSubscriptions
    | RemoveSubscriptions
    | AuthStateChanged (Maybe User)



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
        uniqueSubs : List (MySub msg)
        uniqueSubs =
            let
                initialFold : ( List String, List (MySub msg) )
                initialFold =
                    ( [], [] )
            in
                newSubs
                    |> List.foldl foldSubs ( [], [] )
                    |> Tuple.second

        foldSubs : MySub msg -> ( List String, List (MySub msg) ) -> ( List String, List (MySub msg) )
        foldSubs mySub ( appNames, approvedSubs ) =
            let
                appName : String
                appName =
                    case mySub of
                        MySub auth _ ->
                            auth
                                |> Firebase.Authentication.app
                                |> Firebase.name

                appAlreadyListed : Bool
                appAlreadyListed =
                    appNames
                        |> List.filter ((==) appName)
                        |> List.isEmpty
                        |> not

                newAppNames : List String
                newAppNames =
                    if appAlreadyListed then
                        []
                    else
                        [ appName ]

                newApprovedSubs : List (MySub msg)
                newApprovedSubs =
                    if appAlreadyListed then
                        []
                    else
                        [ mySub ]
            in
                ( appNames ++ newAppNames
                , approvedSubs ++ newApprovedSubs
                )
    in
        Task.succeed { oldState | subs = uniqueSubs }
            |> Task.andThen (Platform.sendToSelf router AddSubscriptions)


onSelfMsg :
    Platform.Router msg (SelfMsg msg)
    -> SelfMsg msg
    -> State msg
    -> Task x (State msg)
onSelfMsg router selfMsg state =
    case selfMsg of
        AddSubscriptions ->
            let
                newSubscriptions : List (MySub msg)
                newSubscriptions =
                    state.subs
                        |> List.filter subHasNoCancelCallback

                subHasNoCancelCallback : MySub msg -> Bool
                subHasNoCancelCallback mySub =
                    case mySub of
                        MySub auth _ ->
                            let
                                appName : String
                                appName =
                                    auth
                                        |> Firebase.Authentication.app
                                        |> Firebase.name
                            in
                                case (Dict.get appName state.cancelCallbacks) of
                                    Just _ ->
                                        False

                                    Nothing ->
                                        True

                newCancelCallbacks : Dict String (() -> Task x ()) -> Dict String (() -> Task x ())
                newCancelCallbacks cancelCallbacks =
                    newSubscriptions
                        |> List.map Native.Authentication.StateChange.on

            in
                Task.succeed { state | cancelCallbacks = state.cancelCallbacks ++ newCancelCallbacks }

        RemoveSubscriptions ->

        AuthStateChanged maybeUser ->
