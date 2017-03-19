# WARNING

## The state of this library

The current state of this is very limited, and this is very much in **alpha**. Consider the API in flux.

It is completely possible that master will be broken at any given time until we hit a stable 1.x.

## Elm guarantees

In it's current state, elm-firebase completely removes any runtime guarantees that Elm provides. This is because firebase is a close-source black box, which makes it very untestable. When you use this library, you are risking, as [@rtfeldman](https://github.com/rtfeldman) put it; "wrapping a JS library where you can't even know how it works is just bound to cost you hours of debugging down the line".


With that in mind, feel free to play with this, but use it at your own risk.

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
    "pairshaped/elm-firebase": "0.0.11 <= v < 1.0.0"
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

### Your HTML files

You'll need to include the firebase javascripts yourself. That could either mean bower, webpack+npm, or using the gstatic cdn.

Here are a list of firebase versions that have or will be tested:

| Version | Works?   | CDN Link |
|---------|----------|----------|
| 3.6.9   | YES      | https://www.gstatic.com/firebasejs/3.6.9/firebase.js |
|---------|----------|----------|
| 3.7.1   | Probably | https://www.gstatic.com/firebasejs/3.7.1/firebase.js |

If you run into a weird or unexplainable bug, please ensure you are using a version that has been tested and verified.

I expect all the 3.x firebase versions to work but sticking to known versions will help eliminate potential bugs if a method's behaviour is changed.

## Key differences to the library keep things simple in Elm

 - `snapshot.val()` maps to `Firebase.Database.Snapshot.value snapshot` rather than `Firebase.Database.Snapshot.val snapshot`. I chose to be more explicit because I thought `val` wasn't as meaningful as it could be.
 - `reference.on`, `reference.off`, `query.on`, and `query.off` map to singular subscription methods: `Firebase.Database.Reference.on` and `Firebase.Database.Query.on` respectively.
When you're done, just remove your subscription from `Sub.batch` and elm-firebase will do the rest!
 - Subscribed queries must live on the model, see [Internals of a Subscription](#Internals-of-a-Subscription) for more information.

### Interals of a Subscription

Building queries from references in Elm also assigns a hidden uuid.
At the time of this writing, Elm does not support comparing tagger methods, and firebase doesn't provide a way to identify how a query was created (ie ordering, comparisons, etc.).
This is a huge problem for subscribing to a query, because Elm needs a way to know if a subscription is new (begin the subscription in js), persisting (do nothing, let the subscription continue), or removed (tell js to stop the subscription).
The hidden uuid will always guarantee uniqueness, but at a small price - you *must* keep the queries you're interested using inside your model (or some persistent storage between updates).
Every time you create or modify a query, the uuid is re-generated.

To demonstrated:

```
sourceRef : Firebase.Database.Types.Reference
sourceRef =
    app
        |> Firebase.Database.init
        |> Firebase.Database.ref (Just "foo")


queryOne : Firebase.Database.Types.Query
queryOne =
    sourceRef
        |> Firebase.Database.Reference.orderByValue
        |> Firebase.Database.Query.limitToFirst 1


queryTwo : Firebase.Database.Types.Query
queryTwo =
    sourceRef
        |> Firebase.Database.Reference.orderByValue
        |> Firebase.Database.Query.limitToFirst 1
```

Even though `queryOne` and `queryTwo` will produce the same results when subscribed to, they are technically not the same to the query effect manager.

I may change this in the future so that queries keep track of how they were built.
The downside of this is that it would be the burden of native code to track this, but would mean we can optimize the number of active subscriptions by having multiple taggers re-use the same subscription if they are the same.
The only main change this would provide is removing the requirement for a query to be in the model.
I'm personally not convinced that the query in the model is a bad thing, since the `subscriptions` method should probably be as dumb as possible.

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

Check out the [kitchen sink](./examples/kitchenSink/src/Main.elm) or [writer](./examples/writer/src/Main.elm) examples for information.

# Alternatives

 - [elmfire](https://github.com/ThomasWeiser/elmfire)
