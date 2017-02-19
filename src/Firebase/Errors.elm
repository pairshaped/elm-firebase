module Firebase.Errors exposing (Error)


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
