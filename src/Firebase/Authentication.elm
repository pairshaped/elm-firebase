module Firebase.Authentication
    exposing
        ( init
        , currentUser
        , confirmPasswordReset
        , createUserWithEmailAndPassword
        , fetchProvidersForEmail
        , sendPasswordResetEmail
        , signInAnonymously
        , signInWithEmailAndPassword
        , signOut
        , verifyPasswordResetCode
        )

import Task exposing (Task)
import Firebase
import Firebase.Errors exposing (Error)
import Firebase.Authentication.Types exposing (Auth, User)
import Native.Authentication


{- TODO: I'm currently skipping the following methods:

     * auth.applyActionCode
     * auth.checkActionCode
     * auth.getRedirectResult
     * auth.onAuthStateChanges

   I will look into adding these later if there are any needs
-}
-- Methods


init : Firebase.App -> Auth
init =
    Native.Authentication.init


currentUser : Auth -> Maybe User
currentUser =
    Native.Authentication.currentUser


confirmPasswordReset : String -> String -> Auth -> Task Error ()
confirmPasswordReset =
    Native.Authentication.confirmPasswordReset


createUserWithEmailAndPassword : String -> String -> Auth -> Task Error User
createUserWithEmailAndPassword =
    Native.Authentication.createUserWithEmailAndPassword


fetchProvidersForEmail : String -> Auth -> Task x (List String)
fetchProvidersForEmail =
    Native.Authentication.fetchProvidersForEmail


sendPasswordResetEmail : String -> Auth -> Task x ()
sendPasswordResetEmail =
    Native.Authentication.sendPasswordResetEmail


signInAnonymously : Auth -> Task Error User
signInAnonymously =
    Native.Authentication.signInAnonymously


signInWithEmailAndPassword : String -> String -> Auth -> Task Error User
signInWithEmailAndPassword =
    Native.Authentication.signInWithEmailAndPassword


signOut : Auth -> Task x ()
signOut =
    Native.Authentication.signOut


verifyPasswordResetCode : String -> Auth -> Task x String
verifyPasswordResetCode =
    Native.Authentication.verifyPasswordResetCode
