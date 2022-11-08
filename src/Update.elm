module Update exposing
    ( key_down
    , key_up
    , update
    )

{-| This program is used to control some of the high level of update functions


# Functions

@docs key_down
@docs key_up
@docs update

-}

import Animate exposing (..)
import Animation as Ani exposing (percent, px, rad, turn)
import Debug exposing (toString)
import Light exposing (..)
import Map exposing (..)
import Music exposing (..)
import Parameter exposing (..)
import Polygoninside exposing (ispolygoninside)
import Random exposing (..)
import Scoreboard exposing (..)
import Update_board exposing (..)
import Update_level_1 exposing (..)
import Update_level_2 exposing (..)
import Update_small exposing (..)


{-| This function is the main update function of the who game
Gaming (Finite 0 _) means player is in the selecting page of finite level
Gaming (Finite 1 _) means player is in level 1
Gaming (Finite 2 _) means player is in level 2
Openanimation means player is watching the open animation
ShowScoreBoard means player is watching the scoring board
Fadeout _ means player have just finished some game level and the game picture is fading out
Helppage means player is in the help page
Menu means player is in the menu page
Gaming Endless means player is playing endless model
-}
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model.progress of
        Gaming (Finite 0 _) ->
            update_finite_level model msg

        Gaming (Finite 1 _) ->
            update_level_1 model msg

        Gaming (Finite 2 _) ->
            update_level_2 model msg

        Openanimation ->
            update_open_animation model msg

        ShowScoreBoard _ ->
            update_score_board model msg

        Fadeout _ ->
            update_fadeout model msg

        Helppage ->
            update_helppage model msg

        Menu ->
            update_menu model msg

        Gaming Endless ->
            update_endless model msg

        _ ->
            ( model, Cmd.none )


{-| This function is the subupdate function controls the open animation
GetViewport means the program receive a msg of the current size of web browser and it will update the windowsize
Resize means the size of web browser is changing and it will update the windowsize
Tick elapsed means controls the animation of the browser and used to connect the next stage
Animate animMsg means there is animation in the current stage and it will receive the msg and continue the animation
-}
update_open_animation : Model -> Msg -> ( Model, Cmd Msg )
update_open_animation model msg =
    let
        set =
            model.gameset
    in
    case msg of
        GetViewport { viewport } ->
            update_viewport model viewport

        Resize wid hei ->
            update_resize model wid hei

        Tick elapsed ->
            if set.timer == 0 then
                set_open_animation model elapsed set.windowsize

            else if set.timer > 6100 then
                button_appear model Menu

            else
                let
                    nset =
                        { set | timer = set.timer + elapsed }
                in
                ( { model | gameset = nset }, Cmd.none )

        Animate animMsg ->
            ( { model
                | animatecurtain = Ani.update animMsg model.animatecurtain
                , button = List.map (\{ anistate, helppage, buttontype } -> { anistate = Ani.update animMsg anistate, helppage = List.map (\x -> Ani.update animMsg x) helppage, buttontype = buttontype }) model.button
              }
            , Cmd.none
            )

        _ ->
            ( model, Cmd.none )


{-| This function is the subupdate function controls the fading process
GetViewport means the program receive a msg of the current size of web browser and it will update the windowsize
Resize means the size of web browser is changing and it will update the windowsize
Tick elapsed means controls the fading process of the game scene and used to connect the next stage
Animate animMsg means there is animation in the current stage and it will receive the msg and continue the animation
-}
update_fadeout : Model -> Msg -> ( Model, Cmd Msg )
update_fadeout model msg =
    let
        set =
            model.gameset
    in
    case msg of
        GetViewport { viewport } ->
            update_viewport model viewport

        Resize wid hei ->
            update_resize model wid hei

        Tick elapsed ->
            fadeout model elapsed

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
                | animatecurtain = Ani.update animMsg model.animatecurtain
                , button = List.map (\{ anistate, helppage, buttontype } -> { anistate = Ani.update animMsg anistate, helppage = List.map (\x -> Ani.update animMsg x) helppage, buttontype = buttontype }) model.button
                , scoreboard = nboard
              }
            , Cmd.none
            )

        _ ->
            ( model, Cmd.none )


{-| This function is the subupdate function controls the help page
Mouseclick means some button is clicked and it will redirect to the corresponding stage of the game
Mouseover means the player put mouse on one button and it will trigger its animation
Mouseleave means the player leave mouse on one button and it will trigger its animation
GetViewport means the program receive a msg of the current size of web browser and it will update the windowsize
Resize means the size of web browser is changing and it will update the windowsize
Tick elapsed means controls the animation of the buttons
Animate animMsg means there is animation in the current stage and it will receive the msg and continue the animation
-}
update_helppage : Model -> Msg -> ( Model, Cmd Msg )
update_helppage model msg =
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

        Tick elapsed ->
            button_appear model Helppage

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


