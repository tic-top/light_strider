module Animate exposing
    ( button_appear
    , find_button
    , find_page
    , finite_buttons
    , set_open_animation
    , zoomin_button
    , zoomout_button
    )

{-| This program is used to control the animation relating to the menu page and the open animation


# Functions

@docs button_appear
@docs find_button
@docs find_page
@docs finite_buttons
@docs set_open_animation
@docs zoomin_button
@docs zoomout_button

-}

import Animation as Ani exposing (px)
import Map exposing (..)
import Parameter exposing (..)
import Time exposing (..)


{-| This function is used to set up all the buttons in the selection page in the finite level since its only an initialization function just call the function by

    buttons = finite_buttons

then it will return the buttons you need for the finite selection page, it contains two level button and one button to return to menu

-}
finite_buttons : List Button
finite_buttons =
    List.map (\x -> Button default_menu_button_state [ help_page ] (StartGame (Finite x 0))) [ 1, 2, 3 ]
        |> List.append [ Button default_menu_button_state [] ReturnMenu ]


{-| This function controls all the buttons in the menu page to fade in. It can also update the progress of the model in the function

    (model,cmsg) = button_appear last_model progress

since most of the time it is used to connect direct into sub-update function, you may not need the first tuple to get the value

-}
button_appear : Model -> ProgressState -> ( Model, Cmd Msg )
button_appear model progress =
    let
        m =
            map_initial

        t =
            [ ( 1, 1 ) ]

        set =
            model.gameset

        nset =
            { set | map = m, todo = t }
    in
    ( { model
        | progress = progress
        , gameset = nset
        , button =
            List.map
                (\{ anistate, helppage, buttontype } ->
                    { anistate =
                        Ani.interrupt
                            [ Ani.toWith
                                (Ani.easing { duration = 300, ease = \a -> a })
                                [ Ani.opacity 1.0 ]
                            ]
                            anistate
                    , helppage = helppage
                    , buttontype = buttontype
                    }
                )
                model.button
      }
    , map_brick_generate
    )


{-| This function give the default initial animation state of buttons in the menu page
Just used it like this:

    button_anistate = default_menu_button_state

-}
default_menu_button_state : Ani.State
default_menu_button_state =
    Ani.style
        [ Ani.opacity 0.0
        , Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.0
        , Ani.backgroundColor { red = 255, green = 0, blue = 0, alpha = 0.3 }
        , Ani.borderWidth (px 5.0)
        , Ani.borderColor { red = 200, green = 200, blue = 0, alpha = 1 }
        , Ani.translate (px 0) (px 0)
        , Ani.shadow
            { offsetX = 0
            , offsetY = 1
            , size = 0
            , blur = 2
            , color = Ani.Color 0 0 0 0.1
            }
        , Ani.borderRadius (px 3.0)
        ]


{-| This function give the default initial animation state of buttons related help page in the menu page
Just used it like this:

    helppage_anistate = help_page

-}
help_page : Ani.State
help_page =
    Ani.style
        [ Ani.opacity 0
        , Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.0
        , Ani.path []
        , Ani.width (px 200.0)
        , Ani.backgroundColor { red = 255, green = 0, blue = 0, alpha = 0.3 }
        , Ani.borderWidth (px 5.0)
        , Ani.borderColor { red = 200, green = 200, blue = 0, alpha = 1 }
        , Ani.translate (px 0) (px 0)
        , Ani.borderRadius (px 3.0)
        ]


{-| This function controls generally the open animation (the fade in, fade out of the group logo)
The third input is the windowsize of the browser. The function is used only to set open animation, so use it like this:

    (model,cmsg)=set_open_animation lastmodel elapsed windowsize

This function is used only in subupdate function, so you may not need the tuple to catch the output

-}
set_open_animation : Model -> Float -> ( Float, Float ) -> ( Model, Cmd Msg )
set_open_animation model elapsed ( window_x, window_y ) =
    let
        start_instruction_button =
            Button default_menu_button_state [ help_page ] (StartGame (Finite 0 0))

        start_endless_button =
            Button
                default_menu_button_state
                [ help_page ]
                (StartGame Endless)

        helpbutton =
            Button
                default_menu_button_state
                [ help_page ]
                Help

        set =
            model.gameset

        nset =
            { set | timer = set.timer + elapsed }
    in
    ( { model
        | animatecurtain =
            Ani.interrupt
                [ Ani.toWith
                    (Ani.easing
                        { duration = 2000, ease = \x -> x ^ 2 }
                    )
                    [ Ani.opacity 1.0 ]
                , Ani.wait (millisToPosix 2000)
                , Ani.toWith
                    (Ani.easing { duration = 2000, ease = \x -> x ^ 2 })
                    [ Ani.opacity 0.0 ]
                ]
                model.animatecurtain
        , gameset = nset
        , button = [ start_instruction_button, start_endless_button, helpbutton ]
      }
    , Cmd.none
    )


