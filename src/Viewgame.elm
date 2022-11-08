module Viewgame exposing
    ( view_game
    , view_transition
    , view_fade_out
    , view_playing
    )

{-| This program is used to view the model during gaming


# Function

@docs view_game
@docs view_transition
@docs view_fade_out
@docs view_playing

-}

import Debug exposing (toString)
import Html exposing (..)
import Html.Attributes as HtmlAttr exposing (..)
import Html.Events.Extra.Mouse as Mouse
import Map exposing (..)
import Music exposing (changeVolume, pause, setrate, settime, start)
import Parameter exposing (..)
import Polygoninside exposing (..)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr exposing (xlinkHref)


{-| This function is to view the game when it is fading out and connecting to score board
-}
view_fade_out : Model -> Html Msg
view_fade_out model =
    let
        set =
            model.gameset

        timer =
            set.timer

        opacity =
            Basics.max (cos (timer * pi / 9000)) 0.0
    in
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "position" "fixed"
        , style "left" "0"
        , style "top" "0"
        , style "opacity" (toString opacity)
        ]
        [ Svg.svg
            [ SvgAttr.width "100%"
            , SvgAttr.height "100%"
            ]
            (List.map (view_brick set.windowsize set.maptimer set.map set.uppos) (range2d ( 12, right_bound ))
                ++ view_objects model
                ++ view_lights model
                ++ [ view_select_pos model ]
                ++ view_border model
            )
        ]


{-| This function is to view the general playing process of the game
-}
view_playing : Model -> Html Msg
view_playing model =
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "position" "fixed"
        , style "left" "0"
        , style "top" "0"
        ]
        (view_game model
            ++ [ p
                    [ Mouse.onClick Click
                    , style "width" "100%"
                    , style "height" "100%"
                    , style "position" "fixed"
                    , style "left" "0"
                    , style "top" "0"
                    ]
                    []
               , audio
                    [ HtmlAttr.controls True
                    , HtmlAttr.src "assets/Sound/gaming_soundtrack.ogg"
                    , HtmlAttr.id "audio-sample"
                    , HtmlAttr.autoplay True
                    , HtmlAttr.loop True
                    ]
                    []
               , audio
                    [ HtmlAttr.controls True
                    , HtmlAttr.src "assets/Sound/place_instrument.ogg"
                    , HtmlAttr.id "place_instrument"
                    , HtmlAttr.autoplay False
                    ]
                    []
               , audio
                    [ HtmlAttr.controls True
                    , HtmlAttr.src "assets/Sound/light_on_plant.ogg"
                    , HtmlAttr.id "light_plant"
                    , HtmlAttr.autoplay False
                    ]
                    []
               ]
        )


view_scorebar : Model -> Html Msg
view_scorebar model =
    let
        set =
            model.gameset

        scorelist =
            set.score
                |> List.sum

        score =
            scorelist * 10 + set.maptimer * 5

        ( window_x, window_y ) =
            model.gameset.windowsize
    in
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "top" "0%"
        , style "left" "0%"
        , style "position" "fixed"
        ]
        [ div
            [ style "width" "20%"
            , style "height" "20%"
            , style "text-align" "center"
            , style "left" "0%"
            , style "top" "10%"
            , style "position" "fixed"
            , style "color" "rgb(255,225,121)"
            , style "font-size" <| (toString <| window_y / 30) ++ "px"
            ]
            [ text <| "Your Score:" ]
        , div
            [ style "width" "20%"
            , style "height" "50%"
            , style "top" "20%"
            , style "text-align" "center"
            , style "left" "0%"
            , style "position" "fixed"
            , style "color" "rgb(255,225,121)"
            , style "font-size" <| (toString <| window_y / 20) ++ "px"
            ]
            [ text <| toString score ]
        ]


{-| This function receive the model and returns all the necessary Html Msg information for viewing. For example, you can use

    div
        []
        (view_game model)

in the view function to see the objects (rocks, plants, splitters, mirrors, ghosts, light, borders, click position) in the model.

-}
view_game : Model -> List (Html Msg)
view_game model =
    let
        set =
            model.gameset
    in
    [ Svg.svg
        [ SvgAttr.width "100%"
        , SvgAttr.height "100%"
        ]
        (List.map (view_brick set.windowsize set.maptimer set.map set.uppos) (range2d ( 12, right_bound ))
            ++ view_ghosts model
            ++ view_objects model
            ++ view_lights model
            ++ [ view_select_pos model ]
            ++ view_border model
        )
    ]
        ++ [ case model.progress of
                Gaming Endless ->
                    view_scorebar model

                _ ->
                    div [] []
           ]


