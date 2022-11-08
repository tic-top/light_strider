module Map exposing
    ( getij
    , gridColor
    , map_brick_generate
    , map_brick_object
    , map_check
    , map_fill
    , map_find
    , map_last_full_line
    , range2d
    )

{-| This program is used to control all the map related functions


# Functions

@docs getij
@docs gridColor
@docs map_brick_generate
@docs map_brick_object
@docs map_check
@docs map_fill
@docs map_find
@docs map_last_full_line
@docs range2d

-}

import Parameter exposing (..)
import Polygoninside exposing (..)
import Random


{-| This is a function to find certain brick in the map. You need in put a map and two integer represents the position.
For example, you want to get the information of the brick on 5th column and 3th row in the map.

    map_find map 3 5

    --return a bool

-}
map_find : Map -> Int -> Int -> Brick
map_find map a b =
    let
        n1 =
            List.drop (a - 1) map

        n2 =
            case n1 of
                x :: _ ->
                    x

                _ ->
                    []

        n3 =
            List.drop (b - 1) n2

        n4 =
            case n3 of
                x :: _ ->
                    x

                _ ->
                    Empty
    in
    n4



-- [a,b)x[c,d)


{-| map\_check funtion is a function which can check whether certain area of the map is filled.
It need the map and two Tuples of Integer which represents the area we want to check.
For example, you want to check whether column from 3 to 5, row from 2 to 4 has been filled.

    map_check map (2,5) (3,6)

-}
map_check : Map -> ( Int, Int ) -> ( Int, Int ) -> Bool
map_check map ( a, b ) ( c, d ) =
    if (a < 1) || (b - 1 > List.length map) || (c < 1) || (d - 1 > right_bound) then
        False

    else if a + 1 == b && c + 1 == d then
        let
            u =
                map_find map a c
        in
        u == Empty

    else if a + 1 == b then
        let
            m2 =
                (c + d) // 2
        in
        map_check map ( a, b ) ( c, m2 )
            && map_check map ( a, b ) ( m2, d )

    else if c + 1 == d then
        let
            m1 =
                (a + b) // 2
        in
        map_check map ( a, m1 ) ( c, d )
            && map_check map ( m1, b ) ( c, d )

    else
        let
            m1 =
                (a + b) // 2

            m2 =
                (c + d) // 2
        in
        map_check map ( a, m1 ) ( c, m2 )
            && map_check map ( m1, b ) ( c, m2 )
            && map_check map ( a, m1 ) ( m2, d )
            && map_check map ( m1, b ) ( m2, d )


{-| Input the map and the function will return how many lines are full from the first line.
For example, we have a map which first 5 lines is full, then

    map_last_full_line map

    --return 5

-}
map_last_full_line : Map -> Int
map_last_full_line map =
    let
        n =
            List.length map
    in
    map_last_full_line_guess n map


{-| This will check whether a line is full
-}
haveempty : List Brick -> Bool
haveempty line =
    List.foldl (\p q -> p == Empty || q) False line


{-| Input the map and an integer and the function will return how many lines are full from the first line.
For example, we have a map which first 5 lines is full, then

    map_last_full_line_guess 100 map

    -- return 5

-}
map_last_full_line_guess : Int -> Map -> Int
map_last_full_line_guess n map =
    let
        legal =
            List.take n map
                |> List.foldl (\p q -> haveempty p || q) False
    in
    if legal == False then
        n

    else if n - 1 == 0 then
        0

    else
        map_last_full_line_guess (n - 1) map


{-| This function will fill put a brick in the map.
-}
map_fill_deep : Int -> Int -> Int -> Int -> Map -> Map
map_fill_deep left right distance bricktype map =
    case map of
        x :: xs ->
            let
                l =
                    List.take (left - 1) x

                r =
                    List.drop right x

                m =
                    List.take right x
                        |> List.drop (left - 1)
                        |> List.foldl
                            (\_ b ->
                                b ++ [ Rock bricktype ( distance, List.length b + 1 ) ]
                            )
                            []

                nl =
                    [ l ++ m ++ r ]

                --Map
            in
            nl ++ map_fill_deep left right (distance + 1) bricktype xs

        _ ->
            []



--DEFINE THE BRICK


{-| This function returns a cmd message which represents a random rock type.

    map_brick_generate

-}
map_brick_generate : Cmd Msg
map_brick_generate =
    Random.generate Rocktype map_brick_random


map_brick_random : Random.Generator (List Int)
map_brick_random =
    Random.list 11 (Random.int 6 11)


{-| Input an integer representing the brick type and function will return an integer Tuple representing the size of the brick.
For example,

    getij 5

    --return (6,4)

-}
getij : Int -> ( Int, Int )
getij n =
    case n of
        1 ->
            ( 1, 1 )

        2 ->
            ( 3, 4 )

        3 ->
            ( 4, 3 )

        4 ->
            ( 2, 2 )

        5 ->
            ( 6, 4 )

        6 ->
            ( 1, 1 )

        _ ->
            ( 0, 0 )


{-| This function will return a list of integer tuple which represents the position around a brick
-}
map_around : ( Int, Int ) -> Int -> List ( Int, Int )
map_around pos n =
    let
        ( i, j ) =
            getij n

        ( x, y ) =
            pos

        a =
            List.range (y - 1) (y + j)
                |> List.foldl
                    (\p q ->
                        q ++ [ ( x - 1, p ), ( x + i, p ) ]
                    )
                    []

        b =
            List.range x (x + i - 1)
                |> List.foldl
                    (\p q ->
                        q ++ [ ( p, y - 1 ), ( p, y + j ) ]
                    )
                    []

        c =
            List.filter (\( p, q ) -> p > 0 && q > 0 && q < right_bound + 1) (a ++ b)
    in
    c



