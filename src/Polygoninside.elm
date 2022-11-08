module Polygoninside exposing
    ( distance
    , find_center
    , intersect
    , intersectrock
    , intersectrockpos
    , ispolygoninside
    , maybeintersectrock
    , stonegenerate
    )

{-| This program is used to control the functions related to calculation of polygon


# Functions

@docs distance
@docs find_center
@docs intersect
@docs intersectrock
@docs intersectrockpos
@docs ispolygoninside
@docs maybeintersectrock
@docs stonegenerate

-}

import Parameter exposing (Line_element, Object)


{-| This function will find the center of a list of position

    find_center [(1,1),(2,2),(0,0)]

It will return (1,1)

-}
find_center : List ( Float, Float ) -> ( Float, Float )
find_center a =
    let
        ( b, c ) =
            List.unzip a

        x =
            ( List.sum b / toFloat (List.length b), List.sum c / toFloat (List.length c) )
    in
    x


{-| This function will check whether the line will intersect with object roughly.
-}
maybeintersectrock : Object -> Line_element -> Bool
maybeintersectrock a light_source =
    let
        ( x, y ) =
            a.pos

        ( x1, y1 ) =
            light_source.head

        ( x2, y2 ) =
            light_source.tail

        a1 =
            y2 - y1

        b1 =
            x1 - x2

        c1 =
            -y1 * b1 - x1 * a1

        apdis =
            abs (a1 * x + b1 * y + c1) / (a1 ^ 2 + b1 ^ 2) ^ 0.5
    in
    apdis < 3.7


{-| This function will check whether the line will intersect with object.
-}
intersectrock : Object -> Line_element -> Bool
intersectrock a light_source =
    let
        b =
            a.nodes

        c =
            List.drop 1 b ++ List.take 1 b

        d =
            List.map2 Tuple.pair b c
                |> List.map
                    (\( first, second ) ->
                        intersect first second light_source.head light_source.tail
                    )
                |> List.foldl (\s p -> s || p) False
    in
    d


{-| This function return the position where the line and the object intersect and this postion is closed to the head of the line.
For example, the object is a square with the vertex (0,0) (1,0) (1,1) (0,1) and the line is (0.5,0.5) to (100,0.5)

    intersectrockpos a line

It will return (1,0.5)

-}
intersectrockpos : Object -> Line_element -> ( Float, Float )
intersectrockpos a light_source =
    let
        b =
            a.nodes

        c =
            List.drop 1 b ++ List.take 1 b

        d =
            List.map2 Tuple.pair b c
                |> List.map
                    (\( first, second ) ->
                        if intersect first second light_source.head light_source.tail then
                            intersectpos first second light_source.head light_source.tail

                        else
                            ( -100000, -100000 )
                    )
                |> List.foldl
                    (\s p ->
                        if distance s light_source.head < distance p light_source.head then
                            s

                        else
                            p
                    )
                    ( -100000, -100000 )
    in
    d


{-| euclid distance between points.

    distance (1,1) (1,1)

It will return 1.414

-}
distance : ( Float, Float ) -> ( Float, Float ) -> Float
distance a b =
    let
        ( x1, y1 ) =
            a

        ( x2, y2 ) =
            b
    in
    ((x1 - x2) ^ 2 + (y1 - y2) ^ 2) ^ 0.5


{-| This function will judge whether two line will intersect.
Input the vertex of two line.

    intersect (1,1) (0,0) (1,0) (0,1)

It will return (0.5, 0.5)

-}
intersect : ( Float, Float ) -> ( Float, Float ) -> ( Float, Float ) -> ( Float, Float ) -> Bool
intersect a b c d =
    let
        ( x1, y1 ) =
            a

        ( x2, y2 ) =
            b

        ( x3, y3 ) =
            c

        ( x4, y4 ) =
            d

        xintersect =
            abs (x2 - x1)
                + abs (x3 - x4)
                >= List.foldl
                    (\x p ->
                        if x > p then
                            x

                        else
                            p
                    )
                    -1
                    [ abs (x4 - x1), abs (x4 - x2), abs (x3 - x1), abs (x3 - x2) ]

        yintersect =
            abs (y2 - y1)
                + abs (y3 - y4)
                >= List.foldl
                    (\y p ->
                        if y > p then
                            y

                        else
                            p
                    )
                    -1
                    [ abs (y4 - y1), abs (y4 - y2), abs (y3 - y1), abs (y3 - y2) ]

        sidejudge1 =
            cross_product ( x1 - x3, y1 - y3 ) ( x3 - x4, y3 - y4 ) * cross_product ( x2 - x3, y2 - y3 ) ( x3 - x4, y3 - y4 )

        sidejudge2 =
            cross_product ( x1 - x3, y1 - y3 ) ( x1 - x2, y1 - y2 ) * cross_product ( x1 - x4, y1 - y4 ) ( x1 - x2, y1 - y2 )
    in
    xintersect && yintersect && sidejudge1 <= 0 && sidejudge2 <= 0



