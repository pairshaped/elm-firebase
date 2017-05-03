module Firebase.Errors exposing (Error)


{-| Errors codes that firebase could return

# Definitions
@docs Error

-}

{-| Error contains the main error codes the average app will face
-}
type Error
    = AppDeleted
    | AppNotAuthorized
    | ArgumentError
    | InvalidApiKey
    | InvalidUserToken
    | NetworkRequestFailed
    | OperationNotAllowed
    | RequiresRecentLogin
    | TooManyRequests
    | UnauthorizedDomain
    | UserTokenExpired
    | WebStorageUnsupported
