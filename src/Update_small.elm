module Update_small exposing
    ( generate_rock
    , update_resize
    , update_viewport
    , volume_down
    , volume_up
    , is_add_big_plants
    , default_update_tick
    , generate_new_brick
    , is_end_level
    , return_menu
    , stop_rotate
    )

{-| This program controls all the small update function that is fundamental to most of the higher level update functions


# Functions

@docs generate_rock
@docs update_resize
@docs update_viewport
@docs volume_down
@docs volume_up
@docs is_add_big_plants
@docs default_update_tick
@docs generate_new_brick
@docs is_end_level
@docs return_menu
@docs stop_rotate

-}

import Animate exposing (set_open_animation)
import Animation as Ani
import Instruction exposing (default_instruction_state)
import Map exposing (..)
import Music exposing (..)
import Parameter exposing (..)
import Random exposing (..)


{-| This function is used to update the viewport of the game. When the update receive a msg of
GetViewport {viewport}, use the function like this:

    update_viewport model viewport

no need to receive the result because it is used directly in subupdate functions.

-}
update_viewport : Model -> { e | width : Float, height : Float } -> ( Model, Cmd Msg )
update_viewport model viewport =
    let
        set =
            model.gameset

        nset =
            { set
                | windowsize =
                    ( viewport.width
                    , viewport.height
                    )
            }
    in
    ( { model | gameset = nset }, Cmd.none )


{-| This function is used to resize the corresponding model in the web browser. When a update function receives a msg like Resize wid hei, then use this function:

    update_resize model wid hei

the function is dirrectly connected to sub update function so no need to receive the result.

-}
update_resize : Model -> Int -> Int -> ( Model, Cmd Msg )
update_resize model wid hei =
    let
        set =
            model.gameset

        nset =
            { set
                | windowsize =
                    ( toFloat wid
                    , toFloat hei
                    )
            }
    in
    ( { model
        | gameset = nset
      }
    , Cmd.none
    )


{-| This function is used to generate rocks.
We need to input a model and the rock type.

    generate_rock model 1

we will put a rock which is tpye one into the model

-}
generate_rock : Model -> List Int -> ( Model, Cmd Msg )
generate_rock model l =
    let
        set =
            model.gameset

        todolist =
            set.todo

        map =
            set.map
    in
    if map_last_full_line map > 12 then
        let
            nset =
                { set | map = map, todo = todolist }
        in
        ( { model | gameset = nset }, Cmd.none )

    else
        case todolist of
            x :: xs ->
                let
                    n =
                        case List.head l of
                            Just num ->
                                num - 5

                            Nothing ->
                                0

                    length =
                        List.drop 1 l

                    ( a, c ) =
                        x

                    nmap =
                        if List.length map < 18 then
                            map ++ map_initial ++ map_initial ++ map_initial ++ map_initial ++ map_initial ++ map_initial

                        else
                            map

                    ( i, j ) =
                        getij n

                    legal =
                        map_check nmap ( a, a + i ) ( c, c + j )

                    ( random_num, nseed ) =
                        Random.step (Random.int 0 8) model.seed
                in
                if legal then
                    let
                        ( newmap, todo ) =
                            map_fill ( nmap, xs ) x n

                        ob =
                            map_brick_object random_num x n model.gameset.maptimer length ++ model.gameset.objects

                        nset =
                            { set | map = newmap, todo = todo, objects = ob }
                    in
                    ( { model | gameset = nset, seed = nseed }, map_brick_generate )

                else if map_check nmap ( a, a + 1 ) ( c, c + 1 ) then
                    -- ( ( nmap, todolist ), map_brick_generate )
                    let
                        nset =
                            { set | map = nmap, todo = todolist }
                    in
                    ( { model | gameset = nset }, map_brick_generate )

                else
                    let
                        nset =
                            { set | map = nmap, todo = xs }
                    in
                    -- ( ( nmap, xs ), map_brick_generate )
                    ( { model | gameset = nset }, map_brick_generate )

            _ ->
                let
                    newrow =
                        List.length map + 1

                    newtodolist =
                        List.range 1 right_bound
                            |> List.map (\a -> ( newrow, a ))

                    nset =
                        { set | map = map, todo = newtodolist }
                in
                ( { model | gameset = nset }, Cmd.none )


{-| This function adjust the volume of all the audios when pressing the arrow up key, Use the function like this:

    volume_up model

Since it is often connected to subupdate functions directly, so no need to receive the result

-}
volume_up : Model -> ( Model, Cmd Msg )
volume_up model =
    let
        new_volume =
            min 1 (model.volume + 0.1)
    in
    ( { model | volume = new_volume }, Cmd.batch [ changeVolume ( "audio-sample", new_volume ), changeVolume ( "place_instrument", new_volume ), changeVolume ( "light_plant", new_volume ) ] )


