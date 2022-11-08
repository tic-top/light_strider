module Viewscore exposing (view_score_board)

{-| This program is used to view the model during showing the scoreboard


# Functions

@docs view_score_board

-}

import Animation as Ani exposing (px, rad, turn)
import Debug exposing (toString)
import Html exposing (..)
import Html.Attributes as HtmlAttr exposing (..)
import Html.Events exposing (..)
import Parameter exposing (..)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr exposing (xlinkHref)
import Viewgame exposing (..)


{-| This function is to control all the view when showing the score board
-}
view_score_board : Model -> Html Msg
view_score_board model =
    let
        board =
            model.scoreboard

        scorelist =
            model.gameset.score
                |> List.sum

        currentscore =
            scorelist * 10 + model.gameset.maptimer * 5

        rank =
            List.partition (\x -> x > currentscore) model.highscore
                |> Tuple.first
                |> List.length

        progress =
            model.progress
    in
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "position" "fixed"
        , style "left" "0"
        , style "top" "0"
        ]
        [ div
            [ style "width" "100%"
            , style "height" "100%"
            , style "position" "fixed"
            , style "left" "0"
            , style "top" "0"
            , style "opacity" "0.5"
            ]
            (view_game model)
        , div
            [ style "width" "100%"
            , style "height" "100%"
            , style "position" "fixed"
            , style "left" "30%"
            , style "top" "0"
            , style "width" "40%"
            ]
            ([ button
                (Ani.render board.board
                    ++ [ HtmlAttr.style "position" "absolute"
                       , HtmlAttr.style "width" "100%"
                       , HtmlAttr.style "top" "0"
                       ]
                )
                (view_mainboard model.highscore rank progress
                    ++ [ view_flower model.gameset.score
                       ]
                )
             , view_score board
             ]
                ++ (if rank == 0 && progress == ShowScoreBoard Endless then
                        [ view_new_record board ]

                    else
                        []
                   )
                ++ view_button progress board
            )
        ]


view_flower : List Int -> Html Msg
view_flower scores =
    let
        type1 =
            List.filter (\x -> x == 1) scores
                |> List.length

        type2 =
            List.filter (\x -> x == 2) scores
                |> List.length

        type3 =
            List.filter (\x -> x == 3) scores
                |> List.length
    in
    Svg.svg
        [ SvgAttr.width "100%"
        , SvgAttr.height "100%"
        , SvgAttr.x "0px"
        , SvgAttr.y "0px"
        ]
        [ Svg.image
            [ SvgAttr.height "10%"
            , SvgAttr.width "40%"
            , SvgAttr.x "0%"
            , SvgAttr.y "20%"
            , SvgAttr.xlinkHref "./assets/Graphics/p1_2.png"
            ]
            []
        , Svg.text_
            [ SvgAttr.height "10%"
            , SvgAttr.width "50%"
            , SvgAttr.x "30%"
            , SvgAttr.y "26%"
            , SvgAttr.fill "white"
            , SvgAttr.fontSize "35px"
            , SvgAttr.opacity "0.5"
            , SvgAttr.stroke "black"
            ]
            [ Svg.text ("x " ++ toString type1) ]
        , Svg.image
            [ SvgAttr.height "10%"
            , SvgAttr.width "40%"
            , SvgAttr.x "0%"
            , SvgAttr.y "30%"
            , SvgAttr.xlinkHref "./assets/Graphics/p2_2.png"
            ]
            []
        , Svg.text_
            [ SvgAttr.height "10%"
            , SvgAttr.width "50%"
            , SvgAttr.x "30%"
            , SvgAttr.y "38%"
            , SvgAttr.fill "white"
            , SvgAttr.fontSize "35px"
            , SvgAttr.opacity "0.5"
            , SvgAttr.stroke "black"
            ]
            [ Svg.text ("x " ++ toString type2) ]
        , Svg.image
            [ SvgAttr.height "10%"
            , SvgAttr.width "40%"
            , SvgAttr.x "0%"
            , SvgAttr.y "42%"
            , SvgAttr.xlinkHref "./assets/Graphics/p3_2.png"
            ]
            []
        , Svg.text_
            [ SvgAttr.height "10%"
            , SvgAttr.width "50%"
            , SvgAttr.x "30%"
            , SvgAttr.y "50%"
            , SvgAttr.fill "white"
            , SvgAttr.fontSize "35px"
            , SvgAttr.opacity "0.5"
            , SvgAttr.stroke "black"
            ]
            [ Svg.text ("x " ++ toString type3) ]
        ]


