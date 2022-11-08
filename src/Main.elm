module Main exposing (main)

{-| This program is used to generate our game website in Elm.


# Functions

@docs main

-}

import Animation as Ani exposing (px, rad, turn)
import Browser
import Browser.Dom exposing (getViewport)
import Browser.Events exposing (onAnimationFrameDelta, onKeyDown, onKeyUp, onResize)
import Html.Events exposing (keyCode)
import Json.Decode as Decode
import Map exposing (..)
import Parameter exposing (GameState(..), Line_element, Model, Msg(..), PlaceState(..), ProgressState(..), init_model)
import Task
import Update exposing (..)
import View exposing (..)


{-| This is the main function of our game
-}
main : Program () Model Msg
main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



--Initialization


init : () -> ( Model, Cmd Msg )
init a =
    ( init_model, Cmd.batch [ Task.perform GetViewport getViewport, map_brick_generate ] )


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        allthings =
            List.map (\{ anistate, helppage, buttontype } -> List.concat [ [ anistate ], helppage ]) model.button
                |> List.concat

        scoreboard =
            (\{ board, state, score, newrecord, reset_button, menu_button } -> [ board, Tuple.first score, newrecord, reset_button, menu_button ]) model.scoreboard
    in
    Sub.batch
        [ onAnimationFrameDelta Tick -- Sent when some time has elapsed
        , onResize Resize -- Sent when the browser window is resized
        , onKeyDown (Decode.map key_down keyCode)
        , onKeyUp (Decode.map key_up keyCode)
        , Ani.subscription Animate ([ model.animatecurtain ] ++ allthings ++ scoreboard ++ model.instructions)
        ]