--last Int is the brick type


{-| This function will put a certain kind of brick in the map.
We input the map, a list position which is empty and can be filled, a position to be fill, and the bick type.
For example, if we want to put the 5th type brick into map and its left top position is (3,4).

    map_fill (map, todolist) (3,4) 5

-}
map_fill : ( Map, Todolist ) -> ( Int, Int ) -> Int -> ( Map, Todolist )
map_fill ( map, todolist ) ( x, y ) n =
    let
        ( i, j ) =
            getij n

        up =
            List.take (x - 1) map

        down =
            List.drop (x + i - 1) map

        mid =
            List.take (x + i - 1) map
                |> List.drop (x - 1)
                |> map_fill_deep y (y + j - 1) 1 n

        t =
            todolist ++ map_around ( x, y ) n
    in
    ( up ++ mid ++ down, t )


{-| This function will generate an object which represents the stone.
-}
getstone : Int -> Int -> ( Float, Float ) -> Int -> List Int -> Object
getstone n rannum ( a, b ) maptimer length =
    let
        ( viewx, viewy ) =
            getij n

        nodes =
            stonegenerate 10 length ( viewy, viewx )

        sto =
            List.map (\( x, y ) -> ( x + toFloat viewy / 2, y + toFloat viewx / 2 )) nodes

        stonodes =
            sto
                |> List.map (\( x, y ) -> ( b + x - 1 - 1, a + y - 1 ))
                |> List.map (\( x, y ) -> ( x, y + toFloat maptimer ))

        stocet =
            stonodes
                |> find_center
    in
    case n > 1 of
        True ->
            Object stonodes (Stone n rannum) stocet

        False ->
            Object [ ( 0, 0 ) ] Default ( 0, 0 )


{-| This functin will generate an object which represents the plant
-}
getplant : Int -> Object -> Object
getplant random_num obj =
    case obj.object_type of
        Stone _ _ ->
            let
                ( a, b ) =
                    case List.head (List.drop random_num obj.nodes) of
                        --need rewrite
                        Just ( x, y ) ->
                            ( x, y )

                        Nothing ->
                            ( 0, 0 )

                ( c, d ) =
                    case List.head (List.drop (random_num + 1) obj.nodes) of
                        Just ( x, y ) ->
                            ( x, y )

                        Nothing ->
                            ( 0, 0 )

                ( e, f ) =
                    ( (a + c) / 2 + b - d, (b + d) / 2 + c - a )

                thirdnode =
                    if ispolygoninside obj.nodes ( e, f ) then
                        ( (a + c) / 2 - b + d, (b + d) / 2 - c + a )

                    else
                        ( e, f )

                plnodes =
                    [ ( a, b ), ( c, d ), thirdnode ]

                length =
                    distance ( a, b ) ( c, d )

                ( ra, rb ) =
                    ( a + length, b )

                angle =
                    (((c - a) * (ra - a) + (d - b) * (rb - b)) / length ^ 2 |> acos) * 360 / (2 * pi)

                rotangle =
                    if b - d > 0 then
                        -angle

                    else
                        angle
            in
            case ( random_num >= 4, modBy 3 random_num ) of
                --0-8  0 3 6; 1 4 7; 2 5 8
                ( True, 2 ) ->
                    Object plnodes (Plant ( ( 1, 1 ), rotangle )) (find_center plnodes)

                ( True, 1 ) ->
                    Object plnodes (Plant ( ( 2, 1 ), rotangle )) (find_center plnodes)

                ( True, 0 ) ->
                    Object plnodes (Plant ( ( 3, 1 ), rotangle )) (find_center plnodes)

                _ ->
                    Object [ ( 0, 0 ) ] Default ( 0, 0 )

        --need rewrite only green plant
        _ ->
            Object [ ( 0, 0 ) ] Default ( 0, 0 )


{-| This function will generate a list of objects which represents the stones and plant.
We should input a random number, a postion, the stone type, the number of the lines being removed and length?
Then the function will generate corresponding object.

    map_brick_oject 8 (5,5) 3 10 5

-}
map_brick_object : Int -> ( Int, Int ) -> Int -> Int -> List Int -> List Object
map_brick_object random_num p n maptimer length =
    let
        pos =
            ( toFloat (Tuple.first p), toFloat (Tuple.second p) )

        stone =
            getstone n random_num pos maptimer length

        plant =
            getplant random_num stone
    in
    [ stone, plant ]


{-| This function will return the color of a certain type of brick.
For example, if we want to know the color of brick of type 5

    gridColor brick

     --return "rgb(29,14,16)"

-}
gridColor : Brick -> String
gridColor brick =
    case brick of
        Rock a _ ->
            case a of
                1 ->
                    "rgb(19,33,30)"

                2 ->
                    "rgb(23,33,30)"

                3 ->
                    "rgb(17,4,16)"

                4 ->
                    "rgb(14,14,16)"

                5 ->
                    "rgb(29,14,16)"

                _ ->
                    "rgb(14,14,16)"

        Empty ->
            "black"


{-| This funtion will generate a list of position.

    range2d ( 2, 3 )
    --return [(1,1),(1,2),(1,3),(2,1),(2,2),(2,3)]

-}
range2d : ( Int, Int ) -> List ( Int, Int )
range2d size =
    let
        rangex =
            List.range 1 (Tuple.first size)

        rangey =
            List.range 1 (Tuple.second size)

        line =
            \y -> List.map (\x -> Tuple.pair x y) rangex
    in
    List.map line rangey
        |> List.concat