{-| This function adjust the volume of all the audios when pressing the arrow down key, Use the function like this:

    volume_down model

Since it is often connected to subupdate functions directly, so no need to receive the result

-}
volume_down : Model -> ( Model, Cmd Msg )
volume_down model =
    let
        new_volume =
            max 0 (model.volume - 0.1)
    in
    ( { model | volume = new_volume }, Cmd.batch [ changeVolume ( "audio-sample", new_volume ), changeVolume ( "place_instrument", new_volume ), changeVolume ( "light_plant", new_volume ) ] )


{-| This function help stop the rotation of a certain mirror when the [space] key is released. Use the function when the Msg is (Key\_Up 32) like this:

    stop_rotate model

Then it will change the state of the mirror and the mirror will stop rotating.

-}
stop_rotate : Model -> ( Model, Cmd Msg )
stop_rotate model =
    case model.place_state of
        Adjust_Angle ->
            ( { model | place_state = Device_Placed }, Cmd.none )

        _ ->
            ( model, Cmd.none )


{-| This function check if the plant is the final big plants at the bottom of the finite level. Use this function to check if the big plant is added at the bottom

    if is_add_big_plants gameset then ...

then it will return a bool to tell if the big plant has been added or not

-}
is_add_big_plants : Game_Set -> Bool
is_add_big_plants newset =
    List.foldl
        (\x y ->
            case x.object_type of
                Plant ( ( 4, _ ), _ ) ->
                    True || y

                _ ->
                    False || y
        )
        False
        newset.objects


{-| This function helps to return menu and initialize all the corresponding parameters to ready for further playing. Just use the function when the player input a msg of returning the menu:

    return_menu model

No need to receive the result for further adjustment.

-}
return_menu : Model -> ( Model, Cmd Msg )
return_menu model =
    let
        nmodel =
            let
                newset =
                    Game_Set [ Line_element ( 5, -1 ) ( 5, 10 ), Line_element ( 4, -1 ) ( 4, 10 ) ] [] [] model.gameset.windowsize Playing 0 6100 map_initial [ ( 1, 1 ) ] 0 []
            in
            Model newset (Random.initialSeed 2) None ( 0, 0 ) Select_Pos Openanimation (Ani.style [ Ani.opacity 0.0 ]) [] init_board [] [] model.volume

        ( new_model, nmsg ) =
            set_open_animation nmodel 0 model.gameset.windowsize
    in
    ( { new_model | progress = Openanimation }, map_brick_generate )


{-| This function helps to start a new round of generation of bricks and put forward the timer. Call the function when a level of brick is deleted:

    generate_new_brick gameset model elapsed new_up_position new_map new_todo_list sound_cmd

-}
generate_new_brick : Game_Set -> Model -> Float -> Float -> Map -> Todolist -> Cmd Msg -> ( Model, Cmd Msg )
generate_new_brick newset newmodel elapsed nuppos nmap t sound_cmd =
    let
        nnewset =
            { newset | timer = newset.timer + elapsed, uppos = nuppos, map = nmap, todo = t, maptimer = newset.maptimer + 1 }
    in
    ( { newmodel | gameset = nnewset }, Cmd.batch [ map_brick_generate, sound_cmd ] )


{-| This function helps to test whether it comes to an end of a finite level. Use the function like this:

    if is_end_level gameset then ..

-}
is_end_level : Game_Set -> Bool
is_end_level set =
    set.uppos
        > 10
        && not
            (List.isEmpty
                (List.filter
                    (\x ->
                        case x.object_type of
                            Plant ( ( 4, 2 ), _ ) ->
                                True

                            _ ->
                                False
                    )
                    set.objects
                )
            )


{-| This function is just a default update function for the Msg Tick elapsed in the finite level Use the function like this:

    default_update_tick newset elapsed new_up_position new_objects new_game_state newmodel new_progress

-}
default_update_tick : Game_Set -> Float -> Float -> List Object -> GameState -> Model -> ProgressState -> ( Model, Cmd Msg )
default_update_tick newset elapsed nuppos nobjects ngame_state newmodel nprogress =
    let
        nnewset =
            { newset
                | timer = newset.timer + elapsed
                , uppos = nuppos
                , objects = nobjects
                , gamestate = ngame_state
            }
    in
    ( { newmodel
        | gameset = nnewset
        , progress = nprogress
      }
    , Cmd.none
    )