{-| This function is the subupdate function controls the menu page
Mouseclick means some button is clicked and it will redirect to the corresponding stage of the game
Mouseover means the player put mouse on one button and it will trigger its animation
Mouseleave means the player leave mouse on one button and it will trigger its animation
GetViewport means the program receive a msg of the current size of web browser and it will update the windowsize
Resize means the size of web browser is changing and it will update the windowsize
Tick elapsed means controls the animation of the background
Rocktype helps to maintain the stablity of the background
Start means player choose to start a certain level
Animate animMsg means there is animation in the current stage and it will receive the msg and continue the animation
-}
update_menu : Model -> Msg -> ( Model, Cmd Msg )
update_menu model msg =
    let
        set =
            model.gameset

        map =
            set.map

        todolist =
            set.todo
    in
    case msg of
        Tick elapsed ->
            update_tick model elapsed

        Rocktype l ->
            generate_rock model l

        GetViewport { viewport } ->
            update_viewport model viewport

        Resize wid hei ->
            update_resize model wid hei

        Mouseclick Help ->
            let
                nset =
                    { set | timer = 0 }
            in
            ( { model | gameset = nset, progress = Helppage, button = finite_buttons }, Cmd.none )

        Start Endless ->
            start_endless set

        Start (Finite 0 0) ->
            let
                nset =
                    Game_Set [ Line_element ( 4.5, -1 ) ( 4.5, 10 ) ] [] [] set.windowsize Notbegin 0 0 map_initial [ ( 1, 1 ) ] 0 []
            in
            ( Model nset (Random.initialSeed 2) None ( 0, 0 ) Select_Pos (Gaming (Finite 0 0)) (Ani.style [ Ani.opacity 0.0 ]) finite_buttons init_board model.highscore [] model.volume, map_brick_generate )

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


{-| This function is the subupdate function controls the endless mode
GetViewport means the program receive a msg of the current size of web browser and it will update the windowsize
Resize means the size of web browser is changing and it will update the windowsize
Tick elapsed means controls the animation of the whole game
Rocktype helps to maintain the stablity of the game
Key\_Down means certain key is pressed, and correponding issue will happen
Key\_Up means certain key is released, and corresponding issue will happen
Click means player click in the web page, and it will record its position
-}
update_endless : Model -> Msg -> ( Model, Cmd Msg )
update_endless model msg =
    let
        set =
            model.gameset

        map =
            set.map

        todolist =
            set.todo
    in
    case msg of
        GetViewport { viewport } ->
            update_viewport model viewport

        Resize wid hei ->
            update_resize model wid hei

        Key_Down 81 ->
            set_mirror model msg

        Key_Down 32 ->
            start_rotate model

        Key_Up 32 ->
            stop_rotate model

        Key_Down 87 ->
            set_splitter model msg

        Key_Down 38 ->
            volume_up model

        Key_Down 40 ->
            volume_down model

        --  Key _ ->
        Rocktype l ->
            generate_rock model l

        Tick elapsed ->
            update_endless_tick model elapsed

        Click a ->
            let
                ( viewx, viewy ) =
                    a.pagePos

                ( window_x, window_y ) =
                    set.windowsize

                ( gamex, gamey ) =
                    (\( x, y ) -> ( (x - 0.2 * window_x) / (0.06 * window_x), (y + set.uppos * window_y / 10) / (0.1 * window_y) )) ( viewx, viewy )

                ( lastx, lasty ) =
                    model.clickpos

                -- test if it is too close to other devices
                isIntersect =
                    set.objects
                        |> List.map (\nodefather -> nodefather.nodes)
                        |> List.map (\b -> ispolygoninside b ( gamex, gamey ))
                        |> List.foldl (\c p -> c || p) False
            in
            if gamex <= 10 && gamex >= 0 && gamey >= 0 && gamey <= 10 / window_y * (window_y + set.uppos * window_y / 10) && isIntersect == False then
                ( { model | events = msg, clickpos = ( gamex, gamey ), place_state = Select_Device }, Cmd.none )

            else
                ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )


start_endless : Game_Set -> ( Model, Cmd Msg )
start_endless set =
    let
        nmodel =
            init_model

        newset =
            nmodel.gameset

        nset =
            { newset | windowsize = set.windowsize }
    in
    ( { nmodel | progress = Gaming Endless, gameset = nset }, Cmd.batch [ map_brick_generate, changeVolume ( "audio-sample", 1 ), changeVolume ( "place_instrument", 1 ) ] )