view_ghosts : Model -> List (Svg Msg)
view_ghosts model =
    let
        set =
            model.gameset

        maptimer =
            set.maptimer

        uppos =
            set.uppos

        p =
            5

        n =
            modBy p maptimer

        ( window_x, window_y ) =
            set.windowsize

        ghostlist =
            [ ( 5, 5 ), ( 4, 4 ), ( 3, 3 ), ( 1, 2 ), ( 5, 8 ), ( 8, 9 ) ]
    in
    List.map
        (\a ->
            let
                ( x, y ) =
                    a
            in
            Svg.image
                [ SvgAttr.width (toString (0.06 * window_x))
                , SvgAttr.height (toString (0.1 * window_y))
                , SvgAttr.x (toString (toFloat (y - 1) * 0.06 * window_x + 0.14 * window_x))
                , SvgAttr.y
                    (toString (toFloat (x - 1) * 0.1 * window_y - uppos * window_y / 10 + toFloat maptimer * 0.1 * window_y))
                , SvgAttr.xlinkHref "assets/Graphics/ghost.png"
                , SvgAttr.opacity (opa n)
                ]
                []
        )
        ghostlist


opa : Int -> String
opa n =
    if n == 1 then
        "1"

    else
        "0"


view_brick : ( Float, Float ) -> Int -> Map -> Float -> ( Int, Int ) -> Svg Msg
view_brick ( window_x, window_y ) maptimer map uppos pos =
    let
        ( x, y ) =
            pos
    in
    Svg.rect
        [ SvgAttr.width (toString (0.06 * window_x))
        , SvgAttr.height (toString (0.1 * window_y))
        , SvgAttr.x (toString (toFloat (y - 1) * 0.06 * window_x + 0.14 * window_x))
        , SvgAttr.y
            (toString (toFloat (x - 1) * 0.1 * window_y - uppos * window_y / 10 + toFloat maptimer * 0.1 * window_y))
        , SvgAttr.fill (gridColor (map_find map x y))
        , SvgAttr.opacity "1"
        , SvgAttr.stroke (gridColor (map_find map x y))
        ]
        []


view_border : Model -> List (Svg Msg)
view_border model =
    let
        set =
            model.gameset

        ( window_x, window_y ) =
            set.windowsize
    in
    [ Svg.rect
        [ SvgAttr.width (toString (0.2 * window_x))
        , SvgAttr.height (toString window_y)
        , SvgAttr.x (toString 0)
        , SvgAttr.y (toString 0)
        , SvgAttr.fill "black"

        --, SvgAttr.opacity ""
        ]
        []
    , Svg.rect
        [ SvgAttr.width (toString (0.2 * window_x))
        , SvgAttr.height (toString window_y)
        , SvgAttr.x (toString (0.8 * window_x))
        , SvgAttr.y (toString 0)
        , SvgAttr.fill "black"
        , SvgAttr.opacity "1"
        ]
        []
    ]


{-| This function is used to transform a list of points ((Float,Float)) into the String type. It mainly benefits us when using
SvgAttr.points function.
For example, when you are writing

    encode_points [(1,2),(2,3)]

the result will be "1,2 2,3 "

-}
encode_points : List ( Float, Float ) -> String
encode_points points =
    case points of
        [] ->
            ""

        x :: xs ->
            let
                ( a, b ) =
                    x
            in
            (toString a ++ "," ++ toString b) ++ " " ++ encode_points xs


view_lights : Model -> List (Svg Msg)
view_lights model =
    let
        ( window_x, window_y ) =
            model.gameset.windowsize

        lightpaths =
            model.gameset.light_path
                |> List.map (\a -> [ a.head, a.tail ])
    in
    List.map (view_light window_x window_y model.gameset.uppos) lightpaths


view_light : Float -> Float -> Float -> List ( Float, Float ) -> Svg Msg
view_light window_x window_y uppos lightpath =
    let
        viewpoints =
            List.map (\( a, b ) -> ( 0.2 * window_x + a * 0.06 * window_x, window_y * 0.1 * b - uppos * window_y / 10 )) lightpath
    in
    Svg.polyline
        [ SvgAttr.stroke "rgb(255,225,121)"
        , SvgAttr.strokeWidth "3"
        , SvgAttr.fill "none"
        , SvgAttr.strokeOpacity "1.0"
        , SvgAttr.points (encode_points viewpoints)
        ]
        []


