module Update_level_2 exposing (update_level_2)

{-| This program is used to control all the functions relates to update of finite level 2


# Functions

@docs update_level_2

-}

import Animate exposing (..)
import Animation as Ani exposing (percent, px, rad, turn)
import Browser.Dom exposing (getViewport)
import Debug exposing (toString)
import Html exposing (..)
import Instruction exposing (..)
import Light exposing (..)
import Map exposing (..)
import Music exposing (..)
import Parameter exposing (..)
import Polygoninside exposing (ispolygoninside)
import Random exposing (..)
import Update_small exposing (..)



-- update function for level 2


{-| This function is the subupdate function controls the finite level 2
GetViewport means the program receive a msg of the current size of web browser and it will update the windowsize
Resize means the size of web browser is changing and it will update the windowsize
Tick elapsed means controls the animation of the whole game
Rocktype helps to maintain the stablity of the game
Key\_Down means certain key is pressed, and correponding issue will happen
Key\_Up means certain key is released, and corresponding issue will happen
Click means player click in the web page, and it will record its position
Animate animMsg means there is animation in the current stage and it will receive the msg and continue the animation
-}
update_level_2 : Model -> Msg -> ( Model, Cmd Msg )
update_level_2 model msg =
    case msg of
        Key_Down 38 ->
            volume_up model

        Key_Down 40 ->
            volume_down model

        GetViewport { viewport } ->
            update_viewport model viewport

        Resize wid hei ->
            update_resize model wid hei

        Key_Down 81 ->
            set_mirror model msg

        Key_Down 32 ->
            --space
            press_space model model.gameset

        Key_Down 13 ->
            --Enter
            press_enter model model.gameset

        Key_Up 32 ->
            stop_rotate model

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
            update_level2_tick model elapsed

        _ ->
            ( model, Cmd.none )



-- set the object in level 2.


set_object_level_2 : Model -> Msg -> ( Model, Cmd Msg )
set_object_level_2 model msg =
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
    ( { model | gameset = nset, place_state = Device_Placed }, Cmd.none )



-- get and change the game state.


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
        ( Playing, Gaming (Finite 2 0), _ ) ->
            if timer > 100 then
                ( Paused, Gaming (Finite 2 1) )

            else
                ( Playing, Gaming (Finite 2 0) )

        ( Playing, Gaming (Finite 2 2), _ ) ->
            let
                isPlant =
                    List.foldl
                        (\x y ->
                            case x.object_type of
                                Plant _ ->
                                    True

                                _ ->
                                    False || y
                        )
                        False
                        set.objects
            in
            if isPlant && set.timer >= 3000 then
                ( Paused, Gaming (Finite 2 3) )

            else
                ( Playing, Gaming (Finite 2 2) )

        ( Playing, Gaming (Finite 2 5), _ ) ->
            if not (List.isEmpty set.score) then
                ( Paused, Gaming (Finite 2 6) )

            else
                ( Playing, Gaming (Finite 2 5) )

        _ ->
            ( gamestate, progress )



-- filter rocks in the first and final few rows.


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
                Stone a _ ->
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
                    if down_point_y <= 5 || down_point_y >= 18 then
                        filter_rock xs

                    else
                        x :: filter_rock xs

                _ ->
                    x :: filter_rock xs


update_level2_tick : Model -> Float -> ( Model, Cmd Msg )
update_level2_tick model elapsed =
    let
        set =
            model.gameset

        todolist =
            set.todo

        map =
            set.map
    in
    case set.light of
        [] ->
            let
                nset =
                    { set | timer = 0 }
            in
            ( { model | progress = Fadeout (Finite 2 0), gameset = nset }, Cmd.none )

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

                bottompos =
                    10 + nuppos

                newmodel =
                    rotate_device model
                        |> remove_outrange nuppos
                        |> update_light_object set.uppos

                nobjects =
                    get_nobjects newmodel

                newset =
                    newmodel.gameset

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

                isLightPlant =
                    List.length set.score /= List.length newmodel.gameset.score

                sound_cmd =
                    if isLightPlant then
                        Cmd.batch [ settime ( "light_plant2", 0 ), pause "light_plant2", start "light_plant2" ]

                    else
                        Cmd.none
            in
            if set.gamestate == Paused then
                get_nstate_pause newmodel nobjects

            else if floor ((set.uppos * window_y / 10) / (0.1 * window_y)) > set.maptimer then
                generate_new_brick newset newmodel elapsed nuppos nmap t sound_cmd

            else if is_end_level set then
                let
                    nnewset =
                        { newset | timer = 0 }
                in
                ( { newmodel | progress = Fadeout (Finite 2 0), gameset = nnewset }, sound_cmd )

            else
                default_update_tick newset elapsed nuppos nobjects ngame_state newmodel nprogress