button_zoom_out : List Ani.Step
button_zoom_out =
    [ Ani.toWith
        (Ani.easing { duration = 300, ease = \x -> x })
        [ Ani.opacity 1.0
        , Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.0
        , Ani.backgroundColor { red = 255, green = 0, blue = 0, alpha = 0.3 }
        , Ani.borderWidth (px 2.0)
        , Ani.borderColor { red = 200, green = 200, blue = 0, alpha = 1 }
        , Ani.translate (px 0) (px 0)
        , Ani.scale 1
        , Ani.shadow
            { offsetX = 0
            , offsetY = 1
            , size = 0
            , blur = 2
            , color = Ani.Color 0 0 0 0.3
            }
        ]
    ]


helppage_zoom_out : List Ani.Step
helppage_zoom_out =
    [ Ani.toWith
        (Ani.easing { duration = 300, ease = \a -> a })
        [ Ani.opacity 0
        , Ani.width (px 0.0)
        , Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.0
        , Ani.path []
        , Ani.backgroundColor { red = 255, green = 0, blue = 0, alpha = 0.3 }
        , Ani.borderWidth (px 5.0)
        , Ani.borderColor { red = 200, green = 200, blue = 0, alpha = 1 }
        , Ani.translate (px 0) (px 0)
        , Ani.borderRadius (px 3.0)
        ]
    ]


{-| This function is used to control the small animation of the button when the mouse lose focus on the button.
-}
zoomout_button : Model -> ButtonType -> ( Model, Cmd Msg )
zoomout_button model button_type =
    let
        buttons =
            List.filter (\x -> x.buttontype == button_type) model.button
                |> List.map
                    (\{ anistate, helppage, buttontype } ->
                        { anistate =
                            Ani.interrupt
                                button_zoom_out
                                anistate
                        , helppage =
                            [ Ani.interrupt
                                helppage_zoom_out
                                (find_page helppage 1)
                            ]
                        , buttontype = buttontype
                        }
                    )
    in
    ( { model
        | button =
            buttons ++ List.filter (\x -> x.buttontype /= button_type) model.button
      }
    , Cmd.none
    )


{-| This function helps to return the first button of the given button type in a list of buttons
Just use it like this:

    button_you_want = find_button lists_of_buttons the_type

-}
find_button : List Button -> ButtonType -> Button
find_button buttons b_type =
    List.filter (\x -> x.buttontype == b_type) buttons
        |> List.head
        |> Maybe.withDefault (Button (Ani.style []) [] (Reset Endless))


{-| This function helps to return the given sequence number in a list of help pages animation
Just use it like this:

    page_you_want = find_page list_of_pages thenumber

be careful, it returns the page's animation status instead of the information

-}
find_page : List Ani.State -> Int -> Ani.State
find_page any num =
    List.drop (num - 1) any
        |> List.head
        |> Maybe.withDefault (Ani.style [])


button_zoom_in : List Ani.Step
button_zoom_in =
    [ Ani.toWith
        (Ani.easing { duration = 300, ease = \x -> x })
        [ Ani.opacity 0.5
        , Ani.color { red = 0, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.05
        , Ani.backgroundColor { red = 255, green = 0, blue = 255, alpha = 1 }
        , Ani.borderWidth (px 5.0)
        , Ani.borderRadius (px 10.0)
        , Ani.borderColor { red = 200, green = 200, blue = 0, alpha = 1 }
        , Ani.translate (px 0) (px 0)
        , Ani.shadow
            { offsetX = 30
            , offsetY = 30
            , size = 15
            , blur = 0
            , color = Ani.Color 0 0 0 0.3
            }
        ]
    ]


helppage_zoom_in : List Ani.Step
helppage_zoom_in =
    [ Ani.toWith
        (Ani.easing { duration = 300, ease = \x -> x })
        [ Ani.opacity 1.0
        , Ani.width (px 250.0)
        , Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.0
        , Ani.backgroundColor { red = 255, green = 0, blue = 0, alpha = 0.3 }
        , Ani.borderWidth (px 5.0)
        , Ani.borderColor { red = 200, green = 200, blue = 0, alpha = 1 }
        , Ani.translate (px 0) (px 0)
        , Ani.borderRadius (px 3.0)
        ]
    ]


{-| This function is used to control the small animation when the user put his mouse on the button.
-}
zoomin_button : Model -> ButtonType -> ( Model, Cmd Msg )
zoomin_button model button_type =
    let
        buttons =
            List.filter (\x -> x.buttontype == button_type) model.button
                |> List.map
                    (\{ anistate, helppage, buttontype } ->
                        { anistate =
                            Ani.interrupt
                                button_zoom_in
                                anistate
                        , helppage =
                            List.map
                                (\a ->
                                    Ani.interrupt
                                        helppage_zoom_in
                                        a
                                )
                                helppage
                        , buttontype = buttontype
                        }
                    )
    in
    ( { model
        | button =
            buttons ++ List.filter (\x -> x.buttontype /= button_type) model.button
      }
    , Cmd.none
    )