view_mainboard : List Int -> Int -> ProgressState -> List (Html Msg)
view_mainboard scores rank progress =
    [ p
        [ HtmlAttr.style "position" "absolute"
        , HtmlAttr.style "width" "100%"
        , HtmlAttr.style "top" "0"
        , HtmlAttr.style "height" "25%"
        , HtmlAttr.style "font-size" "60px"
        , HtmlAttr.style "font-weight" "bolder"
        , HtmlAttr.style "font-family" "Palace Script MT"
        ]
        [ Html.text "Score Board" ]
    , p
        [ HtmlAttr.style "position" "absolute"
        , HtmlAttr.style "width" "100%"
        , HtmlAttr.style "top" "23%"
        , HtmlAttr.style "height" "200px"
        , HtmlAttr.style "left" "18%"
        , HtmlAttr.style "font-size" "25px"
        , HtmlAttr.style "font-weight" "bolder"
        , HtmlAttr.style "color" "white"
        ]
        [ Html.text "★ Your Score: ★" ]
    ]
        ++ [ p
                [ HtmlAttr.style "position" "absolute"
                , HtmlAttr.style "width" "100%"
                , HtmlAttr.style "top" "50%"
                , HtmlAttr.style "height" "40%"
                , HtmlAttr.style "font-size" "30px"
                , HtmlAttr.style "font-weight" "bolder"
                , HtmlAttr.style "color" "white"
                ]
                (case progress of
                    ShowScoreBoard Endless ->
                        [ Html.text "★ High Score: ★" ]

                    _ ->
                        [ Html.text "Teaching Level" ]
                )
           ]
        ++ (case progress of
                ShowScoreBoard Endless ->
                    view_highscore (List.take 3 scores) (List.length scores) rank

                _ ->
                    []
           )


view_highscore : List Int -> Int -> Int -> List (Html Msg)
view_highscore scores total rank =
    case scores of
        [] ->
            []

        x :: xs ->
            let
                no =
                    Basics.min total 3 - List.length xs

                name =
                    if no == rank + 1 then
                        "     Me     "

                    else
                        "Other Player"

                canvas =
                    p
                        [ HtmlAttr.style "position" "absolute"
                        , HtmlAttr.style "width" "100%"
                        , HtmlAttr.style "top" (toString (55 + no * 10) ++ "%")
                        , HtmlAttr.style "height" "20%"
                        , HtmlAttr.style "font-size" "20px"
                        , HtmlAttr.style "font-weight" "bolder"
                        , HtmlAttr.style "color" "yellow"
                        ]
                        [ Html.text ("NO." ++ toString no ++ "  " ++ name ++ "  " ++ toString x) ]
            in
            [ canvas ] ++ view_highscore xs total rank


view_score : ScoreBoard -> Html Msg
view_score board =
    button
        (Ani.render
            (Tuple.first board.score)
            ++ [ HtmlAttr.style "position" "absolute"
               , HtmlAttr.style "width" "30%"
               , HtmlAttr.style "left" "55%"
               , HtmlAttr.style "font-size" "30px"
               , HtmlAttr.style "background-opacity" "0.0"
               , HtmlAttr.style "while_space" "pre-lines"
               ]
        )
        [ Html.text
            (toString (Tuple.second board.score))
        ]


view_new_record : ScoreBoard -> Html Msg
view_new_record board =
    button
        (Ani.render board.newrecord
            ++ [ HtmlAttr.style "position" "absolute"
               , HtmlAttr.style "width" "150px"
               , HtmlAttr.style "font-size" "20px"
               , HtmlAttr.style "background-opacity" "0.0"
               ]
        )
        [ Html.text "New Record!" ]


view_button : ProgressState -> ScoreBoard -> List (Html Msg)
view_button progress board =
    let
        nlevel =
            case progress of
                ShowScoreBoard level ->
                    level

                _ ->
                    Finite 0 0
    in
    [ button
        (Ani.render board.reset_button
            ++ [ HtmlAttr.style "position" "absolute"
               , HtmlAttr.style "font-size" "25px"
               , HtmlAttr.style "width" "40%"
               , onMouseOver (Mouseover (Reset nlevel))
               , onMouseLeave (Mouseleave (Reset nlevel))
               , onClick (Mouseclick (Reset nlevel))
               ]
        )
        [ case nlevel of
            Endless ->
                Html.text "★ Reset ★"

            _ ->
                Html.text "★ Back ★"
        ]
    , button
        (Ani.render board.menu_button
            ++ [ HtmlAttr.style "position" "absolute"
               , HtmlAttr.style "font-size" "25px"
               , HtmlAttr.style "width" "40%"
               , onMouseOver (Mouseover ReturnMenu)
               , onMouseLeave (Mouseleave ReturnMenu)
               , onClick (Mouseclick ReturnMenu)
               ]
        )
        [ Html.text "★ Menu ★" ]
    ]
