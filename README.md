# Important Note:

Firebase 4.x is being open sourced, and I'll be making an effort and/or facilitating a pure translation in Elm. If you're interested in helping or following the discussion, check out [Issue #29: Translate Javascript SDK](https://github.com/pairshaped/elm-firebase/issues/29)

# WARNING

## The state of this library

The current state of this is very limited, and this is very much in **alpha**. Consider the API in flux.

It is completely possible that master will be broken at any given time until we hit a stable 1.x.

## Elm guarantees

In it's current state, **elm-firebase completely removes any runtime guarantees that Elm provides**. This is because firebase is a close-source black box, full of mystery and wonder, which makes it very untestable. When you use this library, you are risking, as [@rtfeldman](https://github.com/rtfeldman) put it; "wrapping a JS library where you can't even know how it works is just bound to cost you hours of debugging down the line".

With that in mind, feel free to play with this, but use it at your own risk.

# Alternatives

 - [elmfire](https://github.com/ThomasWeiser/elmfire)
 - Using elm [port modules](https://guide.elm-lang.org/interop/javascript.html)

# elm-firebase

**elm-firebase** is a set of bindings between Elm >= 0.18 and Firebase 3.x.

## Goals

 - Be as close to the javascript api as possible.
 - Follow the elm architecture.

## Getting started

### Elm

First, you'll need to install [elm-github-install](https://github.com/gdotdesign/elm-github-install).

```
$ npm install elm-github-install -g
```

Then you can add elm-firebase to your elm-package.json like so:

```
{
  "dependencies": {
    "pairshaped/elm-firebase": "0.0.13 <= v < 1.0.0"
  },
  "dependency-sources": {
    "pairshaped/elm-firebase": {
      "url": "https://github.com/pairshaped/elm-firebase",
      "ref": "0.0.13"
    }
  }
}
```

Now you're ready to install!

```
$ elm-github-install
```

### Your HTML files

You'll need to include the firebase javascripts yourself. That could either mean bower, webpack+npm, or using the gstatic cdn.

Here are a list of firebase versions that have or will be tested:

| Version | Works?   | CDN Link |
|---------|----------|----------|
| 3.6.9   | YES      | https://www.gstatic.com/firebasejs/3.6.9/firebase.js |
| 3.7.1   | Probably | https://www.gstatic.com/firebasejs/3.7.1/firebase.js |
| 3.7.4   | YES      | https://www.gstatic.com/firebasejs/3.7.4/firebase.js |
| 3.8.0   | Probably | https://www.gstatic.com/firebasejs/3.8.0/firebase.js |
| 3.9.0   | YES      | https://www.gstatic.com/firebasejs/3.9.0/firebase.js |

If you run into a weird or unexplainable bug, please ensure you are using a version that has been tested and verified.

I expect all the 3.x firebase versions to work but sticking to known versions will help eliminate potential bugs if a method's behaviour is changed.

## Key differences to the library keep things simple in Elm

 - `snapshot.val()` maps to `Firebase.Database.Snapshot.value snapshot` rather than `Firebase.Database.Snapshot.val snapshot`. I chose to be more explicit because I thought `val` wasn't as meaningful as it could be.
 - `reference.on`, `reference.off`, `query.on`, and `query.off` map to singular subscription methods: `Firebase.Database.Reference.on` and `Firebase.Database.Query.on` respectively.
When you're done, just remove your subscription from `Sub.batch` and elm-firebase will do the rest!

## Connecting to your firebase database

```
import Html
import Firebase
import Firebase.Database.Types
import Firebase.Database.Reference
import Firebase.Database.Snapshot



main =
  Html.program
      { init = init
      , update = update
      , subscriptions = \_ -> Sub.none
      , view = -- ...
      }

type alias Model =
    { app : Firebase.App
    , db : Firebase.Database.Types.Database
    }


init : ( Model, Cmd Msg )
init =
  let
      app : Firebase.App
      app =
          Firebase.init
              { apiKey = "your firebase api key"
              , databaseURL = "https://your-firebase-app.firebaseio.com"
              , -- These are necessary for just connecting to your database
                authDomain = ""
              , storageBucket = ""
              , messagingSenderId = ""
              , projectId = ""
              }

      {-
          It's not necessary to store the database, but it will make it easier
          since all your database interactions are going to either be in `update`
          or `subscriptions`, and both have access to your model.
      -}
      db : Firebase.Database.Types.Database
      db =
          Firebase.Database.init app

      initialModel : Model
      initialModel =
          { app = app
          , db = db
          }
  in
      ( initialModel
      , Cmd.none
      )
```

## Getting the value of a reference

```
import Firebase
import Firebase.Database.Types
import Firebase.Database.Reference
import Firebase.Database.Snapshot



-- Same main/model/init stuff as above...


type Msg
    = GetValueOfFoo
    | FooValue Firebase.Database.Types.Snapshot


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    GetValueOfFoo ->
        let
            fooRef : Firebase.Database.Types.Reference
            fooRef =
                model.db
                    |> Firebase.Database.ref (Just "foo")
        in
            ( model
            , Task.perform FooValue (Firebase.Database.Reference.once "value" fooRef)
            )

    FooValue snapshot ->
        let
            {-
              This decodes the value of "/foo" as a string.
            -}
            value : Result String String
            value =
                snapshot
                    |> Firebase.Database.Snapshot.value           -- Gives us a Json.Decode.Value
                    |> Json.Decode.decodeValue Json.Decode.string -- Convert into a Result String a (where a is a String)
                    |> Debug.log "FooValue.value.result"          -- Output the result (either `Err decodeMessage` or `Ok value`)
        in
            ( model
            , Cmd.none
            )
```


## Subscribing to changes of a reference

```
import Firebase
import Firebase.Database.Types
import Firebase.Database.Reference
import Firebase.Database.Snapshot



main =
  Html.program
      { init = init
      , update = update
      , subscriptions = subscriptions
      , view = -- ...
      }



-- Same model/init as above...


type Msg
    = FooValue Firebase.Database.Types.Snapshot


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    FooValue snapshot ->
        let
            {-
              This decodes the value of "/foo" as a string.
            -}
            value : Result String String
            value =
                snapshot
                    |> Firebase.Database.Snapshot.value           -- Gives us a Json.Decode.Value
                    |> Json.Decode.decodeValue Json.Decode.string -- Convert into a Result String a (where a is a String)
                    |> Debug.log "FooValue.value.result"          -- Output the result (either `Err decodeMessage` or `Ok value`)
        in
            ( model
            , Cmd.none
            )


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        fooRef : Firebase.Database.Types.Reference
        fooRef =
            model.db
                |> Firebase.Database.ref (Just "foo")
    in
      Sub.batch
          [ Firebase.Database.Reference.on "value" fooRef FooValue
          ]
```

## Example

Based on excellent advice from [@pdamoc](https://github.com/pdamoc), here is [elm-firebase-todomvc](https://github.com/mrozbarry/elm-firebase-todomvc), and a live demo [here](https://elm-firebase-todomvc.firebaseapp.com/).

Check out the [kitchen sink](./examples/kitchenSink/src/Main.elm) or [writer](./examples/writer/src/Main.elm) examples for information.

# Special Thanks

See [credits](./CREDITS.md) for a list of people who have contributed code, ideas, and support.