view_select_pos : Model -> Svg Msg
view_select_pos model =
    let
        set =
            model.gameset

        ( window_x, window_y ) =
            set.windowsize

        placestate =
            model.place_state

        ( posx, posy ) =
            (\( a, b ) -> ( 0.2 * window_x + a * 0.06 * window_x, window_y * 0.1 * b - model.gameset.uppos * window_y / 10 )) model.clickpos
    in
    case placestate of
        Select_Device ->
            Svg.circle
                [ SvgAttr.cx (toString posx)
                , SvgAttr.cy (toString posy)
                , SvgAttr.r "10"
                , SvgAttr.fill "yellow"
                , SvgAttr.stroke "yellow"
                , SvgAttr.strokeOpacity "1.0"
                ]
                []

        _ ->
            Svg.circle
                []
                []


view_objects : Model -> List (Svg Msg)
view_objects model =
    let
        set =
            model.gameset

        objects =
            set.objects

        list_stones =
            List.filter
                (\a ->
                    case a.object_type of
                        Stone num _ ->
                            True

                        _ ->
                            False
                )
                objects

        list_others =
            List.filter
                (\a ->
                    case a.object_type of
                        Stone num _ ->
                            False

                        _ ->
                            True
                )
                objects
    in
    (List.map (view_object set.windowsize set.uppos) list_others ++ List.map (view_object set.windowsize set.uppos) list_stones)
        |> List.concat


view_object : ( Float, Float ) -> Float -> Object -> List (Svg Msg)
view_object ( window_x, window_y ) uppos object =
    case object.object_type of
        Mirror ->
            let
                viewnodes =
                    List.map (view_transition ( window_x, window_y ) uppos) object.nodes

                ( x1, y1 ) =
                    List.head viewnodes
                        |> Maybe.withDefault ( 0, 0 )

                ( x2, y2 ) =
                    List.drop 1 viewnodes
                        |> List.head
                        |> Maybe.withDefault ( 0, 0 )
            in
            [ Svg.line
                [ SvgAttr.x1 (toString x1)
                , SvgAttr.y1 (toString y1)
                , SvgAttr.x2 (toString x2)
                , SvgAttr.y2 (toString y2)
                , SvgAttr.fill "black"
                , SvgAttr.stroke "rgb(255,160,14)"
                , SvgAttr.strokeWidth "5"
                ]
                []
            ]

        Splitter _ ->
            let
                viewnodes =
                    List.map (view_transition ( window_x, window_y ) uppos) object.nodes

                ( x1, y1 ) =
                    List.head viewnodes
                        |> Maybe.withDefault ( 0, 0 )

                ( x2, y2 ) =
                    List.drop 1 viewnodes
                        |> List.head
                        |> Maybe.withDefault ( 0, 0 )
            in
            [ Svg.line
                [ SvgAttr.x1 (toString x1)
                , SvgAttr.y1 (toString y1)
                , SvgAttr.x2 (toString x2)
                , SvgAttr.y2 (toString y2)
                , SvgAttr.fill "black"
                , SvgAttr.stroke "rgb(255,50,56)"
                , SvgAttr.strokeWidth "5"
                ]
                []
            ]

        Stone _ _ ->
            viewstone ( window_x, window_y ) uppos object

        Plant ( ( a, b ), c ) ->
            viewplant ( window_x, window_y ) uppos object ( ( a, b ), c )

        _ ->
            let
                nodes =
                    object.nodes

                viewpoints =
                    List.map (view_transition ( window_x, window_y ) uppos) nodes
            in
            [ Svg.polygon
                [ SvgAttr.fill "blue"
                , SvgAttr.stroke "red"
                , SvgAttr.points (encode_points viewpoints)
                ]
                []
            ]


{-| This function transform a point into a relative coordinate point for viewing. So our game can adapt to different window size
the player is using. It accepts the current windows size and the upposition of the game, so as the point that is going to be transformed.
For example, you can write

    view_transition ( window_x, window_y ) uppos object.pos

to get the relative position of an object. where the window\_x window\_y is stored in the model.gameset.windowsize.

-}
view_transition : ( Float, Float ) -> Float -> ( Float, Float ) -> ( Float, Float )
view_transition ( window_x, window_y ) uppos ( a, b ) =
    let
        ( x, y ) =
            ( 0.2 * window_x + a * 0.06 * window_x, window_y * 0.1 * b - uppos * window_y / 10 )
    in
    ( x, y )