press_enter : Model -> Game_Set -> ( Model, Cmd Msg )
press_enter model set =
    case ( model.progress, model.place_state ) of
        ( Gaming (Finite 2 7), _ ) ->
            let
                nset =
                    { set | gamestate = Playing }
            in
            ( { model | gameset = nset, progress = Gaming (Finite 2 8) }, Cmd.none )

        _ ->
            ( model, Cmd.none )


press_space : Model -> Game_Set -> ( Model, Cmd Msg )
press_space model set =
    case ( model.progress, model.place_state ) of
        ( Gaming (Finite 2 2), _ ) ->
            let
                nset =
                    { set | gamestate = Playing }
            in
            ( { model | progress = Gaming (Finite 2 2), gameset = nset, instructions = level_fadeout_instruction model.instructions }, Cmd.none )

        ( Gaming (Finite 2 4), _ ) ->
            let
                nset =
                    { set | gamestate = Playing }
            in
            ( { model | gameset = nset, progress = Gaming (Finite 2 5) }, Cmd.none )

        ( Gaming (Finite 2 7), _ ) ->
            ( model, Cmd.none )

        _ ->
            ( { model | place_state = Adjust_Angle }, Cmd.none )


set_mirror : Model -> Msg -> ( Model, Cmd Msg )
set_mirror model msg =
    case model.place_state of
        Select_Device ->
            let
                ( nmodel, nmsg ) =
                    set_object_level_2 model msg

                sound_msg =
                    Cmd.batch [ settime ( "place_instrument2", 0 ), pause "place_instrument2", start "place_instrument2" ]
            in
            ( nmodel, sound_msg )

        _ ->
            ( model, Cmd.none )


set_splitter : Model -> Msg -> ( Model, Cmd Msg )
set_splitter model msg =
    case model.place_state of
        Select_Device ->
            let
                ( nmodel, nmsg ) =
                    set_object_level_2 model msg

                sound_msg =
                    Cmd.batch [ settime ( "place_instrument", 0 ), pause "place_instrument", start "place_instrument" ]
            in
            ( nmodel, sound_msg )

        _ ->
            ( model, Cmd.none )


get_nstate_pause : Model -> List Object -> ( Model, Cmd Msg )
get_nstate_pause newmodel nobjects =
    let
        nset =
            newmodel.gameset

        nnset =
            { nset | objects = nobjects }
    in
    case newmodel.progress of
        Gaming (Finite 2 1) ->
            ( { newmodel | progress = Gaming (Finite 2 2), gameset = nnset, instructions = level_update_instruction 20 newmodel.instructions }, Cmd.none )

        Gaming (Finite 2 3) ->
            ( { newmodel | gameset = { nnset | score = [] }, progress = Gaming (Finite 2 4), instructions = level_update_instruction 20 level_set_instruction }, Cmd.none )

        Gaming (Finite 2 6) ->
            ( { newmodel | gameset = nnset, progress = Gaming (Finite 2 7), instructions = level_update_instruction 20 level_set_instruction }, Cmd.none )

        _ ->
            ( { newmodel | gameset = nnset }, Cmd.none )


get_nobjects : Model -> List Object
get_nobjects newmodel =
    if is_add_big_plants newmodel.gameset then
        newmodel.gameset.objects
            |> filter_plant_2
            |> filter_rock

    else
        Object [ ( 5, 20 ), ( 7, 20 ) ] (Plant ( ( 4, 1 ), 0 )) ( 6, 20 ) :: (newmodel.gameset.objects |> filter_plant_2 |> filter_rock)



-- filter the plants in the initial and final few rows.


{-| This function filters the plants in the first four lines and the last two lines in level 2, so it will not exist a plant floating in the air. Use the function like this

    new_objects = filter_plant_2 old_objects

-}
filter_plant_2 : List Object -> List Object
filter_plant_2 objects =
    case objects of
        [] ->
            []

        x :: xs ->
            case x.object_type of
                Plant ( ( planttype, _ ), _ ) ->
                    let
                        ( x1, y1 ) =
                            List.head x.nodes
                                |> Maybe.withDefault ( 0, 0 )

                        ( x2, y2 ) =
                            List.head (List.drop 1 x.nodes)
                                |> Maybe.withDefault ( 0, 0 )
                    in
                    if max y1 y2 >= 18 || min y1 y2 <= 5 then
                        if planttype == 4 then
                            x :: filter_plant_2 xs

                        else
                            filter_plant_2 xs

                    else
                        x :: filter_plant_2 xs

                _ ->
                    x :: filter_plant_2 xs



-- check whether the click is allowed.


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
        Gaming (Finite 2 n) ->
            if n < 5 then
                ( model, Cmd.none )

            else
                case n of
                    7 ->
                        ( model, Cmd.none )

                    10 ->
                        ( model, Cmd.none )

                    21 ->
                        ( model, Cmd.none )

                    24 ->
                        ( model, Cmd.none )

                    _ ->
                        ( { model | events = msg, clickpos = ( gamex, gamey ), place_state = Select_Device }, Cmd.none )

        _ ->
            ( model, Cmd.none )
