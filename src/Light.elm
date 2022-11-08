module Light exposing
    ( rotate_device
    , remove_outrange
    , update_light_object
    )

{-| This program is used to store all the function relates to light and its motion


# Functions

@docs rotate_device
@docs remove_outrange
@docs update_light_object

-}

import Html exposing (object)
import Parameter exposing (..)
import Polygoninside exposing (..)


{-| This function is used to rotate the device that needs to be rotated.
You only need to input the model and it will select the device it needs to rotate

    newmodel = rotate_device current_model

-}
rotate_device : Model -> Model
rotate_device model =
    case model.place_state of
        Adjust_Angle ->
            let
                -- get the device needs to rotate
                set =
                    model.gameset

                lastdevice =
                    set.objects
                        |> List.drop (List.length set.objects - 1)
                        |> List.head
                        |> Maybe.withDefault (Object [] Default ( 0, 0 ))

                ( centerposx, centerposy ) =
                    lastdevice.pos

                origin_radius_angle =
                    List.map (\( a, b ) -> ( sqrt ((centerposy - b) ^ 2 + (centerposx - a) ^ 2), atan2 (centerposy - b) (centerposx - a) / pi * 180 )) lastdevice.nodes

                newnodes =
                    List.map (\( r, theta ) -> ( r * cos (degrees theta + 0.05) + centerposx, r * sin (degrees theta + 0.05) + centerposy )) origin_radius_angle

                newdevice =
                    { lastdevice | nodes = newnodes }

                nobjects =
                    set.objects
                        |> List.take (List.length set.objects - 1)

                newobjects =
                    nobjects ++ [ newdevice ]
            in
            if Tuple.second lastdevice.pos > set.uppos then
                case lastdevice.object_type of
                    Splitter _ ->
                        model

                    _ ->
                        let
                            nset =
                                { set | objects = newobjects }
                        in
                        { model | gameset = nset }

            else
                model

        _ ->
            model


{-| It will move the objects out of range in the model.
We need to input a boundary and a model.

    remove_outrange 10 model

Then the funtion return a new model whose objects will all in the boundary

-}
remove_outrange : Float -> Model -> Model
remove_outrange nuppos model =
    let
        set =
            model.gameset

        newobjects =
            List.filter
                (\x ->
                    let
                        nodesytop =
                            x.nodes
                                |> List.map (\xx -> Tuple.second xx)
                                |> List.foldl
                                    (\yy p ->
                                        if yy < p then
                                            yy

                                        else
                                            p
                                    )
                                    1000000000000000000
                    in
                    nodesytop > nuppos - 6
                )
                set.objects

        nset =
            { set | objects = newobjects }
    in
    { model | gameset = nset }



{- You need input a tuple and a float.
   The float is the boundary.
   In the tuple there are three things.
   The first one is a line representing the light.
   The second one is a set of line representing the light source.
   The third one is a tuple contains a list of integer which is the score of the game and a list of object.
   The function will return a tuple with three elements: The light path, the new light source and a tuple containing the score and objects.

    line_path ( Line_element ((0,0),(1,1)) , [], ([],[]) ) 100.0

   Then it will return ( [Line_element ((0,0),(1,1))], [], ([],[])).
-}


