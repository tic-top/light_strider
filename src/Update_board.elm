module Update_board exposing (update_score_board)

{-| This program is used to control the animation of score board


# Functions

@docs update_score_board

-}

import Animate exposing (..)
import Animation as Ani exposing (percent, px, rad, turn)
import Map exposing (..)
import Parameter exposing (..)
import Polygoninside exposing (ispolygoninside)
import Random exposing (..)
import Scoreboard exposing (..)
import Update_small exposing (..)



-- update the score board.


{-| This function is the subupdate function controls the score board
Mouseclick means some button is clicked and it will redirect to the corresponding stage of the game
Mouseover means the player put mouse on one button and it will trigger its animation
Mouseleave means the player leave mouse on one button and it will trigger its animation
GetViewport means the program receive a msg of the current size of web browser and it will update the windowsize
Resize means the size of web browser is changing and it will update the windowsize
Tick elapsed means controls the animation of the score board
Animate animMsg means there is animation in the current stage and it will receive the msg and continue the animation
-}
update_score_board : Model -> Msg -> ( Model, Cmd Msg )
update_score_board model msg =
    case msg of
        Mouseclick button_type ->
            case button_type of
                ReturnMenu ->
                    return_menu model

                Reset level ->
                    reset_level model level

                _ ->
                    ( model, Cmd.none )

        GetViewport { viewport } ->
            update_viewport model viewport

        Resize wid hei ->
            update_resize model wid hei

        Tick elapsed ->
            show_score_board model elapsed

        Mouseover button_type ->
            mouseover model button_type

        Mouseleave button_type ->
            mouseleave model button_type

        Animate animMsg ->
            let
                board =
                    model.scoreboard

                ( curtain, number ) =
                    board.score

                nboard =
                    { board
                        | board = Ani.update animMsg board.board
                        , score = ( Ani.update animMsg curtain, number )
                        , newrecord = Ani.update animMsg board.newrecord
                        , reset_button = Ani.update animMsg board.reset_button
                        , menu_button = Ani.update animMsg board.menu_button
                    }
            in
            ( { model
                | scoreboard = nboard
              }
            , Cmd.none
            )

        _ ->
            ( model, Cmd.none )


reset_level : Model -> Level -> ( Model, Cmd Msg )
reset_level model level =
    let
        m =
            map_initial

        t =
            [ ( 1, 1 ) ]
    in
    case level of
        Endless ->
            let
                nset =
                    Game_Set [ Line_element ( 5, -1 ) ( 5, 10 ), Line_element ( 4, -1 ) ( 4, 10 ) ] [] [] model.gameset.windowsize Notbegin 0 0 m t 0 []
            in
            ( Model nset (Random.initialSeed 2) None ( 0, 0 ) Select_Pos (Gaming level) (Ani.style [ Ani.opacity 0.0 ]) [] init_board model.highscore [] model.volume, map_brick_generate )

        Finite _ a ->
            let
                nset =
                    Game_Set [ Line_element ( 4.5, -1 ) ( 4.5, 10 ) ] [] [] model.gameset.windowsize Notbegin 0 0 m t 0 []
            in
            ( Model nset (Random.initialSeed 2) None ( 0, 0 ) Select_Pos (Gaming (Finite 0 0)) (Ani.style [ Ani.opacity 0.0 ]) finite_buttons init_board model.highscore [] model.volume, map_brick_generate )
