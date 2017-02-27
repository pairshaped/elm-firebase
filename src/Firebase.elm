module Firebase
    exposing
        ( App
        , Config
        , sdkVersion
        , apps
        , init
        , initWithName
        , deinit
        , name
        , options
        )

{-| elm-firebase is a near 1-to-1 wrapper around the [Firebase 3](https://firebase.google.com) javascript library.

# Definitions
@docs App, Config

# App methods
@docs init, initWithName, deinit, name, options


# Helpers
@docs sdkVersion, apps

-}

import Task exposing (Task)
import Native.Firebase
import Native.Shared


-- Model


{-| App is a wrapper around [firebase.app.App](https://firebase.google.com/docs/reference/js/firebase.app.App)
-}
type App
    = App


{-| Config is a helper type to configure your app.

In the firebase project dashboard overview, you can get the values for this record by clicking *Add Firebase to your web app*.
-}
type alias Config =
    { apiKey : String
    , authDomain : String
    , databaseURL : String
    , storageBucket : String
    , messagingSenderId : String
    }



-- Firebase methods


{-|
-}
sdkVersion : String
sdkVersion =
    Native.Firebase.sdkVersion


apps : () -> List App
apps =
    Native.Firebase.apps



-- App Methods


init : Config -> App
init =
    Native.Firebase.init


initWithName : Config -> String -> App
initWithName =
    Native.Firebase.initWithName


deinit : App -> Task x ()
deinit =
    Native.Firebase.deinit


name : App -> String
name =
    Native.Firebase.name


options : App -> Config
options =
    Native.Firebase.options
