module Tests exposing (..)

import Test exposing (..)
import Expect


all : Test
all =
    describe "Dummy"
        [ describe "tests"
            [ test "pass" <|
                \() ->
                    Expect.equal True True
            ]
        ]
