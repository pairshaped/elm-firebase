module Firebase.Authentication.User
    exposing
        ( displayName
        , email
        , emailVerified
        , isAnonymous
        , photoURL
        , providerId
        , uid
        , reload
        , toJSON
        )


import Json.Decode
import Task exposing (Task)
import Firebase.Authentication.Types exposing (User)
import Native.Authentication.User


{-  TODO:
      * user.providerData
      * refreshToken
      * delete
      * getToken
      * link
      * linkWithPopup
      * linkWithRedirect
      * reauthenticate
      * sendEmailVerifiecation
      * unlink
      * updateEmail
      * updatedPassword
      * updateProfile

-}

-- Property Methods


displayName : User -> String
displayName =
    Native.Authentication.User.displayName


email : User -> String
email =
    Native.Authentication.User.email


emailVerified : User -> Bool
emailVerified =
    Native.Authentication.User.emailVerified


isAnonymous : User -> Bool
isAnonymous =
    Native.Authentication.User.isAnonymous


photoURL : User -> Maybe String
photoURL =
    Native.Authentication.User.photoURL


providerId : User -> String
providerId =
    Native.Authentication.User.providerId


uid : User -> String
uid =
    Native.Authentication.User.uid


-- User Function Methods


reload : User -> Task x ()
reload =
    Native.Authentication.User.reload


toJSON : User -> Json.Decode.Value
toJSON =
    Native.Authentication.User.toJSON