viewstone : ( Float, Float ) -> Float -> Object -> List (Svg Msg)
viewstone ( window_x, window_y ) uppos object =
    let
        nodes =
            object.nodes

        viewpoints =
            List.map (view_transition ( window_x, window_y ) uppos) nodes

        ( n, m ) =
            case object.object_type of
                Stone a b ->
                    ( a, b )

                _ ->
                    ( -1, 0 )

        ( cx, cy ) =
            view_transition ( window_x, window_y ) uppos object.pos

        color =
            case n of
                1 ->
                    "rgb(88,55,53)"

                2 ->
                    "rgb(91,70,20)"

                3 ->
                    "rgb(61,82,68)"

                4 ->
                    "rgb(71,47,68)"

                5 ->
                    "rgb(61,48,96)"

                6 ->
                    if m >= 6 then
                        "rgb(96,20,39)"

                    else
                        "rgb(94,87,101)"

                _ ->
                    "black"

        r =
            2 * 0.06 * window_x
    in
    case n of
        6 ->
            if m >= 7 then
                [ Svg.polygon
                    [ SvgAttr.fill color
                    , SvgAttr.stroke "rgb(70,70,70)"
                    , SvgAttr.strokeWidth "5"
                    , SvgAttr.points (encode_points viewpoints)
                    ]
                    []
                , Svg.text_
                    [ SvgAttr.x (toString cx)
                    , SvgAttr.y (toString cy)
                    , SvgAttr.fill "rgb(171,5,66)"
                    , SvgAttr.fontSize "40"
                    , SvgAttr.textAnchor "middle"
                    , SvgAttr.dominantBaseline "central"
                    ]
                    [ text "!"
                    ]
                , Svg.circle
                    [ SvgAttr.cx (toString cx)
                    , SvgAttr.cy (toString cy)
                    , SvgAttr.r (toString r)
                    , SvgAttr.fillOpacity "0"
                    , SvgAttr.stroke "rgb(171,5,66)"
                    , SvgAttr.strokeOpacity "0.3"
                    , SvgAttr.strokeWidth "4"
                    , SvgAttr.strokeDasharray "20,10"
                    ]
                    []
                ]

            else
                [ Svg.polygon
                    [ SvgAttr.fill color
                    , SvgAttr.stroke "rgb(70,70,70)"
                    , SvgAttr.strokeWidth "5"
                    , SvgAttr.points (encode_points viewpoints)
                    ]
                    []
                ]

        _ ->
            [ Svg.polygon
                [ SvgAttr.fill color
                , SvgAttr.stroke "rgb(70,70,70)"
                , SvgAttr.strokeWidth "5"
                , SvgAttr.points (encode_points viewpoints)
                ]
                []
            ]


viewplant : ( Float, Float ) -> Float -> Object -> ( ( Int, Int ), Float ) -> List (Svg Msg)
viewplant ( window_x, window_y ) uppos object ( ( a, b ), c ) =
    let
        nodes =
            object.nodes

        viewpoints =
            List.map (view_transition ( window_x, window_y ) uppos) nodes

        ( x1, y1 ) =
            case List.head viewpoints of
                Just ( x, y ) ->
                    ( x, y )

                Nothing ->
                    ( 0, 0 )

        ( x2, y2 ) =
            case List.head (List.drop 1 viewpoints) of
                Just ( x, y ) ->
                    ( x, y )

                Nothing ->
                    ( 0, 0 )

        length =
            distance ( x1, y1 ) ( x2, y2 )

        ( va, vb ) =
            ( x1, y1 - length )

        link =
            case ( a, b ) of
                ( 1, 1 ) ->
                    "assets/Graphics/p1_1.png"

                ( 1, 2 ) ->
                    "assets/Graphics/p1_2.png"

                ( 2, 1 ) ->
                    "assets/Graphics/p2_1.png"

                ( 2, 2 ) ->
                    "assets/Graphics/p2_2.png"

                ( 3, 1 ) ->
                    "assets/Graphics/p3_1.png"

                --bad plant switching
                ( 3, 2 ) ->
                    "assets/Graphics/p3_2.png"

                ( 4, 1 ) ->
                    "assets/Graphics/p1_1.png"

                ( 4, 2 ) ->
                    "assets/Graphics/p1_2.png"

                ( _, _ ) ->
                    "assets/Graphics/p1_1.png"
    in
    [ Svg.image
        [ SvgAttr.width (toString length)
        , SvgAttr.height (toString length)
        , SvgAttr.x (toString va)
        , SvgAttr.y (toString vb)
        , SvgAttr.xlinkHref link
        , SvgAttr.transform ("rotate(" ++ toString c ++ "," ++ toString x1 ++ "," ++ toString y1 ++ ")")
        ]
        []
    ]
