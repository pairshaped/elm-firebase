module Firebase.Database.Query
    where
        { subscription = MySub
        }
    exposing
        ( startAt
        , endAt
        , equalTo
        , limitToFirst
        , limitToLast
        , once
        -- , subscribe
        )


import Firebase.Database.Types exposing (Query)
import Native.Database.Query


startAt : Json.Encode.Value -> Maybe String -> Query -> Query
startAt = Native.Database.Query.startAt


endAt : Json.Encode.Value -> Maybe String -> Query -> Query
endAt = Native.Database.Query.endAt


equalTo : Json.Encode.Value -> Maybe String -> Query -> Query
equalTo = Native.Database.Query.equalTo


limitToFirst : Int -> Query -> Query
limitToFirst = Native.Database.Query.limitToFirst


limitToLast : Int -> Query -> Query
limitToLast = Native.Database.Query.limitToLast


once : String -> Query -> Task Never Snapshot
once = Native.Database.Query.once


-- subscribe : String -> Query -> (Snapshot -> msg) -> Sub msg
-- subscribe event query tagger =
--     subscription (On event query tagger)
