module Firebase exposing
    ( App
    , Config
    , sdkVersion
    , apps
    , init
    , name
    , options
    )

import Native.Firebase


-- Model


type App = App


type alias Config =
  { apiKey : String
  , authDomain : String
  , databaseUrl : String
  , storageBucket : String
  , messagingSenderId : String
  }



-- Firebase methods

sdkVersion : String
sdkVersion = Native.Firebase.sdkVersion

apps : () -> List App
apps = Native.Firebase.apps


-- App Methods


init : Config -> App
init = Native.Firebase.init


initWithName : Config -> String -> App
initWithName = Native.Firebase.initWithName


name : App -> String
name = Native.Firebase.name


options : App -> Config
options = Native.Firebase.options