line_path : ( Line_element, Line, ( List Int, List Object ) ) -> Float -> ( Line, Line, ( List Int, List Object ) )
line_path x upbound =
    let
        ( light_source, line, score_and_objects ) =
            x

        ( score, objects ) =
            score_and_objects

        target_object0 =
            objects
                |> List.filter
                    (\a -> maybeintersectrock a light_source && intersectrock a light_source)
                |> List.filter
                    (\a ->
                        let
                            j =
                                intersectrockpos a light_source
                        in
                        distance light_source.head j > 0.00001
                    )

        ( ans1, ans2, ans3 ) =
            if List.isEmpty target_object0 then
                if List.isEmpty line then
                    ( [ light_source ], line_clear [ light_source ] upbound, ( score, objects ) )

                else
                    ( [ light_source ], line, ( score, objects ) )

            else
                let
                    target_object =
                        target_object0
                            |> List.foldl
                                (\a ( p, q ) ->
                                    let
                                        j =
                                            intersectrockpos a light_source
                                    in
                                    if distance j light_source.head < distance q light_source.head then
                                        ( a, j )

                                    else
                                        ( p, q )
                                )
                                ( Object [ ( 0, 0 ) ] (Stone 0 0) ( 0, 0 ), ( -100, -100 ) )

                    newline =
                        Line_element light_source.head (Tuple.second target_object)

                    found_object =
                        Tuple.first target_object
                in
                case found_object.object_type of
                    Stone i j ->
                        line_path_stone i j line newline upbound found_object objects score

                    Mirror ->
                        line_path_mirror line newline upbound found_object objects score

                    Plant _ ->
                        line_path_plant line newline upbound found_object objects score

                    Splitter a ->
                        line_path_splitter a line newline upbound found_object objects score

                    _ ->
                        line_path_default line newline upbound found_object objects score
    in
    ( ans1, ans2, ans3 )


line_path_stone : Int -> Int -> Line -> Line_element -> Float -> Object -> List Object -> List Int -> ( Line, Line, ( List Int, List Object ) )
line_path_stone i j line newline upbound found_object objects score =
    let
        newlight =
            if List.isEmpty line then
                line_clear [ newline ] upbound

            else
                line

        new_objects =
            if i == 6 && j >= 7 then
                List.filter
                    (\a ->
                        case a.object_type of
                            Stone _ _ ->
                                found_object /= a

                            _ ->
                                distance a.pos found_object.pos > 2 || Tuple.second a.pos < upbound
                     --
                    )
                    objects

            else
                objects
    in
    ( [ newline ], newlight, ( score, new_objects ) )


line_path_mirror : Line -> Line_element -> Float -> Object -> List Object -> List Int -> ( Line, Line, ( List Int, List Object ) )
line_path_mirror line newline upbound found_object objects score =
    let
        newlightsource =
            if List.isEmpty line then
                line_clear [ newline ] upbound

            else
                line

        ( p, q, r ) =
            line_path ( line_longer (line_change newline found_object), newlightsource, ( score, objects ) ) upbound
    in
    ( [ newline ] ++ p, q, r )


line_path_plant : Line -> Line_element -> Float -> Object -> List Object -> List Int -> ( Line, Line, ( List Int, List Object ) )
line_path_plant line newline upbound found_object objects score =
    let
        newscore =
            case found_object.object_type of
                Plant ( l, _ ) ->
                    let
                        ( p, q ) =
                            l
                    in
                    if q == 1 then
                        score ++ [ p ]

                    else
                        score

                _ ->
                    score

        new_objects =
            objects
                |> List.map
                    (\a ->
                        if a == found_object then
                            let
                                b =
                                    case a.object_type of
                                        Plant ( l, r ) ->
                                            let
                                                ( p, _ ) =
                                                    l
                                            in
                                            ( ( p, 2 ), r )

                                        _ ->
                                            ( ( 0, 0 ), 0 )
                            in
                            { a | object_type = Plant b }

                        else
                            a
                    )

        newlightsource =
            if List.isEmpty line then
                line_clear [ newline ] upbound

            else
                line
    in
    ( [ newline ], newlightsource, ( newscore, new_objects ) )


