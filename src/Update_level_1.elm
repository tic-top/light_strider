module Update_level_1 exposing
    ( update_finite_level
    , update_level_1
    )

{-| This program is used to control all the functions relates to update of finite level 1


# Functions

@docs update_finite_level
@docs update_level_1

-}

import Animate exposing (..)
import Animation as Ani exposing (percent, px, rad, turn)
import Html exposing (th)
import Instruction exposing (..)
import Light exposing (..)
import Map exposing (..)
import Music exposing (..)
import Parameter exposing (..)
import Polygoninside exposing (ispolygoninside)
import Random exposing (..)
import Scoreboard exposing (..)
import Update_small exposing (..)


{-| This function is the subupdate function controls the finite level 1
GetViewport means the program receive a msg of the current size of web browser and it will update the windowsize
Resize means the size of web browser is changing and it will update the windowsize
Tick elapsed means controls the animation of the whole game
Rocktype helps to maintain the stablity of the game
Key\_Down means certain key is pressed, and correponding issue will happen
Key\_Up means certain key is released, and corresponding issue will happen
Click means player click in the web page, and it will record its position
Animate animMsg means there is animation in the current stage and it will receive the msg and continue the animation
-}
update_level_1 : Model -> Msg -> ( Model, Cmd Msg )
update_level_1 model msg =
    case msg of
        GetViewport { viewport } ->
            update_viewport model viewport

        Resize wid hei ->
            update_resize model wid hei

        -- "Q"
        Key_Down 81 ->
            set_mirror model msg

        -- arrow up
        Key_Down 38 ->
            volume_up model

        -- arrow down
        Key_Down 40 ->
            volume_down model

        -- [space]
        Key_Down 32 ->
            -- different state needs different operation
            space_press model

        Key_Up 32 ->
            stop_rotate model

        -- "W"
        Key_Down 87 ->
            set_splitter model msg

        Rocktype l ->
            generate_rock model l

        Click a ->
            check_click_pos a.pagePos model msg

        Animate animMsg ->
            ( { model
                | animatecurtain = Ani.update animMsg model.animatecurtain
                , button = List.map (\{ anistate, helppage, buttontype } -> { anistate = Ani.update animMsg anistate, helppage = List.map (\x -> Ani.update animMsg x) helppage, buttontype = buttontype }) model.button
                , instructions = List.map (\x -> Ani.update animMsg x) model.instructions
              }
            , Cmd.none
            )

        Tick elapsed ->
            update_level1_tick model elapsed

        _ ->
            ( model, Cmd.none )


{-| This function is the subupdate function controls the selection page
Mouseclick means some button is clicked and it will redirect to the corresponding stage of the game
Mouseover means the player put mouse on one button and it will trigger its animation
Mouseleave means the player leave mouse on one button and it will trigger its animation
GetViewport means the program receive a msg of the current size of web browser and it will update the windowsize
Resize means the size of web browser is changing and it will update the windowsize
Tick elapsed means controls the animation of the buttons
Animate animMsg means there is animation in the current stage and it will receive the msg and continue the animation
Start means to start a certain finite level
-}
update_finite_level : Model -> Msg -> ( Model, Cmd Msg )
update_finite_level model msg =
    case msg of
        Mouseclick button_type ->
            case button_type of
                ReturnMenu ->
                    return_menu model

                _ ->
                    ( model, Cmd.none )

        GetViewport { viewport } ->
            update_viewport model viewport

        Resize wid hei ->
            update_resize model wid hei

        Start (Finite a 0) ->
            start_finite_level model a

        Tick elapsed ->
            button_appear model (Gaming (Finite 0 0))

        Mouseover button_type ->
            mouseover model button_type

        Mouseleave button_type ->
            mouseleave model button_type

        Animate animMsg ->
            ( { model
                | animatecurtain = Ani.update animMsg model.animatecurtain
                , button = List.map (\{ anistate, helppage, buttontype } -> { anistate = Ani.update animMsg anistate, helppage = List.map (\x -> Ani.update animMsg x) helppage, buttontype = buttontype }) model.button
              }
            , Cmd.none
            )

        _ ->
            ( model, Cmd.none )


space_press : Model -> ( Model, Cmd Msg )
space_press model =
    case ( model.progress, model.place_state ) of
        ( Gaming (Finite 1 2), _ ) ->
            let
                set =
                    model.gameset

                nset =
                    { set | gamestate = Playing }
            in
            ( { model | progress = Gaming (Finite 1 2), gameset = nset, instructions = level_fadeout_instruction model.instructions }, Cmd.none )

        ( Gaming (Finite 1 n), Device_Placed ) ->
            if n == 6 then
                ( { model | place_state = Adjust_Angle, progress = Gaming (Finite 1 7) }, Cmd.none )

            else if n >= 7 then
                ( { model | place_state = Adjust_Angle }, Cmd.none )

            else
                ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )


set_splitter : Model -> Msg -> ( Model, Cmd Msg )
set_splitter model msg =
    case model.place_state of
        Select_Device ->
            let
                ( nmodel, nmsg ) =
                    set_object_level_1 model msg

                sound_msg =
                    Cmd.batch [ settime ( "place_instrument1", 0 ), pause "place_instrument1", start "place_instrument1" ]
            in
            ( nmodel, sound_msg )

        _ ->
            ( model, Cmd.none )


