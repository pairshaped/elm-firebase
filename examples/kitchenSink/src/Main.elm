module Main exposing (..)

import Html exposing (Html, div, text, button)
import Html.Events exposing (onClick)
import Html.Attributes exposing (value)
import Task exposing (Task)
import Json.Decode
import Dict exposing (Dict)
import Firebase
import Firebase.Errors exposing (Error)
import Firebase.Database
import Firebase.Database.Query
import Firebase.Database.Reference
import Firebase.Database.Snapshot
import Firebase.Database.Types exposing (Database, Query, Reference, Snapshot)
import Firebase.Authentication
import Firebase.Authentication.User
import Firebase.Authentication.Types exposing (Auth, User)


-- Entry Point


main =
    let
        subscriptions : Model -> Sub Msg
        subscriptions model =
            let
                subscribeToReference : List (Sub Msg)
                subscribeToReference =
                    if model.subscription then
                        [ Firebase.Database.Reference.on "value" model.subRef SubscriptionChange ]
                    else
                        []

                subscribeToQuery : List (Sub Msg)
                subscribeToQuery =
                    [ Firebase.Database.Query.on "value" model.subQuery CollectionQuery ]
            in
                Sub.batch
                    (List.append subscribeToReference subscribeToQuery)
    in
        Html.programWithFlags
            { init = init
            , update = update
            , subscriptions = subscriptions
            , view = view
            }



-- Model


type alias Model =
    { app : Firebase.App
    , demo : Maybe String
    , test : Maybe { foo : String }
    , collection : Maybe (Dict String Int)
    , subscription : Bool
    , subRef : Reference
    , subQuery : Query
    , currentUser : Maybe User
    }


type alias Flags =
    { apiKey : String
    , authDomain : String
    , databaseURL : String
    , storageBucket : String
    , messagingSenderId : String
    }


initialModel : Flags -> Model
initialModel firebaseConfig =
    let
        app : Firebase.App
        app =
            Firebase.init firebaseConfig

        database : Database
        database =
            app
                |> Firebase.Database.init

        subRef : Reference
        subRef =
            database
                |> Firebase.Database.ref (Just "subscriptionTest")

        subQuery : Query
        subQuery =
            database
                |> Firebase.Database.ref (Just "collection")
                |> Firebase.Database.Reference.orderByValue
                |> Firebase.Database.Query.limitToLast 3
    in
        { app = app
        , demo = Nothing
        , test = Nothing
        , collection = Nothing
        , subscription = True
        , subRef = subRef
        , subQuery = subQuery
        , currentUser = Nothing
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
                |> Firebase.Database.init
                |> Firebase.Database.ref (Just "demo")
    in
        ( model
        , Task.perform ReadDemo (Firebase.Database.Reference.once "value" ref)
        )



-- Update


type Msg
    = ReadDemo Snapshot
    | SubscriptionChange Snapshot
    | ToggleSubscription
    | CollectionQuery Snapshot
    | SignInAnonymously
    | SignedIn (Result Error User)
    | SignOut
    | NoOp ()


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReadDemo snapshot ->
            let
                demo : Maybe String
                demo =
                    snapshot
                        |> Firebase.Database.Snapshot.value
                        |> Json.Decode.decodeValue (Json.Decode.string)
                        |> Result.withDefault ""
                        |> Just
            in
                ( { model | demo = demo }
                , Cmd.none
                )

        SubscriptionChange snapshot ->
            let
                value : Maybe { foo : String }
                value =
                    let
                        decoder =
                            Json.Decode.map
                                assembleFooObj
                                (Json.Decode.field "foo" Json.Decode.string)

                        assembleFooObj foo =
                            { foo = foo }
                    in
                        snapshot
                            |> Firebase.Database.Snapshot.value
                            |> Json.Decode.decodeValue decoder
                            |> Result.toMaybe
            in
                ( { model | test = value }
                , Cmd.none
                )

        ToggleSubscription ->
            ( { model | subscription = not model.subscription }
            , Cmd.none
            )

        CollectionQuery snapshot ->
            let
                value : Maybe (Dict String Int)
                value =
                    let
                        decoder =
                            (Json.Decode.dict Json.Decode.int)
                    in
                        snapshot
                            |> Firebase.Database.Snapshot.value
                            |> Json.Decode.decodeValue decoder
                            |> Result.toMaybe
            in
                ( { model | collection = value }
                , Cmd.none
                )


        SignInAnonymously ->
            let
                auth : Auth
                auth =
                    model.app
                        |> Firebase.Authentication.init
            in
                ( model
                , Task.attempt SignedIn (Firebase.Authentication.signInAnonymously auth)
                )


        SignedIn (Ok user) ->
            ( { model | currentUser = Just user }
            , Cmd.none
            )

        SignedIn (Err err) ->
            let
                _ = Debug.log "SignedIn.fail" err
            in
                ( { model | currentUser = Nothing }
                , Cmd.none
                )

        SignOut ->
            let
                auth : Auth
                auth =
                    model.app
                        |> Firebase.Authentication.init
            in
                ( { model | currentUser = Nothing }
                , Task.perform NoOp (Firebase.Authentication.signOut auth)
                )

        NoOp _ ->
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
        , div [] [ text ("Demo value = " ++ (toString model.demo)) ]
        , div [] [ text ("Subscription value = " ++ (toString model.test)) ]
        , button
            [ onClick ToggleSubscription
            ]
            [ text
                ("Turn subscription "
                    ++ (if model.subscription then
                            "Off"
                        else
                            "On"
                       )
                )
            ]
        , div [] [ text ("Collection query = " ++ (toString model.collection)) ]
        , viewSignIn model.currentUser
        ]

viewSignIn : Maybe User -> Html Msg
viewSignIn maybeUser =
    case maybeUser of
        Just user ->
            div
                []
                [ div [] [ text "Successfully authenticated" ]
                , div [] [ text ("Is anonymous? " ++ (toString (Firebase.Authentication.User.isAnonymous user)))]
                , button [ onClick SignOut ] [ text "Sign out" ]
                ]

        Nothing ->
            button [ onClick SignInAnonymously ] [ text "Sign in anonymously" ]
