module View_helppage exposing (view_helppage)

{-| This program is used to view the helppage in the game


# Functions

@docs view_helppage

-}

import Animate exposing (..)
import Animation as Ani exposing (px, rad, turn)
import Debug exposing (toString)
import Html exposing (..)
import Html.Attributes as HtmlAttr exposing (..)
import Html.Events exposing (..)
import Parameter exposing (..)
import Update exposing (..)
import Viewgame exposing (..)


{-| This is a function that receives a Float-type height and gives a List(Attribute msg) for background text. For example you can write

    div
        (default_background_text 36)
        [ text "whatever you want" ]

to get a background text with relatively 36 height in the screen. You can also follow this function to design your own background text.

-}
default_background_text : Float -> List (Attribute msg)
default_background_text height =
    [ style "width" "50%"
    , style "height" "12%"
    , style "top" (toString height ++ "%")
    , style "left" "0%"
    , style "position" "fixed"
    , style "text-align" "center"
    , style "verticle-align" "middle"
    , style "font-size" "20px"
    , style "color" "rgb(255,225,121)"
    ]


{-| This is a function that receives a Float-type height and gives a List(Attribute msg) for help page text. For example you can write

    div
        (default_helppage_text 36)
        [ text "whatever you want" ]

to get a help page text with relatively 36 height in the screen. You can also follow the mode of this function to design your own help page text.

-}
default_helppage_text : Float -> List (Attribute msg)
default_helppage_text height =
    [ style "width" "50%"
    , style "height" "12%"
    , style "top" (toString height ++ "%")
    , style "left" "50%"
    , style "position" "fixed"
    , style "text-align" "center"
    , style "verticle-align" "middle"
    , style "font-size" "25px"
    , style "color" "rgb(255,225,121)"
    ]


{-| This function is to view the help page of the game
-}
view_helppage : Model -> Html Msg
view_helppage model =
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "position" "fixed"
        , style "left" "0"
        , style "top" "0"
        , style "background-color" "black"
        ]
        (view_game model
            ++ [ button
                    (Ani.render (find_button model.button ReturnMenu).anistate
                        ++ [ onMouseOver (Mouseover ReturnMenu)
                           , onMouseLeave (Mouseleave ReturnMenu)
                           , onClick (Mouseclick ReturnMenu)
                           , style "position" "absolute"
                           , style "width" "16%"
                           , style "height" "12%"
                           , style "top" "75%"
                           , style "left" "42%"
                           , style "font-size" "15px"
                           ]
                    )
                    [ text "Back" ]
               ]
            ++ view_help_msg
            ++ view_background_msg
            ++ view_textbox
        )


view_textbox : List (Html msg)
view_textbox =
    [ div
        [ style "width" "40%"
        , style "height" "62%"
        , style "top" "10%"
        , style "position" "fixed"
        , style "left" "5%"
        , style "background-color" "black"
        , style "opacity" "0.4"
        ]
        []
    , div
        [ style "width" "40%"
        , style "height" "62%"
        , style "top" "10%"
        , style "position" "fixed"
        , style "left" "55%"
        , style "background-color" "black"
        , style "opacity" "0.4"
        ]
        []
    ]


view_background_msg : List (Html msg)
view_background_msg =
    [ div
        [ style "width" "50%"
        , style "height" "12%"
        , style "top" "12%"
        , style "left" "0%"
        , style "position" "fixed"
        , style "text-align" "center"
        , style "verticle-align" "middle"
        , style "font-size" "30px"
        , style "color" "rgb(255,225,0)"
        ]
        [ text "Background Story:" ]
    , div
        (default_background_text 20)
        [ text "In the deepest part of a cave," ]
    , div
        (default_background_text 28)
        [ text "grow some valuable rare plants!" ]
    , div
        (default_background_text 36)
        [ text "Only you can help grow the endangered species." ]
    , div
        (default_background_text 44)
        [ text "Manipulate the optical instruments" ]
    , div
        (default_background_text 52)
        [ text "and cast light on the plants!" ]
    ]


view_help_msg : List (Html msg)
view_help_msg =
    [ div
        [ style "width" "50%"
        , style "height" "12%"
        , style "top" "12%"
        , style "left" "50%"
        , style "position" "fixed"
        , style "text-align" "center"
        , style "verticle-align" "middle"
        , style "font-size" "30px"
        , style "color" "rgb(255,225,0)"
        ]
        [ text "Game Control:" ]
    , div
        (default_helppage_text 20)
        [ text "Learning By Playing! Check the Manoeuvre." ]
    , div
        (default_helppage_text 30)
        [ text "Click to select a position" ]
    , div
        (default_helppage_text 40)
        [ text "[q] to set a mirror, [w] for splitter" ]
    , div
        (default_helppage_text 50)
        [ text "[space] to rotate a mirror" ]
    , div
        (default_helppage_text 60)
        [ text "[↑] [↓] to control the volume" ]
    ]