set_mirror : Model -> Msg -> ( Model, Cmd Msg )
set_mirror model msg =
    case model.place_state of
        Select_Device ->
            let
                ( nmodel, nmsg ) =
                    set_object_level_1 model msg

                sound_msg =
                    Cmd.batch [ settime ( "place_instrument1", 0 ), pause "place_instrument1", start "place_instrument1" ]
            in
            ( nmodel, sound_msg )

        _ ->
            ( model, Cmd.none )


start_finite_level : Model -> Int -> ( Model, Cmd Msg )
start_finite_level model a =
    let
        ( window_x, window_y ) =
            model.gameset.windowsize

        set =
            model.gameset

        nset =
            { set | light = [ Line_element ( 4.5, -1 ) ( 4.5, 10 ) ], timer = 0, map = map_initial, todo = [ ( 1, 1 ) ], gamestate = Playing }
    in
    ( { model | progress = Gaming (Finite a 0), instructions = level_set_instruction, gameset = nset }, map_brick_generate )


update_level1_tick : Model -> Float -> ( Model, Cmd Msg )
update_level1_tick model elapsed =
    let
        set =
            model.gameset

        map =
            set.map

        todolist =
            set.todo
    in
    case set.light of
        [] ->
            let
                newset =
                    { set | timer = 0 }
            in
            ( { model | progress = Fadeout (Finite 1 0), gameset = newset }, Cmd.none )

        _ ->
            let
                ( ngame_state, nprogress ) =
                    get_state model

                ( window_x, window_y ) =
                    set.windowsize

                --  this is the speed of the map
                nuppos =
                    if set.uppos >= 10 then
                        set.uppos

                    else
                        10 / window_y * (set.timer ^ 1.05) / 50

                newmodel =
                    rotate_device model
                        |> remove_outrange nuppos
                        |> update_light_object set.uppos

                newset =
                    newmodel.gameset

                nobjects =
                    get_nobjects newset

                t =
                    todolist
                        |> List.map (\( p, q ) -> ( p - 1, q ))
                        |> List.filter (\( p, q ) -> p > 0 && q > 0 && q < right_bound + 1)

                nmap =
                    List.drop 1 map

                ( final_x, final_y ) =
                    List.map (\x -> x.tail) set.light_path
                        |> List.sortBy Tuple.second
                        |> List.reverse
                        |> List.head
                        |> Maybe.withDefault ( 0, 0 )
            in
            if set.gamestate == Paused then
                get_nstate_pause model newset nobjects newmodel

            else if floor ((set.uppos * window_y / 10) / (0.1 * window_y)) > set.maptimer then
                generate_new_brick newset newmodel elapsed nuppos map t Cmd.none

            else if is_end_level set then
                let
                    nnewset =
                        { newset | timer = 0 }
                in
                ( { newmodel | progress = Fadeout (Finite 1 0), gameset = nnewset }, Cmd.none )

            else
                default_update_tick newset elapsed nuppos nobjects ngame_state newmodel nprogress


