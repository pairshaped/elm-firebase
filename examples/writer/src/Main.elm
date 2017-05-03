module Main exposing (..)

import Html exposing (Html, div, text, button, label, input, hr, textarea)
import Html.Events exposing (onClick, onInput)
import Html.Attributes exposing (value, for, id, disabled, readonly)
import Task exposing (Task)
import Json.Encode
import Dict exposing (Dict)
import Firebase
import Firebase.Errors exposing (Error)
import Firebase.Database
import Firebase.Database.Reference
import Firebase.Database.Snapshot
import Firebase.Database.Types exposing (Database, Reference, Snapshot, Event(..))
import Firebase.Authentication
import Firebase.Authentication.Types exposing (User)


-- Entry Point


main =
    let
        subscriptions : Model -> Sub Msg
        subscriptions model =
            case model.reference of
                Just ref ->
                    Sub.batch
                        [ Firebase.Database.Reference.on Value ref UpdatedSnapshot
                        ]

                Nothing ->
                    Sub.none
    in
        Html.program
            { init = init
            , update = update
            , subscriptions = subscriptions
            , view = view
            }



-- Model


type alias Model =
    { config : Firebase.Config
    , app : Maybe Firebase.App
    , path : Maybe String
    , reference : Maybe Reference
    , latestSnapshot : String
    , child : String
    , value : String
    }


initialModel : Model
initialModel =
    { config =
        { apiKey = ""
        , authDomain = ""
        , databaseURL = ""
        , storageBucket = ""
        , messagingSenderId = ""
        }
    , app = Nothing
    , path = Nothing
    , reference = Nothing
    , latestSnapshot = ""
    , child = ""
    , value = ""
    }


init : ( Model, Cmd Msg )
init =
    ( initialModel
    , Cmd.none
    )



-- Update


type Msg
    = ChangeApiKey String
    | ChangeDatabaseURL String
    | SetApplication
    | UnsetApplication
    | ChangePath String
    | SetPathReference
    | UpdatedSnapshot Snapshot
    | ChangeChild String
    | ChangeValue String
    | SetChildValue
    | NoOp ()
    | WriteStatus (Result Error ())


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeApiKey apiKey ->
            let
                config : Firebase.Config -> Firebase.Config
                config prevConfig =
                    { prevConfig | apiKey = apiKey }
            in
                ( { model | config = config model.config }
                , Cmd.none
                )

        ChangeDatabaseURL databaseURL ->
            let
                config : Firebase.Config -> Firebase.Config
                config prevConfig =
                    { prevConfig | databaseURL = databaseURL }
            in
                ( { model | config = config model.config }
                , Cmd.none
                )

        SetApplication ->
            let
                app : Firebase.App
                app =
                    Firebase.init model.config

                nextModel : Model
                nextModel =
                    { model | app = Just app, path = Nothing, child = "", value = "" }
            in
                update SetPathReference nextModel

        UnsetApplication ->
            case model.app of
                Nothing ->
                    ( model
                    , Cmd.none
                    )

                Just app ->
                    ( { model | app = Nothing, path = Nothing, child = "", value = "" }
                    , Task.perform NoOp (Firebase.deinit app)
                    )

        ChangePath path ->
            let
                nextPath : Maybe String
                nextPath =
                    if path == "" then
                        Nothing
                    else
                        Just path
            in
                ( { model | path = nextPath }
                , Cmd.none
                )

        SetPathReference ->
            let
                reference : Maybe Reference
                reference =
                    case model.app of
                        Just app ->
                            app
                                |> Firebase.Database.init
                                |> Firebase.Database.ref model.path
                                |> Just

                        Nothing ->
                            Nothing
            in
                ( { model | reference = reference }
                , Cmd.none
                )

        UpdatedSnapshot snapshot ->
            let
                latestSnapshot : String
                latestSnapshot =
                    Firebase.Database.Snapshot.value snapshot
                        |> Json.Encode.encode 2
            in
                ( { model | latestSnapshot = latestSnapshot }
                , Cmd.none
                )

        ChangeChild child ->
            ( { model | child = child }
            , Cmd.none
            )

        ChangeValue value ->
            ( { model | value = value }
            , Cmd.none
            )

        SetChildValue ->
            let
                value : Json.Encode.Value
                value =
                    if model.value == "" then
                        Json.Encode.null
                    else
                        Json.Encode.string model.value

                command : Cmd Msg
                command =
                    case model.reference of
                        Just ref ->
                            ref
                                |> Firebase.Database.Reference.child model.child
                                |> Firebase.Database.Reference.set value
                                |> Task.attempt WriteStatus

                        Nothing ->
                            Cmd.none
            in
                ( model
                , command
                )

        NoOp () ->
            ( model
            , Cmd.none
            )

        WriteStatus (Ok _) ->
            let
                _ =
                    Debug.log "Firebase write success"
            in
                ( model
                , Cmd.none
                )

        WriteStatus (Err _) ->
            let
                _ =
                    Debug.log "Firebase write fail"
            in
                ( model
                , Cmd.none
                )



-- View


view : Model -> Html Msg
view model =
    case model.app of
        Nothing ->
            let
                disableSetApplication : Bool
                disableSetApplication =
                    ((String.isEmpty model.config.apiKey)
                        && (String.isEmpty model.config.databaseURL)
                    )
            in
                div
                    []
                    [ div [] [ text "Firebase Config" ]
                    , div
                        []
                        [ label [ for "firebase-api-key" ] [ text "Api Key: " ]
                        , input [ id "firebase-api-key", onInput ChangeApiKey, value model.config.apiKey ] []
                        ]
                    , div
                        []
                        [ label [ for "firebase-database-url" ] [ text "Database URL: " ]
                        , input [ id "firebase-database-url", onInput ChangeDatabaseURL, value model.config.databaseURL ] []
                        ]
                    , div
                        []
                        [ button [ onClick SetApplication, disabled disableSetApplication ] [ text "Connect to firebase app" ]
                        ]
                    ]

        Just _ ->
            div
                []
                [ div [] [ text "Firebase Config" ]
                , div [] [ text ("Api Key: " ++ model.config.apiKey) ]
                , div [] [ text ("Database URL: " ++ model.config.databaseURL) ]
                , button [ onClick UnsetApplication ] [ text "Disconnect from firebase app" ]
                , viewPath model
                ]


viewPath : Model -> Html Msg
viewPath model =
    let
        path : String
        path =
            Maybe.withDefault "" model.path
    in
        div
            []
            [ hr [] []
            , div [] [ text "Set database root path" ]
            , div
                []
                [ label [ for "path" ] [ text "Root path (can be blank): " ]
                , input [ id "path", onInput ChangePath, value path ] []
                ]
            , button [ onClick SetPathReference ] [ text "Subscribe" ]
            , viewUpdate model
            ]


viewUpdate : Model -> Html Msg
viewUpdate model =
    div
        []
        [ hr [] []
        , textarea [ readonly True, value model.latestSnapshot ] []
        , div
            []
            [ label [ for "child" ] [ text "Child path: " ]
            , input [ id "child", onInput ChangeChild, value model.child ] []
            ]
        , div
            []
            [ label [ for "value" ] [ text "New value (strings/empties only): " ]
            , input [ id "value", onInput ChangeValue, value model.value ] []
            ]
        , button [ onClick SetChildValue ] [ text "Set child value" ]
        ]
