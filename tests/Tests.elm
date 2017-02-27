module Tests exposing (..)

import Test exposing (..)
import Expect
import Firebase


all : Test
all =
    describe "Dummy"
        [ describe "tests"
            [ test "pass" <|
                \() ->
                    Expect.equal True True
            ]
        ]
