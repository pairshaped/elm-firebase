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
    , cancelMethods : Dict String (() -> Task x ())
    }


init : Task x (State msg)
init =
    Task.succeed
        { subs = []
        , cancelMethods = []
        }


type SelfMsg msg
    = AddSubscription Auth
    | RemoveSubscription Auth
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


onSelfMsg :
    Platform.Router msg (SelfMsg msg)
    -> SelfMsg msg
    -> State msg
    -> Task x (State msg)
onSelfMsg router selfMsg oldState =
