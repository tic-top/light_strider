module View_finite_level exposing
    ( view_finite_level
    , view_select_finite
    )

{-| This function is used to show the model to the website


# Functions

@docs view_finite_level
@docs view_select_finite

-}

import Animate exposing (..)
import Animation as Ani exposing (px, rad, turn)
import Debug exposing (toString)
import Html exposing (..)
import Html.Attributes as HtmlAttr exposing (..)
import Html.Events exposing (..)
import Html.Events.Extra.Mouse as Mouse
import Instruction exposing (default_instruction_state)
import Light exposing (..)
import Map exposing (..)
import Parameter exposing (..)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr exposing (xlinkHref)
import Update exposing (..)
import Viewgame exposing (..)
import Viewmenu exposing (..)
import Viewscore exposing (..)


{-| This function is used to control all the finite level's view function
-}
view_finite_level : Model -> Html Msg
view_finite_level model =
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "position" "fixed"
        , style "left" "0"
        , style "top" "0"
        ]
        (view_game model
            ++ show_instruction model
            ++ [ p
                    [ Mouse.onClick Click
                    , style "width" "100%"
                    , style "height" "100%"
                    , style "position" "fixed"
                    , style "left" "0"
                    , style "top" "0"
                    ]
                    [ text <| toString model.progress, text <| toString model.gameset.timer, text <| toString (Maybe.withDefault 0 (List.head model.gameset.score)), text <| toString (Maybe.withDefault 0 (List.head (List.drop 1 model.gameset.score))) ]
               , audio
                    [ HtmlAttr.controls True
                    , HtmlAttr.src "./assets/Sound/gaming_soundtrack.ogg"
                    , HtmlAttr.id "audio-sample"
                    , HtmlAttr.autoplay True
                    , HtmlAttr.loop True
                    ]
                    []
               , audio
                    [ HtmlAttr.controls True
                    , HtmlAttr.src "assets/Sound/place_instrument.ogg"
                    , HtmlAttr.id "place_instrument"
                    , HtmlAttr.autoplay False
                    ]
                    []
               , audio
                    [ HtmlAttr.controls True
                    , HtmlAttr.src "assets/Sound/light_on_plant.ogg"
                    , HtmlAttr.id "light_plant"
                    , HtmlAttr.autoplay False
                    ]
                    []
               ]
        )


{-| This is a function that receives a list of Ani.State and the number num to get the numth element of the list.
For example you can write

    find_instruction_state model.instructions 2

to get the second instruction in the list model.instructions.

-}
find_instruction_state : List Ani.State -> Int -> Ani.State
find_instruction_state states num =
    List.drop (num - 1) states
        |> List.head
        |> Maybe.withDefault (default_instruction_state ( 0, 0 ))


{-| This is a function receive a model and results in a Html Msg to show the instructional textbox background in our instructional level.
For example when you are trying to give some instruction to player, you just need to add this as List (Html Msg) element to the view function

     default_textbox model

combine this function with default\_text funtion, you will be able to show players texts within a textbox. If you don't want to
use the default text attributes and textbox. You may also follow this two functions to design your own text and textbox.

-}
default_textbox : Model -> Html Msg
default_textbox model =
    div
        (Ani.render
            (find_instruction_state model.instructions 1)
            ++ [ style "width" "20%"
               , style "position" "fixed"
               , style "transform" "translate(-50%,0)"
               ]
        )
        []


{-| This is a function receive a model and results in List (Attribute Msg) to decide the attributes of the text.
For example when you are trying to give some instruction to player, you just need to add this as List (Html Msg) element to the view function

    [ default_textbox model
    , div (default_text model)
        [ text <| "whatever you want to show" ]
    ]

combine this function with default\_textbox funtion, you will be able to show players texts within a textbox. If you don't want to
use the default text attributes and textbox. You may also follow this two functions to design your own text and textbox.

-}
default_text : Model -> List (Attribute Msg)
default_text model =
    let
        ( window_x, window_y ) =
            model.gameset.windowsize
    in
    Ani.render (find_instruction_state model.instructions 2)
        ++ [ style "width" "20%"
           , style "height" "10%"
           , style "position" "fixed"
           , style "text-align" "center"
           , style "verticle-align" "middle"
           , style "font-size" (toString <| window_y / 30)
           ]


instruction_1_2 : Model -> List (Html Msg)
instruction_1_2 model =
    [ default_textbox model
    , div (default_text model)
        [ text "Welcome to the instruction cave, dear Intern. Please look around, your instructions are comming soon. Press [space] to continue." ]
    ]


instruction_1_4 : Model -> List (Html Msg)
instruction_1_4 model =
    let
        ( uppoint_x, uppoint_y ) =
            List.map (\x -> x.tail) model.gameset.light_path
                |> List.sortBy Tuple.second
                |> List.head
                |> Maybe.withDefault ( 0, 0 )

        ( viewx, viewy ) =
            view_transition model.gameset.windowsize model.gameset.uppos ( uppoint_x, uppoint_y - 0.5 )
    in
    [ default_textbox model
    , div (default_text model)
        [ text <| "Oops, you are stuck on a rock! You need to place a mirror, try clicking at a position." ]
    , div
        [ style "width" "100%"
        , style "height" "100%"
        , style "top" "0%"
        , style "left" "0%"
        , style "position" "fixed"
        ]
        [ Svg.svg
            [ SvgAttr.width "100%"
            , SvgAttr.height "100%"
            , SvgAttr.x "0"
            , SvgAttr.y "0"
            ]
            [ Svg.circle
                (Ani.render (find_instruction_state model.instructions 3)
                    ++ [ SvgAttr.cx (toString viewx)
                       , SvgAttr.cy (toString viewy)
                       ]
                )
                []
            ]
        , text <| "cursor test"
        ]
    ]