{- It will calculate the cross product of two points.

      cross_product (1,2) (3,4)

   It will return -2
-}


cross_product : ( Float, Float ) -> ( Float, Float ) -> Float
cross_product a b =
    let
        ( x1, y1 ) =
            a

        ( x2, y2 ) =
            b
    in
    x1 * y2 - y1 * x2


{-| Return the position of the intersection of two lines
-}
intersectpos : ( Float, Float ) -> ( Float, Float ) -> ( Float, Float ) -> ( Float, Float ) -> ( Float, Float )
intersectpos a b c d =
    let
        ( x1, y1 ) =
            a

        ( x2, y2 ) =
            b

        ( x3, y3 ) =
            c

        ( x4, y4 ) =
            d

        denominator =
            (y2 - y1) * (x4 - x3) - (x1 - x2) * (y3 - y4)

        x =
            ((x2 - x1) * (x4 - x3) * (y3 - y1) + (y2 - y1) * (x4 - x3) * x1 - (y4 - y3) * (x2 - x1) * x3) / denominator

        y =
            -((y2 - y1) * (y4 - y3) * (x3 - x1) + (x2 - x1) * (y4 - y3) * y1 - (x4 - x3) * (y2 - y1) * y3) / denominator
    in
    ( x, y )


intersectjudge : ( ( Float, Float ), ( Float, Float ) ) -> ( Float, Float ) -> Bool
intersectjudge d c =
    let
        ( a, b ) =
            d

        ( x1, y1 ) =
            a

        --1
        ( x2, y2 ) =
            b

        --2
        ( x3, y3 ) =
            c

        --mouse position
        judge =
            if x1 == x2 then
                False

            else
                let
                    y =
                        (y2 - y1) / (x2 - x1) * (x3 - x1) + y1
                in
                (y >= y3) && (x1 - x3) * (x2 - x3) <= 0
    in
    judge


{-| Check whether a point is inside the polygon.

    ispolygoninside [(0,0),(1,0),(1,1),(0,1)] (0.5,0.5)

It will return True.

-}
ispolygoninside : List ( Float, Float ) -> ( Float, Float ) -> Bool
ispolygoninside nodes pos =
    let
        nnodes =
            List.drop 1 nodes ++ List.take 1 nodes

        num =
            List.map2 Tuple.pair nodes nnodes
                |> List.map (\a -> intersectjudge a pos)
                |> List.foldl
                    (\a p ->
                        let
                            ans =
                                if a then
                                    p + 1

                                else
                                    p
                        in
                        ans
                    )
                    0
    in
    (modBy 2 num /= 0) && (List.length nodes > 2)


circlegen : Int -> List ( Float, Float )
circlegen n =
    let
        r =
            List.repeat n 1.0

        a =
            List.repeat n (2 * pi / toFloat n)

        na =
            List.indexedMap multiple a
    in
    List.map2 Tuple.pair r na


{-| Mutiply an integer with a float and return a float.
-}
multiple : Int -> Float -> Float
multiple a b =
    toFloat a * b


circ_distort : List Int -> List ( Float, Float ) -> List ( Float, Float )
circ_distort length circnodes =
    let
        ( a, b ) =
            List.unzip circnodes

        na =
            List.map2 multiple length a
    in
    List.map2 Tuple.pair na b


distort_circ_fit : ( Int, Int ) -> List ( Float, Float ) -> List ( Float, Float )
distort_circ_fit ( a, b ) cnodes =
    let
        l =
            toFloat (min a b) / 2

        ( r, ang ) =
            List.unzip cnodes

        gl =
            List.foldl max 0 r

        k =
            case gl <= l of
                True ->
                    1

                _ ->
                    l / gl

        nr =
            List.map (\x -> k * x) r
    in
    List.map2 Tuple.pair nr ang |> List.map fromPolar


{-| Generate ten nodes of the stones.
-}
stonegenerate : Int -> List Int -> ( Int, Int ) -> List ( Float, Float )
stonegenerate num length ( a, b ) =
    circlegen num |> circ_distort length |> distort_circ_fit ( a, b )
