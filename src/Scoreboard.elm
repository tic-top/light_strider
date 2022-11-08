module Scoreboard exposing
    ( fadeout
    , mouseleave
    , mouseover
    , show_score_board
    )

{-| This program is used to control the animation related to the score board


# Functions

@docs fadeout
@docs mouseleave
@docs mouseover
@docs show_score_board

-}

import Animate exposing (..)
import Animation as Ani exposing (percent, px, rad, turn)
import Parameter exposing (..)
import Time exposing (..)


board_state : Ani.State
board_state =
    Ani.style
        [ Ani.opacity 0.0
        , Ani.top (px 0.0)
        , Ani.color { red = 0, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.0
        , Ani.height (px 0.0)
        , Ani.backgroundColor { red = 69, green = 39, blue = 39, alpha = 1 }
        , Ani.borderWidth (px 5.0)
        , Ani.borderRadius (px 5.0)
        , Ani.borderColor { red = 36, green = 33, blue = 28, alpha = 1 }
        ]


score_state : Ani.State
score_state =
    Ani.style
        [ Ani.opacity 0.0
        , Ani.top (percent 0.2)
        , Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.scale 1.0
        , Ani.height (px 0.0)
        , Ani.backgroundColor { red = 255, green = 255, blue = 255, alpha = 0.5 }
        ]


newrecord_state : Ani.State
newrecord_state =
    Ani.style
        [ Ani.opacity 0.0
        , Ani.top (percent 0.0)
        , Ani.color { red = 255, green = 0, blue = 0, alpha = 1 }
        , Ani.scale 2.0
        , Ani.height (percent 0.0)
        , Ani.borderColor { red = 0, green = 0, blue = 0, alpha = 0 }
        , Ani.backgroundColor { red = 0, green = 0, blue = 0, alpha = 0.0 }
        , Ani.rotate (turn 0.0)
        , Ani.left (percent 0.0)
        , Ani.borderWidth (px 5.0)
        , Ani.borderRadius (px 5.0)
        ]


button_property : List Ani.Property
button_property =
    [ Ani.opacity 0.0
    , Ani.color { red = 0, green = 255, blue = 255, alpha = 0 }
    , Ani.scale 1.0
    , Ani.top (Ani.percent 85)
    , Ani.height (Ani.percent 10)
    , Ani.borderColor { red = 0, green = 0, blue = 0, alpha = 0 }
    , Ani.backgroundColor { red = 0, green = 0, blue = 0, alpha = 0.0 }
    , Ani.borderWidth (px 8.0)
    , Ani.borderRadius (px 10.0)
    ]


{-| This function is to make the game model fade out
-}
fadeout : Model -> Float -> ( Model, Cmd Msg )
fadeout model elapsed =
    let
        set =
            model.gameset

        ( window_x, window_y ) =
            set.windowsize

        nscore =
            List.sum set.score * 10 + set.maptimer * 5

        board =
            { board = board_state
            , state = Begin
            , score = ( score_state, nscore )
            , newrecord = newrecord_state
            , reset_button = Ani.style (Ani.right (px 0.0) :: button_property)
            , menu_button = Ani.style (Ani.left (px 0.0) :: button_property)
            }

        new_high_score_list =
            nscore
                :: model.highscore
                |> List.sort
                |> List.reverse

        nprogress =
            case model.progress of
                Fadeout level ->
                    ShowScoreBoard level

                _ ->
                    Fadeout (Finite 0 0)
    in
    if set.timer >= 3000 then
        let
            nset =
                { set | timer = 0 }
        in
        ( { model | gameset = nset, progress = nprogress, scoreboard = board, highscore = new_high_score_list }, Cmd.none )

    else
        let
            nset =
                { set | timer = set.timer + elapsed }
        in
        ( { model | gameset = nset }, Cmd.none )


drop_down board window_y curtain =
    { board
        | board =
            Ani.interrupt
                [ Ani.toWith
                    (Ani.easing { duration = 800, ease = \x -> x ^ 2 })
                    [ Ani.opacity 1.0
                    , Ani.height (Ani.percent (0.8 * window_y))
                    ]
                ]
                board.board
        , state = Dropdown
        , score =
            ( Ani.interrupt
                [ Ani.wait (millisToPosix 700)
                , Ani.toWith
                    (Ani.easing { duration = 300, ease = \x -> x ^ 2 })
                    [ Ani.opacity 1.0
                    , Ani.scale 1.0
                    , Ani.top (percent 28)
                    , Ani.height (px 40.0)
                    , Ani.backgroundColor { red = 255, green = 255, blue = 255, alpha = 0.5 }
                    ]
                ]
                curtain
            , 0
            )
    }


{-| This function is to control all the animation related to score board
-}
show_score_board : Model -> Float -> ( Model, Cmd Msg )
show_score_board model elapsed =
    let
        set =
            model.gameset

        board =
            model.scoreboard

        score =
            List.sum set.score * 10 + set.maptimer * 5

        ( curtain, number ) =
            board.score

        ( window_x, window_y ) =
            set.windowsize

        newboard =
            if set.timer > 0 && model.scoreboard.state == Begin then
                drop_down board window_y curtain

            else if set.timer > 1200 && board.state == Dropdown then
                { board | state = Counting }

            else if board.state == Counting then
                if number < (31 * (score // 31)) then
                    { board | score = ( curtain, number + 31 ) }

                else if number < score then
                    { board | score = ( curtain, number + 1 ) }

                else
                    { board
                        | state = Recording
                        , newrecord =
                            Ani.interrupt (new_record_step set.windowsize) board.newrecord
                    }

            else if set.timer > 2500 && board.state == Recording then
                { board
                    | state = ButtonRaise
                    , reset_button = Ani.interrupt score_button_step board.reset_button
                    , menu_button = Ani.interrupt score_button_step board.menu_button
                }

            else
                board

        nset =
            { set | timer = set.timer + elapsed }
    in
    ( { model | scoreboard = newboard, gameset = nset }, Cmd.none )



-- displace the new record animatation.


new_record_step : ( Float, Float ) -> List Ani.Step
new_record_step ( window_x, window_y ) =
    [ Ani.toWith
        (Ani.easing { duration = 1000, ease = \x -> x ^ 3 })
        [ Ani.opacity 1.0
        , Ani.color { red = 255, green = 0, blue = 0, alpha = 1 }
        , Ani.scale 1.0
        , Ani.top (Ani.percent 30)
        , Ani.height (Ani.percent 8)
        , Ani.left (Ani.percent 60)
        , Ani.rotate (turn 0.875)
        , Ani.borderColor { red = 255, green = 0, blue = 0, alpha = 0.5 }
        , Ani.borderWidth (px 5.0)
        , Ani.borderRadius (px 8.0)
        ]
    ]



-- displace the score button


score_button_step : List Ani.Step
score_button_step =
    [ Ani.toWith
        (Ani.easing { duration = 1000, ease = \x -> x ^ 3 })
        [ Ani.opacity 1.0
        , Ani.color { red = 255, green = 255, blue = 255, alpha = 1 }
        , Ani.backgroundColor { red = 69, green = 39, blue = 39, alpha = 1 }
        , Ani.borderColor { red = 0, green = 0, blue = 255, alpha = 0.5 }
        ]
    ]


{-| This function is to control the button animation when the mouse is over. So when the Msg is Mouseover some\_buttontypes, call the function like this:

    mouseover model some_buttontypes

since it is directly connected into subupdate functions, no need to use tuple to receive the result.

-}
mouseover : Model -> ButtonType -> ( Model, Cmd Msg )
mouseover model button_type =
    let
        set =
            model.gameset
    in
    case model.progress of
        ShowScoreBoard level ->
            if set.timer > 2500 then
                let
                    newbutton =
                        Ani.interrupt
                            [ Ani.toWith
                                (Ani.easing { duration = 200, ease = \x -> x ^ 2 })
                                [ Ani.opacity 1.0
                                , Ani.color { red = 0, green = 255, blue = 255, alpha = 1 }
                                , Ani.scale 1.1
                                , Ani.backgroundColor { red = 100, green = 0, blue = 0, alpha = 0.5 }
                                ]
                            ]

                    board =
                        model.scoreboard

                    new_board =
                        if button_type == Reset level then
                            { board | reset_button = newbutton board.reset_button }

                        else
                            { board | menu_button = newbutton board.menu_button }
                in
                ( { model
                    | scoreboard = new_board
                  }
                , Cmd.none
                )

            else
                ( model, Cmd.none )

        _ ->
            zoomin_button model button_type


{-| This function is to control the button animation when the mouse leave. So when the Msg is Mouseleave some\_buttontype, just call the function like this

    mouseleave model some_buttontype

because this function is directly connected into subupdate function, so no need to use tuple to receive the result

-}
mouseleave : Model -> ButtonType -> ( Model, Cmd Msg )
mouseleave model button_type =
    let
        set =
            model.gameset
    in
    case model.progress of
        ShowScoreBoard level ->
            if set.timer > 2500 then
                let
                    newbutton =
                        Ani.interrupt
                            [ Ani.toWith
                                (Ani.easing { duration = 200, ease = \x -> x ^ 2 })
                                [ Ani.opacity 1.0
                                , Ani.scale 1.0
                                , Ani.backgroundColor { red = 69, green = 39, blue = 39, alpha = 1 }
                                ]
                            ]

                    board =
                        model.scoreboard

                    new_board =
                        if button_type == Reset level then
                            { board | reset_button = newbutton board.reset_button }

                        else
                            { board | menu_button = newbutton board.menu_button }
                in
                ( { model
                    | scoreboard = new_board
                  }
                , Cmd.none
                )

            else
                ( model, Cmd.none )

        _ ->
            zoomout_button model button_type
