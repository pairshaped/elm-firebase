import Html exposing (Html, div, text)
import Firebase
import Firebase.Database


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
    }

type alias Flags =
    { apiKey : String
    }


initialModel : String -> Model
initialModel apiKey =
    { app =
        Firebase.init
            { apiKey = apiKey
            , authDomain = ""
            , databaseUrl = ""
            , storageBucket = ""
            , messagingSenderId = ""
            }
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( initialModel flags.apiKey
    , Cmd.none
    )



-- Update


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model
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
        ]