line_path_splitter : Int -> Line -> Line_element -> Float -> Object -> List Object -> List Int -> ( Line, Line, ( List Int, List Object ) )
line_path_splitter a line newline upbound found_object objects score =
    if a == 0 then
        let
            objects0 =
                List.foldr
                    (\m n ->
                        let
                            save =
                                if m == found_object then
                                    { m | object_type = Splitter 1 }

                                else
                                    m
                        in
                        save :: n
                    )
                    []
                    objects

            newlightsource =
                if List.isEmpty line then
                    line_clear [ newline ] upbound

                else
                    line

            ( l1, l2 ) =
                line_change_splitter newline found_object

            isIntersect1 =
                objects0
                    |> List.map (\nodefather -> nodefather.nodes)
                    |> List.map (\b -> ispolygoninside b l1.head)
                    |> List.foldl (\c p -> c || p) False

            isIntersect2 =
                objects0
                    |> List.map (\nodefather -> nodefather.nodes)
                    |> List.map (\b -> ispolygoninside b l2.head)
                    |> List.foldl (\c p -> c || p) False

            ( ans_line, anslight_source, ans_score_object ) =
                case ( isIntersect1, isIntersect2 ) of
                    ( True, True ) ->
                        if List.isEmpty line then
                            ( [], line_clear [ newline ] upbound, ( score, objects0 ) )

                        else
                            ( [], line, ( score, objects0 ) )

                    ( False, False ) ->
                        let
                            ( p1, q1, r1 ) =
                                line_path ( line_longer l1, newlightsource, ( score, objects0 ) ) upbound

                            ( p2, q2, r2 ) =
                                line_path ( line_longer l2, newlightsource, r1 ) upbound
                        in
                        if newlightsource == [] then
                            ( p1 ++ p2, q1 ++ q2, r2 )

                        else
                            ( p1 ++ p2, newlightsource, r2 )

                    ( False, True ) ->
                        let
                            ( p1, q1, r1 ) =
                                line_path ( line_longer l1, newlightsource, ( score, objects0 ) ) upbound
                        in
                        if newlightsource == [] then
                            ( p1, q1, r1 )

                        else
                            ( p1, newlightsource, r1 )

                    ( True, False ) ->
                        let
                            ( p1, q1, r1 ) =
                                line_path ( line_longer l2, newlightsource, ( score, objects0 ) ) upbound
                        in
                        if newlightsource == [] then
                            ( p1, q1, r1 )

                        else
                            ( p1, newlightsource, r1 )
        in
        ( [ newline ] ++ ans_line, anslight_source, ans_score_object )

    else if List.isEmpty line then
        ( [ newline ], line_clear [ newline ] upbound, ( score, objects ) )

    else
        ( [ newline ], line, ( score, objects ) )


line_path_default : Line -> Line_element -> Float -> Object -> List Object -> List Int -> ( Line, Line, ( List Int, List Object ) )
line_path_default line newline upbound found_object objects score =
    if List.isEmpty line then
        ( [ newline ], line_clear [ newline ] upbound, ( score, objects ) )

    else
        ( [ newline ], line, ( score, objects ) )


{-| This function will generate a new light after the light being reflected by the mirror
-}
line_change : Line_element -> Object -> Line_element
line_change newline object =
    let
        ( ( x1, y1 ), ( x2, y2 ) ) =
            case object.nodes of
                x :: xs ->
                    case xs of
                        y :: _ ->
                            ( x, y )

                        _ ->
                            ( ( 0, 0 ), ( 0, 0 ) )

                _ ->
                    ( ( 0, 0 ), ( 0, 0 ) )

        aa =
            y2 - y1

        bb =
            x1 - x2

        cc =
            y1 * x2 - y2 * x1

        ( xx1, yy1 ) =
            newline.head

        ( xx2, yy2 ) =
            newline.tail

        ( xx, yy ) =
            ( 2 * xx2 - xx1, 2 * yy2 - yy1 )

        ( nx, ny ) =
            let
                xm =
                    ((bb ^ 2 - aa ^ 2) * xx - 2 * aa * cc - 2 * aa * bb * yy) / (aa ^ 2 + bb ^ 2)

                ym =
                    ((aa ^ 2 - bb ^ 2) * yy - 2 * bb * cc - 2 * aa * bb * xx) / (aa ^ 2 + bb ^ 2)
            in
            ( xm, ym )
    in
    Line_element newline.tail ( nx, ny )


