# WARNING

The current state of this is very limited, and this is very much in **alpha**. Consider the API in flux.

It is completely possible that master will be broken at any given time until we hit a stable 1.x.

# elm-firebase

**elm-firebase** is a set of bindings between Elm >= 0.18 and Firebase 3.x.

## Goals

 - Be as close to the javascript api as possible.
 - Follow the elm architecture.

## Getting started

First, you'll need to install [elm-github-install](https://github.com/gdotdesign/elm-github-install).

```
$ npm install elm-github-install -g
```

Then you can add elm-firebase to your elm-package.json like so:

```
{
  "dependencies": {
    "pairshaped/elm-firebase": "0.0.5 <= v < 1.0.0"
  },
  "dependency-sources": {
    "pairshaped/elm-firebase": {
      "url": "https://github.com/pairshaped/elm-firebase.git",
      "ref": "master"
    }
  }
}
```

Now you're ready to install!

```
$ elm-github-install
```

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
              { apiKey: "your firebase api key"
              , databaseURL: "https://your-firebase-app.firebaseio.com"
              , -- These are necessary for just connecting to your database
                authDomain: ""
              , storageBucket: ""
              , messagingSenderId: ""
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
    = FooUpdated Firebase.Database.Types.Snapshot


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

Check out the [kitchen sink](./examples/kitchenSink/src/Main.elm) or [writer](./examples/writer/src/Main.elm) examples for information.

# Alternatives

 - [elmfire](https://github.com/ThomasWeiser/elmfire)