update_endless_tick : Model -> Float -> ( Model, Cmd Msg )
update_endless_tick model elapsed =
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
            ( { model | progress = Fadeout Endless, gameset = nset }, Cmd.none )

        _ ->
            let
                ( window_x, window_y ) =
                    set.windowsize

                --  this is the speed of the map
                nuppos =
                    10 / window_y * (set.timer ^ 1.05) / 50

                bottompos =
                    10 + nuppos

                newmodel =
                    rotate_device model
                        |> remove_outrange nuppos
                        |> update_light_object set.uppos

                t =
                    todolist
                        |> List.map (\( p, q ) -> ( p - 1, q ))
                        |> List.filter (\( p, q ) -> p > 0 && q > 0 && q < right_bound + 1)

                newobject =
                    newmodel.gameset.objects
                        |> filter_plant_2
                        |> filter_rock

                nmap =
                    List.drop 1 map

                newset =
                    newmodel.gameset

                isLightPlant =
                    List.length set.score /= List.length newset.score

                isGeneratingMap =
                    floor ((set.uppos * window_y / 10) / (0.1 * window_y)) > set.maptimer

                cmd =
                    case ( isLightPlant, isGeneratingMap ) of
                        ( True, True ) ->
                            Cmd.batch [ map_brick_generate, settime ( "light_plant", 0 ), pause "light_plant", start "light_plant" ]

                        ( True, False ) ->
                            Cmd.batch [ settime ( "light_plant", 0 ), pause "light_plant", start "light_plant" ]

                        ( False, True ) ->
                            Cmd.batch [ map_brick_generate ]

                        ( False, False ) ->
                            Cmd.none
            in
            if isGeneratingMap then
                let
                    nset =
                        { newset | timer = newset.timer + elapsed, uppos = nuppos, map = nmap, todo = t, maptimer = newset.maptimer + 1, objects = newobject }
                in
                ( { newmodel | gameset = nset }, cmd )

            else
                let
                    nset =
                        { newset | timer = newset.timer + elapsed, uppos = nuppos, objects = newobject }
                in
                ( { newmodel | gameset = nset }, cmd )


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
                    if down_point_y <= 5 then
                        filter_rock xs

                    else
                        x :: filter_rock xs

                _ ->
                    x :: filter_rock xs


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
                    if min y1 y2 <= 5 then
                        filter_plant_2 xs

                    else
                        x :: filter_plant_2 xs

                _ ->
                    x :: filter_plant_2 xs


update_tick : Model -> Float -> ( Model, Cmd Msg )
update_tick model elapsed =
    let
        set =
            model.gameset

        ( window_x, window_y ) =
            set.windowsize

        --  this is the speed of the map
        nuppos =
            10 / window_y * (set.timer ^ 1.05) / 50

        bottompos =
            10 + nuppos

        newmodel =
            rotate_device model
                |> remove_outrange nuppos
                |> update_light_object set.uppos

        t =
            set.todo
                |> List.map (\( p, q ) -> ( p - 1, q ))
                |> List.filter (\( p, q ) -> p > 0 && q > 0 && q < right_bound + 1)

        nmap =
            List.drop 1 set.map
    in
    if floor ((set.uppos * window_y / 10) / (0.1 * window_y)) > set.maptimer then
        generate_new_brick newmodel.gameset newmodel elapsed nuppos nmap t Cmd.none

    else
        let
            newset =
                newmodel.gameset

            nset =
                { set | timer = newset.timer + elapsed, uppos = nuppos }
        in
        ( { newmodel | gameset = nset }, Cmd.none )


set_object : Model -> Msg -> ( Model, Cmd Msg )
set_object model msg =
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
    ( { model | place_state = Device_Placed, gameset = nset }, Cmd.none )


{-| This function is used to decode key code and change into a Msg, when receiving a keycode, output a key\_down keycode
-}
key_down : Int -> Msg
key_down keycode =
    Key_Down keycode


{-| This function is used to decode key code and change into a Msg, when receiving a keycode, output a key\_up keycode
-}
key_up : Int -> Msg
key_up keycode =
    Key_Up keycode


set_mirror : Model -> Msg -> ( Model, Cmd Msg )
set_mirror model msg =
    case model.place_state of
        Select_Device ->
            let
                ( nmodel, cmsg ) =
                    set_object model msg

                sound_msg =
                    Cmd.batch [ settime ( "place_instrument", 0 ), pause "place_instrument", start "place_instrument" ]
            in
            ( nmodel, sound_msg )

        _ ->
            ( model, Cmd.none )


start_rotate : Model -> ( Model, Cmd Msg )
start_rotate model =
    case ( model.progress, model.place_state ) of
        ( Gaming _, Device_Placed ) ->
            ( { model | place_state = Adjust_Angle }, Cmd.none )

        _ ->
            ( model, Cmd.none )


set_splitter : Model -> Msg -> ( Model, Cmd Msg )
set_splitter model msg =
    case model.place_state of
        Select_Device ->
            let
                ( nmodel, nmsg ) =
                    set_object model msg

                sound_msg =
                    Cmd.batch [ settime ( "place_instrument", 0 ), pause "place_instrument", start "place_instrument" ]
            in
            ( nmodel, sound_msg )

        _ ->
            ( model, Cmd.none )