{-| This function will generate 2 new lights when a light cross a splitter.
-}
line_change_splitter : Line_element -> Object -> ( Line_element, Line_element )
line_change_splitter newline object =
    let
        ( x3, y3 ) =
            newline.head

        ( x4, y4 ) =
            newline.tail

        ( ( x1, y1 ), ( x2, y2 ) ) =
            case object.nodes of
                x :: xs ->
                    case xs of
                        y :: ys ->
                            ( x, y )

                        _ ->
                            ( ( 0, 0 ), ( 0, 0 ) )

                _ ->
                    ( ( 0, 0 ), ( 0, 0 ) )
    in
    ( Line_element ( x1, y1 ) ( x1 - 0.5, y1 + 0.5 ), Line_element ( x2, y2 ) ( x2 + 0.5, y2 + 0.5 ) )


{-| This function will return the line which cross the boundary and points downwards
The first parameter is a set of line and the second paremeter is the boundary.
For example,

    a = [
        Line_element {(0,0),(0,2)} --downward
        , Line_element {(0,2),(0,0)} --upwards
        , Line_element {(0,-1),(3,1)} --upwards
        ][
    Line_element {(0,0),(0,2)} --downward
    ,Line_element {(0,2),(0,0)} --upwards
    ,Line_element {(0,-1),(3,1)} --upwards
    ]
    b = 1
    line_clear a b

It will return [Line\_element {(0,0),(0,2)}][Line_element {(0,0),(0,2)}]

-}
line_clear : Line -> Float -> Line
line_clear a b =
    a
        |> List.filter
            (\s ->
                let
                    ( x1, y1 ) =
                        s.head

                    ( x2, y2 ) =
                        s.tail

                    x3 =
                        if y1 == y2 then
                            0

                        else
                            x1 + (x1 - x2) * (b - y1) / (y1 - y2)
                in
                (y2 - y1 >= 0) && (y1 - b) * (y2 - b) <= 0 && y2 /= b && 0 <= x3 && x3 <= 12
            )


{-| This will extend the length of line\_element at most 30 times but not change the direction
line\_longer ( Line\_element {(2,0),(1,1)} )
It will return ( Line\_element {(2,0),(-28,30)} )
-}
line_longer : Line_element -> Line_element
line_longer a =
    let
        ( x1, y1 ) =
            a.head

        ( x2, y2 ) =
            a.tail

        k =
            min (100 / ((x2 - x1) ^ 2 + (y2 - y1) ^ 2) ^ 0.5) 30

        ( x3, y3 ) =
            ( x1 + k * (x2 - x1), y1 + k * (y2 - y1) )
    in
    Line_element ( x1, y1 ) ( x3, y3 )


{-| This function will update the status of the light and object in model
Input two parameter, the first one the boundary and the second one is the model

update\_light\_object upbound model

It will return a new model.

-}
update_light_object : Float -> Model -> Model
update_light_object upbound model =
    let
        set =
            model.gameset

        list_light_source =
            set.light

        score =
            set.score

        objects =
            List.foldr
                (\m n ->
                    let
                        save =
                            case m.object_type of
                                Splitter a ->
                                    { m | object_type = Splitter 0 }

                                _ ->
                                    m
                    in
                    save :: n
                )
                []
                set.objects

        ( new_light_path, new_list_light_source, new_score_and_objects ) =
            list_light_source
                |> List.foldl
                    (\a ( p, q, r ) ->
                        let
                            ( u, v, w ) =
                                line_path ( line_longer a, [], r ) upbound
                        in
                        ( p ++ u, q ++ v, w )
                    )
                    ( [], [], ( score, objects ) )

        ( newscore, new_objects ) =
            new_score_and_objects

        nset =
            { set | light = new_list_light_source, light_path = new_light_path, objects = new_objects, score = newscore }
    in
    { model | gameset = nset }
