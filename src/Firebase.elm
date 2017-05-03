module Firebase
    exposing
        ( App
        , Config
        , sdkVersion
        , apps
        , app
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
@docs app, init, initWithName, deinit, name, options

# Helpers
@docs sdkVersion, apps

-}

import Task exposing (Task)
import Native.Firebase
import Native.Shared


-- Model


{-| App is a wrapper around [firebase.app.App](https://firebase.google.com/docs/reference/js/firebase.app.App)

This represents an instance of `firebase.app.App`
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
    , projectId : String
    }



-- Firebase methods


{-| Get the sdk version that is loaded on the webpage.

Firebase.sdkVersion -- Result: 3.0.0

Maps to `firebase.SDK_VERSION`
-}
sdkVersion : String
sdkVersion =
    Native.Firebase.sdkVersion


{-| Get a list of all the apps that have been initialized in firebase.

Maps to `firebase.apps()`
-}
apps : () -> List App
apps =
    Native.Firebase.apps


{-| Get the currently initialized app if there is one

Maps to `firebase.app`
-}

app : () -> Maybe App
app =
    Native.Firebase.app


{-| Find an app with a given name

To get the default app:

```
app : Maybe Firebase.App
app =
    Firebase.getAppByName "[DEFAULT]"
```

Does not map to a Firebase method, it's just a convenience
-}
getAppByName : String -> Maybe App
getAppByName appName =
    apps ()
        |> List.filter (\app -> (name app) == appName)
        |> List.head


-- App Methods


{-| Given a configuration, initialize a new firebase app instance

You will need access to the app to get the associated database, authentication, etc.

Maps to `firebase.initializeApp(configuration, null)`
-}
init : Config -> App
init =
    Native.Firebase.init


{-| Given a configuration and string, initialize a new firebase app instance

If you are using multiple firebase apps in your elm application, you will need to
use this method to specify names to your apps.

Maps to `window.firebase.initializeApp(configuration, name)`
-}
initWithName : Config -> String -> App
initWithName =
    Native.Firebase.initWithName


{-| Given an application, deinitialize it

Maps to `firebase.app.App#delete()`
-}
deinit : App -> Task x ()
deinit =
    Native.Firebase.deinit


{-| Given an application, return it's name.

Often times, this will return "[DEFAULT]"

Maps to `firebase.app.App#name`
-}
name : App -> String
name =
    Native.Firebase.name


{-| Given an application, the configuration options

Maps to `firebase.app.App#options`
-}
options : App -> Config
options =
    Native.Firebase.options
