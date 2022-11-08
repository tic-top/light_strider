module Viewmenu exposing
    ( view_menu
    , view_open_animation
    )

{-| This program is used to view the model during and before the menu pages


# Functions

@docs view_menu
@docs view_open_animation

-}

import Animate exposing (..)
import Animation as Ani exposing (px, rad, turn)
import Debug exposing (toString)
import Html exposing (..)
import Html.Attributes as HtmlAttr exposing (..)
import Html.Events exposing (..)
import Parameter exposing (..)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr exposing (height, width, x, xlinkHref, y)
import Viewgame exposing (..)


{-| This function is to view the model before the menu pages
-}
view_open_animation : Model -> Html Msg
view_open_animation model =
    let
        ( x, y ) =
            model.gameset.windowsize
    in
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "position" "fixed"
        , style "left" "0"
        , style "top" "0"
        , style "background-color" "black"
        ]
        [ div
            (Ani.render
                model.animatecurtain
                ++ [ style "width" "100%"
                   , style "height" "100%"
                   , style "position" "fixed"
                   , style "left" "0"
                   , style "top" "0"
                   ]
            )
            [ img
                [ style "height" "100%"
                , style "position" "absolute"
                , style "left" (toString (round (x / 2)) ++ "px")
                , style "top" "0px"
                , style "transform" "translate(-50%,0)"
                , HtmlAttr.src "./assets/Graphics/Grouplogoname.png"
                , HtmlAttr.class "pic"
                ]
                []
            ]
        ]


{-| This function is to view the menu pages
-}
view_menu : Model -> Html Msg
view_menu model =
    let
        ( window_x, window_y ) =
            model.gameset.windowsize
    in
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "position" "fixed"
        , style "left" "0"
        , style "top" "0"
        , style "background-color" "black"
        ]
        (view_game model
            ++ [ div
                    [ style "width" "100%"
                    , style "height" "100%"
                    , style "position" "fixed"
                    , style "left" "0"
                    , style "top" "0"
                    ]
                    ([ Svg.svg
                        [ SvgAttr.width "100%"
                        , SvgAttr.height "100%"
                        , SvgAttr.x "0"
                        , SvgAttr.y "0"
                        ]
                        [ Svg.image
                            [ SvgAttr.width "76.5%"
                            , SvgAttr.height "45%"
                            , SvgAttr.x "11%"
                            , SvgAttr.y "8%"
                            , SvgAttr.xlinkHref "./assets/Graphics/gametitle.png"
                            ]
                            []
                        ]
                     ]
                        ++ default_button model (StartGame (Finite 0 0)) 45 "Manoeuvre!" "Learn In Simulate Scene!"
                        ++ default_button model (StartGame Endless) 60 "Endless!" "Explore the real world!!"
                        ++ default_button model Help 75 "Help" "help page"
                    )
               ]
        )


{-| This function helps to define a button in the menu pages, use the function like this

    default_button model button_type topposition text1 text2

in which topposition is the y-position of the top of the button in the web browser, text1 is a string that you want to show on the button, text2 is a string that you want to show on the related button help pages.

-}
default_button : Model -> ButtonType -> Float -> String -> String -> List (Html Msg)
default_button model button_type top text1 text2 =
    [ button
        (Ani.render (find_button model.button button_type).anistate
            ++ [ onMouseOver (Mouseover button_type)
               , onMouseLeave (Mouseleave button_type)
               , onClick
                    (case button_type of
                        Help ->
                            Mouseclick button_type

                        StartGame a ->
                            Start a

                        _ ->
                            None
                    )
               ]
            ++ default_button_attr top
        )
        [ text text1 ]
    , button
        (Ani.render (find_page (find_button model.button button_type).helppage 1)
            ++ [ style "position" "absolute"
               , style "height" "12%"
               , style "top" ((toString <| top) ++ "%")
               , style "left" "58%"
               ]
        )
        [ text text2 ]
    ]


default_button_attr : Float -> List (Attribute msg)
default_button_attr top =
    [ style "position" "absolute"
    , style "width" "16%"
    , style "height" "12%"
    , style "top" ((toString <| top) ++ "%")
    , style "left" "42%"
    , style "font-size" "25px"
    ]