instruction_1_5 : Model -> List (Html Msg)
instruction_1_5 model =
    [ default_textbox model
    , div (default_text model)
        [ text <| "Press Q to place a mirror." ]
    ]


instruction_1_6 : Model -> List (Html Msg)
instruction_1_6 model =
    [ default_textbox model
    , div (default_text model)
        [ text <| "Good job, now the light is being reflected, try [space] to alter the angle of mirror." ]
    ]


instruction_1_7 : Model -> List (Html Msg)
instruction_1_7 model =
    [ default_textbox model
    , div (default_text model)
        [ text <| "You can also use [w] to set a splitter. The splitter cannot rotate, so be careful." ]
    ]


instruction_1_8 : Model -> List (Html Msg)
instruction_1_8 model =
    [ default_textbox model
    , div (default_text model)
        [ text <| "Great, now try to reach the bottom of this cave." ]
    ]


instruction_2_2 : Model -> List (Html Msg)
instruction_2_2 model =
    [ default_textbox model
    , div (default_text model)
        [ text "Let's learn about plants in this game. Press [space] to continue." ]
    ]


instruction_2_4 : Model -> List (Html Msg)
instruction_2_4 model =
    [ default_textbox model
    , div (default_text model)
        [ text "You may notice that there are plants in the game. Try to light up them and win points. Press [space] to continue." ]
    ]


instruction_2_7 : Model -> List (Html Msg)
instruction_2_7 model =
    [ default_textbox model
    , div (default_text model)
        [ text "Good job! Now you can continue and light up as many plants as possible. Press [Enter] to continue." ]
    ]


show_instruction : Model -> List (Html Msg)
show_instruction model =
    case ( model.gameset.gamestate, model.progress ) of
        ( _, Gaming (Finite 1 2) ) ->
            instruction_1_2 model

        ( Paused, Gaming (Finite 1 4) ) ->
            instruction_1_4 model

        ( Paused, Gaming (Finite 1 5) ) ->
            instruction_1_5 model

        ( Paused, Gaming (Finite 1 6) ) ->
            instruction_1_6 model

        ( Paused, Gaming (Finite 1 7) ) ->
            instruction_1_7 model

        ( _, Gaming (Finite 1 8) ) ->
            instruction_1_8 model

        ( _, Gaming (Finite 2 2) ) ->
            instruction_2_2 model

        ( Paused, Gaming (Finite 2 4) ) ->
            instruction_2_4 model

        ( _, Gaming (Finite 2 7) ) ->
            instruction_2_7 model

        _ ->
            []


view_lv1_button : Model -> List (Html Msg)
view_lv1_button model =
    [ button
        (Ani.render (find_button model.button (StartGame (Finite 1 0))).anistate
            ++ [ onMouseOver (Mouseover (StartGame (Finite 1 0)))
               , onMouseLeave (Mouseleave (StartGame (Finite 1 0)))
               , onClick (Start (Finite 1 0))
               , style "position" "absolute"
               , style "width" "16%"
               , style "height" "12%"
               , style "top" "40%"
               , style "left" "42%"
               , style "font-size" "25px"
               ]
        )
        [ text "Level 1" ]
    , button
        (Ani.render (find_page (find_button model.button (StartGame (Finite 1 0))).helppage 1)
            ++ [ style "position" "absolute"
               , style "height" "12%"
               , style "top" "40%"
               , style "left" "58%"
               ]
        )
        [ text "Learn to use Mirror and Splitter" ]
    ]


view_lv2_button : Model -> List (Html Msg)
view_lv2_button model =
    [ button
        (Ani.render (find_button model.button (StartGame (Finite 2 0))).anistate
            ++ [ onMouseOver (Mouseover (StartGame (Finite 2 0)))
               , onMouseLeave (Mouseleave (StartGame (Finite 2 0)))
               , onClick (Start (Finite 2 0))
               , style "position" "absolute"
               , style "width" "16%"
               , style "height" "12%"
               , style "top" "55%"
               , style "left" "42%"
               , style "font-size" "25px"
               ]
        )
        [ text "Level 2" ]
    , button
        (Ani.render (find_page (find_button model.button (StartGame (Finite 2 0))).helppage 1)
            ++ [ style "position" "absolute"
               , style "height" "12%"
               , style "left" "58%"
               , style "top" "55%"
               ]
        )
        [ text "Learn to identify the plants" ]
    ]


{-| This function is to view the selection page of finite level
-}
view_select_finite : Model -> Html Msg
view_select_finite model =
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "position" "fixed"
        , style "left" "0"
        , style "top" "0"
        , style "background-color" "black"
        ]
        ([ Svg.svg
            [ SvgAttr.width "100%"
            , SvgAttr.height "100%"
            , SvgAttr.x "0"
            , SvgAttr.y "0"
            ]
            [ Svg.image
                [ SvgAttr.width "100%"
                , SvgAttr.height "100%"
                , SvgAttr.x "0"
                , SvgAttr.y "0"
                , xlinkHref "./assets/Graphics/background.png"
                ]
                []
            , Svg.text_
                []
                [ text "haha" ]
            ]
         ]
            ++ view_lv1_button model
            ++ view_lv2_button model
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
                           , style "font-size" "25px"
                           ]
                    )
                    [ text "Back" ]
               ]
        )
