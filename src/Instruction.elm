module Instruction exposing
    ( default_instruction_state
    , level_fadeout_instruction
    , level_set_instruction
    , level_update_instruction
    )

{-| This program is used to control the animation of our instruction in the finite level


# Functions

@docs default_instruction_state
@docs level_fadeout_instruction
@docs level_set_instruction
@docs level_update_instruction

-}

import Animation as Ani exposing (percent, px)
import Parameter exposing (..)
import Time exposing (millisToPosix)


{-| This functions control all the instruction's fade out animation including textbox and the text.
Use it like this:

    new_states = level_fadeout_instruction origin_states

-}
level_fadeout_instruction : List Ani.State -> List Ani.State
level_fadeout_instruction states =
    let
        textboard =
            List.head states
                |> Maybe.withDefault (default_instruction_state ( 0, 0 ))

        texts =
            List.drop 1 states
    in
    [ Ani.interrupt (default_instruction_fadeout 20) textboard ]
        ++ List.map (\x -> Ani.interrupt default_text_fadeout x) texts


{-| This functions control all the instruction's fade in animation including textbox and the text.
Use it like this:

    new_states = level_update_instruction origin_states

-}
level_update_instruction : Float -> List Ani.State -> List Ani.State
level_update_instruction height states =
    let
        textboard =
            List.head states
                |> Maybe.withDefault (default_instruction_state ( 0, 0 ))

        texts =
            List.drop 1 states
                |> List.head
                |> Maybe.withDefault (default_text_state ( 0, 0 ))

        cursor =
            List.drop 2 states
                |> List.head
                |> Maybe.withDefault cursor_state
    in
    [ Ani.interrupt (default_instruction_fadein ( 50, 20 - 0.5 * height ) height) textboard ]
        ++ [ (\x -> Ani.interrupt (default_text_fadein ( 50, 20 - 0.5 * height )) x) texts ]
        ++ [ Ani.interrupt cursor_update cursor ]


{-| This function only initialize the instruction animation including textbox and the text,
Use it like this

    animation_states = level_set_instruction

-}
level_set_instruction : List Ani.State
level_set_instruction =
    [ default_instruction_state ( 50, 20 ), default_text_state ( 50, 20 ), cursor_state ]


cursor_update : List Ani.Step
cursor_update =
    [ Ani.loop
        [ Ani.toWith
            (Ani.easing { duration = 500, ease = \x -> x ^ (1 / 3) })
            [ Ani.radius 15
            , Ani.opacity 1
            ]
        , Ani.toWith
            (Ani.easing { duration = 500, ease = \x -> x ^ 3 })
            [ Ani.radius 10
            , Ani.opacity 1
            ]
        ]
    ]


cursor_state : Ani.State
cursor_state =
    Ani.style
        [ Ani.stroke { red = 255, green = 0, blue = 100, alpha = 0.8 }
        , Ani.fill { red = 0, green = 0, blue = 100, alpha = 0.3 }
        , Ani.radius 5
        , Ani.opacity 0
        ]


default_text_state : ( Float, Float ) -> Ani.State
default_text_state ( posx, posy ) =
    Ani.style
        [ Ani.opacity 0.0
        , Ani.scale 1.0
        , Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.top (percent posy)
        , Ani.left (percent posx)
        ]


default_text_fadeout : List Ani.Step
default_text_fadeout =
    [ Ani.toWith
        (Ani.easing { duration = 500, ease = \x -> x ^ 2 })
        [ Ani.opacity 0.0 ]
    ]


default_text_fadein : ( Float, Float ) -> List Ani.Step
default_text_fadein ( posx, posy ) =
    [ Ani.toWith
        (Ani.easing { duration = 1000, ease = \x -> x ^ 2 })
        [ Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.0
        , Ani.top (percent posy)
        , Ani.left (percent posx)
        ]
    , Ani.toWith
        (Ani.easing { duration = 500, ease = \x -> x ^ 2 })
        [ Ani.opacity 1.0
        ]
    ]


{-| This function store the default animation state when initializing an instruction. You just need to input two float to locate where the instruction will be shown

    New_Ani_State = default_instruction_state posx posy

where posx posy is the x-position and y-position

-}
default_instruction_state : ( Float, Float ) -> Ani.State
default_instruction_state ( posx, posy ) =
    Ani.style
        [ Ani.opacity 1.0
        , Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.0
        , Ani.top (percent posy)
        , Ani.left (percent posx)
        , Ani.height (percent 0)
        , Ani.path []
        , Ani.backgroundColor { red = 0, green = 0, blue = 255, alpha = 0.3 }
        , Ani.borderWidth (px 10.0)
        , Ani.borderColor { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.borderRadius (px 3.0)
        ]


default_instruction_fadein : ( Float, Float ) -> Float -> List Ani.Step
default_instruction_fadein ( posx, posy ) height =
    [ Ani.toWith
        (Ani.easing { duration = 1000, ease = \x -> x ^ 2 })
        [ Ani.opacity 1.0
        , Ani.color { red = 255, green = 0, blue = 0, alpha = 1 }
        , Ani.scale 1.0
        , Ani.top (percent posy)
        , Ani.height (percent height)
        , Ani.left (percent posx)
        , Ani.borderColor { red = 255, green = 255, blue = 255, alpha = 0.5 }
        , Ani.borderWidth (px 10.0)
        , Ani.borderRadius (px 8.0)
        ]
    ]


default_instruction_fadeout : Float -> List Ani.Step
default_instruction_fadeout posy =
    [ Ani.wait (millisToPosix 500)
    , Ani.toWith
        (Ani.easing { duration = 1000, ease = \x -> x ^ 2 })
        [ Ani.height (percent 0.0)
        , Ani.top (percent posy)
        ]
    ]
