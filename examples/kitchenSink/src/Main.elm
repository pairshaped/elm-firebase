import Html exposing (Html, div, text)
import Task exposing (Task)
import Json.Decode
import Firebase
import Firebase.Database exposing (Reference, Snapshot, Event(Value))


-- Entry Point


main =
    Html.programWithFlags
        { init = init
        , update = update
        , subscriptions = \(model) -> Sub.none
        , view = view
        }


-- Model


type alias Model =
    { app : Firebase.App
    , demo : Maybe String
    }

type alias Flags =
    { apiKey : String
    , authDomain : String
    , databaseURL : String
    , storageBucket : String
    , messagingSenderId : String
    }


initialModel : Flags -> Model
initialModel firebaseConfig  =
    { app = Firebase.init (Debug.log "initialModel.config" firebaseConfig)
    , demo = Nothing
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        model : Model
        model =
            initialModel flags

        ref : Reference
        ref =
            model.app
                |> Firebase.Database.database
                |> Firebase.Database.ref (Just "demo")
    in
        ( model
        , Task.perform ReadDemo (Firebase.Database.referenceOnce Value ref)
        )



-- Update


type Msg
    = ReadDemo Snapshot


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReadDemo snapshot ->
            let
                _ = Debug.log "ReadDemo" snapshot

                demo : Maybe String
                demo =
                    snapshot
                      |> Firebase.Database.snapshotValue
                      |> Json.Decode.decodeValue (Json.Decode.string)
                      |> Result.withDefault ""
                      |> Just
                      |> Debug.log "new demo value"
            in
                ( { model | demo = demo }
                , Cmd.none
                )



-- View


view : Model -> Html Msg
view model =
    div
        []
        [ div [] [ text ("Firebase " ++ Firebase.sdkVersion ++ " basic api test") ]
        , div [] [ text ("App.name = " ++ (Firebase.name model.app)) ]
        , div [] [ text ("App.options = " ++ (toString (Firebase.options model.app))) ]
        , div [] [ text ("Number of firebase apps = " ++ (toString <| List.length (Firebase.apps ()))) ]
        , div [] [ text ("Demo value = " ++ (toString model.demo))]
        ]