set_object_level_1 : Model -> Msg -> ( Model, Cmd Msg )
set_object_level_1 model msg =
    let
        ( posx, posy ) =
            model.clickpos

        newobject =
            case msg of
                Key_Down 81 ->
                    Object [ ( posx - 0.3, posy ), ( posx + 0.3, posy ) ] Mirror ( posx, posy )

                Key_Down 87 ->
                    Object [ ( posx - 0.3, posy ), ( posx + 0.3, posy ) ] (Splitter 0) ( posx, posy )

                _ ->
                    Object [] Mirror ( 0, 0 )

        set =
            model.gameset

        nset =
            { set | objects = set.objects ++ [ newobject ] }
    in
    case model.progress of
        Gaming (Finite 1 5) ->
            case msg of
                Key_Down 81 ->
                    ( { model | gameset = nset, place_state = Device_Placed, progress = Gaming (Finite 1 6) }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Gaming (Finite 1 7) ->
            if msg == Key_Down 87 then
                let
                    nnset =
                        { nset | gamestate = Playing }
                in
                ( { model | gameset = nnset, place_state = Device_Placed, progress = Gaming (Finite 1 8) }, Cmd.none )

            else
                let
                    nnset =
                        { nset | gamestate = Paused }
                in
                ( { model | gameset = nnset, place_state = Device_Placed, progress = Gaming (Finite 1 7) }, Cmd.none )

        _ ->
            ( { model | gameset = nset, place_state = Device_Placed }, Cmd.none )


get_nstate_pause : Model -> Game_Set -> List Object -> Model -> ( Model, Cmd Msg )
get_nstate_pause model newset nobjects newmodel =
    let
        nnewset =
            { newset | objects = nobjects }
    in
    case model.progress of
        Gaming (Finite 1 1) ->
            ( { newmodel | progress = Gaming (Finite 1 2), gameset = nnewset, instructions = level_update_instruction 20 model.instructions }, Cmd.none )

        Gaming (Finite 1 3) ->
            ( { newmodel | gameset = nnewset, progress = Gaming (Finite 1 4), instructions = level_update_instruction 20 level_set_instruction }, Cmd.none )

        _ ->
            ( { newmodel | gameset = nnewset }, Cmd.none )


get_nobjects : Game_Set -> List Object
get_nobjects newset =
    if is_add_big_plants newset then
        newset.objects
            |> filter_plant
            |> filter_rock

    else
        Object [ ( 5, 20 ), ( 7, 20 ) ] (Plant ( ( 4, 1 ), 0 )) ( 6, 20 ) :: (newset.objects |> filter_plant |> filter_rock)



-- get and change the state of the mode.


get_state : Model -> ( GameState, ProgressState )
get_state model =
    let
        set =
            model.gameset

        gamestate =
            set.gamestate

        progress =
            model.progress

        timer =
            set.timer
    in
    case ( gamestate, progress, timer ) of
        ( Playing, Gaming (Finite 1 0), _ ) ->
            if timer > 100 then
                ( Paused, Gaming (Finite 1 1) )

            else
                ( Playing, Gaming (Finite 1 0) )

        ( Playing, Gaming (Finite 1 2), _ ) ->
            let
                ( uppoint_x, uppoint_y ) =
                    List.map (\x -> x.tail) set.light_path
                        |> List.sortBy Tuple.second
                        |> List.head
                        |> Maybe.withDefault ( 0, 0 )
            in
            if uppoint_y - set.uppos < 4 then
                ( Paused, Gaming (Finite 1 3) )

            else
                ( Playing, Gaming (Finite 1 2) )

        _ ->
            ( gamestate, progress )



-- clear the rock in first a few rows.


{-| This function helps to clear the first four lines and the last two lines of rocks.
Use it like this:

    new_objects = filter_rock old_objects

-}
filter_rock : List Object -> List Object
filter_rock objects =
    case objects of
        [] ->
            []

        x :: xs ->
            case x.object_type of
                Stone a b ->
                    let
                        ( up_point_x, up_point_y ) =
                            x.nodes
                                |> List.sortBy Tuple.second
                                |> List.head
                                |> Maybe.withDefault ( 0, 0 )

                        ( down_point_x, down_point_y ) =
                            x.nodes
                                |> List.sortBy Tuple.second
                                |> List.reverse
                                |> List.head
                                |> Maybe.withDefault ( 0, 0 )
                    in
                    if up_point_y <= 5 || down_point_y >= 18 then
                        filter_rock xs

                    else if a == 6 && b >= 6 then
                        filter_rock xs

                    else
                        x :: filter_rock xs

                _ ->
                    x :: filter_rock xs



-- clear the plants in the game.


{-| This function filters the plants in the in the whole game in level 1, so it will not exist a plant floating in the air. Use the function like this

    new_objects = filter_plant_2 old_objects

-}
filter_plant : List Object -> List Object
filter_plant objects =
    case objects of
        [] ->
            []

        x :: xs ->
            case x.object_type of
                Plant ( ( planttype, _ ), _ ) ->
                    if planttype == 4 then
                        x :: filter_plant xs

                    else
                        filter_plant xs

                _ ->
                    x :: filter_plant xs



-- check if the click position is allowed.


check_click_pos : ( Float, Float ) -> Model -> Msg -> ( Model, Cmd Msg )
check_click_pos ( viewx, viewy ) model msg =
    let
        set =
            model.gameset

        ( window_x, window_y ) =
            set.windowsize

        ( gamex, gamey ) =
            (\( x, y ) -> ( (x - 0.2 * window_x) / (0.06 * window_x), (y + set.uppos * window_y / 10) / (0.1 * window_y) )) ( viewx, viewy )

        ( uppoint_x, uppoint_y ) =
            List.map (\x -> x.tail) set.light_path
                |> List.sortBy Tuple.second
                |> List.head
                |> Maybe.withDefault ( 0, 0 )
    in
    case model.progress of
        Gaming (Finite 1 n) ->
            if n < 4 then
                ( model, Cmd.none )

            else
                case n of
                    4 ->
                        if (uppoint_y - gamey > 0 && uppoint_y - gamey < 1) && abs (gamex - uppoint_x) < 0.3 then
                            let
                                nset =
                                    { set | gamestate = Paused }
                            in
                            ( { model | events = msg, clickpos = ( gamex, gamey ), place_state = Select_Device, progress = Gaming (Finite 1 5), gameset = nset }, Cmd.none )

                        else
                            ( model, Cmd.none )

                    5 ->
                        ( model, Cmd.none )

                    7 ->
                        let
                            nset =
                                { set | gamestate = Paused }
                        in
                        ( { model | events = msg, clickpos = ( gamex, gamey ), place_state = Select_Device, progress = Gaming (Finite 1 7), gameset = nset }, Cmd.none )

                    _ ->
                        let
                            nset =
                                { set | gamestate = Playing }
                        in
                        ( { model | events = msg, clickpos = ( gamex, gamey ), place_state = Select_Device, gameset = nset }, Cmd.none )

        _ ->
            ( model, Cmd.none )
