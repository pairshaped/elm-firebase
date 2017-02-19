# WARNING

The current state of this is very limited, and this is very much in **alpha**. Consider the API in complete flux.

It is completely possible that master will be completely broken at any given time until we hit a stable 1.x.

# elm-firebase

**elm-firebase** is a set of bindings between Elm (>= ?) 0.18 and Firebase 3.x.

## Goals

 - Be as close to the javascript api as possible.
 - Follow the elm architecture.

## Example

```
import Firebase
import Firebase.Database exposing (Database, Reference, DataSnapshot)
import Firebase.Errors exposing (Error)

type Model =
    { app : Firebase.App
    , state : State
    }

type State =
    { counter : Int
    }

type Msg
    = Snapshot (Result Firebase.DataSnapshot)
    | Increment
    | SetComplete Never Never


initialModel : Model
initialModel =
    { app = Firebase.init { apiKey = "...", authDomain = "...", databaseUrl: "...", storageBucket = "...", messagingSenderId = "..." }
    , state = { counter = 0 }
    }

init = ( Model, Cmd Msg )
init =
    let
        model : Model
        model = initialModel

        root : Reference
        root =
            model.app
                |> Firebase.Database.init
                |> Firebase.Database.root

    in
        ( initialModel
        , Cmd.none
        )

update : msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Snapshot Ok data ->
            let
                decoder : Json.Decode.Decoder State
                decoder =
                    Json.Decode.field "counter" (Json.Decode.string)

                state : State
                state =
                    Json.Decode.decodeValue decoder (Firebase.Database.snapShotValue)
            in
                ( { model | state = state }
                , Cmd.none
                )

        Snapshot Err error ->
            let
                _ = Debug.log "Snapshot.error" error
            in
                ( model
                , Cmd.none
                )

        Increment ->
            let
                ref : Reference
                ref =
                    model.app
                        |> Firebase.Database.init
                        |> Firebase.Database.root
                        |> Firebase.Database.child "counter"

            in
                ( model
                , Task.perform SetComplete (Firebase.Database.set (model.state.counter + 1) ref)
                )

        SetComplete a b ->
            ( model
            , Cmd.none
            )


view : Model -> Html Msg
view model =
    div
        []
        [ button [ onClick Increment, value "Increment the global counter" ] []
        , div [] [ text ("People have clicked this button " ++ (toString model.state.counter) ++ " times") ]
        ]

subscriptions : Model -> Sub Msg
subscriptions model =
    let
        ref : Reference
        ref =
            model.app
                |> Firebase.Database.init
                |> Firebase.Database.root
    in
        Sub.batch
            [ Firebase.Database.subscribeToRef Snapshot ref
            ]
```


# Alternatives

 - [elmfire](https://github.com/ThomasWeiser/elmfire)
