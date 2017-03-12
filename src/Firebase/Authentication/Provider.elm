module Firebase.Authentication.Provider
    exposing
        ( providerId
        , tokenCredential
        , emailPasswordCredential
        , email
        , facebook
        , github
        , google
        , twitter
        , addScope
        , setCustomParameters
        )

import Json.Encode
import Firebase.Authentication.Types exposing(Auth, User, Provider, AuthCredential)
import Native.Authentication.Provider


providerId : Provider -> String
providerId =
    Native.Authentication.Provider.id


tokenCredential : String -> Provier -> AuthCredential
tokenCredential =
    Native.Authentication.Provider.tokenCredential


emailPasswordCredential : String -> String -> Provider -> AuthCredential
emailPasswordCredential =
    Native.Authentication.Provider.emailAndPasswordCredential


email : () -> Provider
email =
    Native.Authentication.Provider.email


facebook : () -> Provider
facebook =
    Native.Authentication.Provider.facebook


github : () -> Provider
github =
    Native.Authentication.Provider.github


google : () -> Provider
google =
    Native.Authentication.Provider.google


twitter : () -> Provider
twitter =
    Native.Authentication.Provider.twitter


addScope : String -> Provider -> Provider
addScope =
    Native.Authentication.Provider.addScope


setCustomParameters : Json.Encode.Value -> Provider -> Provider
setCustomParameters =
    Native.Authentication.Provider.setCustomParameters
