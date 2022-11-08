module View exposing (view)

{-| This program controls the general view function of the game


# Functions

@docs view

-}

import Html exposing (..)
import Parameter exposing (..)
import View_finite_level exposing (..)
import View_helppage exposing (..)
import Viewgame exposing (..)
import Viewmenu exposing (..)
import Viewscore exposing (..)


{-| This function is to control all the view funcions in the game and to show the correct one in the correct stage
-}
view : Model -> Html Msg
view model =
    case model.progress of
        Gaming Endless ->
            view_playing model

        Gaming (Finite 0 _) ->
            view_select_finite model

        Gaming (Finite _ _) ->
            view_finite_level model

        Openanimation ->
            view_open_animation model

        Menu ->
            view_menu model

        Helppage ->
            view_helppage model

        Fadeout _ ->
            view_fade_out model

        ShowScoreBoard _ ->
            view_score_board model
