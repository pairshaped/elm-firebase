effect module Firebase.Authentication
    where { subscription = MySub }
    exposing
        ( init
        , currentUser
        , confirmPasswordReset
        , createUserWithEmailAndPassword
        , fetchProvidersForEmail
        , sendPasswordResetEmail
        , signInAnonymously
        , signInWithEmailAndPassword
        , signOut
        , verifyPasswordResetCode
        )

import Task exposing (Task)
import Firebase
import Firebase.Errors exposing (Error)
import Firebase.Authentication.Types exposing (Auth, User)
import Native.Firebase
import Native.Authentication


{- TODO: I'm currently skipping the following methods:

     * auth.applyActionCode
     * auth.checkActionCode
     * auth.getRedirectResult

   I will look into adding these later if there are any needs
-}
-- Methods


init : Firebase.App -> Auth
init =
    Native.Authentication.init


app : Auth -> App
app =
    Native.Authentication.app


currentUser : Auth -> Maybe User
currentUser =
    Native.Authentication.currentUser


confirmPasswordReset : String -> String -> Auth -> Task Error ()
confirmPasswordReset =
    Native.Authentication.confirmPasswordReset


createUserWithEmailAndPassword : String -> String -> Auth -> Task Error User
createUserWithEmailAndPassword =
    Native.Authentication.createUserWithEmailAndPassword


fetchProvidersForEmail : String -> Auth -> Task x (List String)
fetchProvidersForEmail =
    Native.Authentication.fetchProvidersForEmail


onAuthStateChanged : Auth -> (Maybe User -> msg) -> Sub msg
onAuthStateChanged auth tagger =
    subscription (MySub auth tagger)


sendPasswordResetEmail : String -> Auth -> Task x ()
sendPasswordResetEmail =
    Native.Authentication.sendPasswordResetEmail


signInAnonymously : Auth -> Task Error User
signInAnonymously =
    Native.Authentication.signInAnonymously


signInWithEmailAndPassword : String -> String -> Auth -> Task Error User
signInWithEmailAndPassword =
    Native.Authentication.signInWithEmailAndPassword


signOut : Auth -> Task x ()
signOut =
    Native.Authentication.signOut


verifyPasswordResetCode : String -> Auth -> Task x String
verifyPasswordResetCode =
    Native.Authentication.verifyPasswordResetCode



-- Effect manager


type MySub msg
    = MySub Auth (Maybe User -> msg)



-- TODO: What/how does this work.


subMap : (a -> b) -> MySub a -> MySub b
subMap func subMsg =
    case subMsg of
        MySub auth tagger ->
            MySub auth (tagger >> func)



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
    = NewSubscriptionHandler
    | SimulateAuthStateChange
    | RemoveSubscriptionHandler
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
        appName : App -> String
        appName =
            Native.Firebase.name

        isTaggerForAuth : MySub msg -> Bool
        isTaggerForAuth mySub =
            case mySub of
                MySub subAuth _ ->
                    subAuth
                        |> app
                        |> appName

        appAuthChangesToAdd : List Auth
        appAuthChangesToAdd =
            let
                notSubscribed
            in
                newSubs
                    |> List.filter not

        appAuthChangesToRemove : List Auth
        appAuthChangesToRemove =
            []
    in
        case maybeSelfMsg of
            Just selfMsg ->
                Platform.sendToSelf router selfMsg
                    &> Task.succeed { oldState | subs = newSubs }

            Nothing ->
                Task.succeed { oldState | subs = newSubs }


onSelfMsg :
    Platform.Router msg (SelfMsg msg)
    -> SelfMsg msg
    -> State msg
    -> Task x (State msg)
onSelfMsg router selfMsg oldState =
    let
        subsForAuth : Auth -> List (MySub msg)
        subsForAuth auth =
            let
                appName : App -> String
                appName =
                    Native.Firebase.name

                isTaggerForAuth : MySub msg -> Bool
                isTaggerForAuth mySub =
                    case mySub of
                        MySub subAuth _ ->
                            subAuth
                                |> app
                                |> appName
            in
                oldState.subs
                    |> List.filter isTaggerForAuth
    in
        case selfMsg of
            NewSubscriptionHandler ->
                --Native.Authentication.onAuthStateChanged
                Task.succeed oldState

            SimulateAuthStateChange auth ->
                let
                    subs : List (MySub msg)
                    subs =
                        subsForAuth auth

                    send : MySub msg -> Task x ()
                    send mySub =
                        case mySub of
                            MySub auth tagger ->
                                Platform.sendToApp router (tagger (currentUser auth))
                in
                    List.map send subs
                        |> Task.sequence
                        &> Task.succeed oldState

            RemoveSubscriptionHandler ->
                Task.succeed oldState

            AuthStateChanged auth maybeUser ->
                Task.succeed oldState
