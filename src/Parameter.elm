module Parameter exposing
    ( Brick(..)
    , Button
    , GameState(..)
    , Game_Set
    , Level(..)
    , Light
    , Line
    , Line_element
    , Map
    , Model
    , Msg(..)
    , Object
    , ObjectType(..)
    , PlaceState(..)
    , ProgressState(..)
    , ScoreBoard
    , ScoreBoard_State(..)
    , Todolist
    , ButtonType(..)
    , init_board
    , init_model
    , map_initial
    , map_initial_empty
    , right_bound
    )

{-| This module is used to control all the basic parameter in the games


# Type

@docs Brick
@docs Button
@docs GameState
@docs Game_Set
@docs Level
@docs Light
@docs Line
@docs Line_element
@docs Map
@docs Model
@docs Msg
@docs Object
@docs ObjectType
@docs PlaceState
@docs ProgressState
@docs ScoreBoard
@docs ScoreBoard_State
@docs Todolist
@docs ButtonType


# Functions

@docs init_board
@docs init_model
@docs map_initial
@docs map_initial_empty
@docs right_bound

-}

import Animation as Ani
import Browser.Dom exposing (Viewport)
import Html.Events.Extra.Mouse as Mouse
import Random



--initialize the board.


{-| This function is used to initial lize the score board.
This function is only for initialize so you can just call it by:

board = init\_board

-}
init_board : ScoreBoard
init_board =
    { board =
        Ani.style
            []
    , state = Begin
    , score =
        ( Ani.style
            []
        , 0
        )
    , newrecord =
        Ani.style
            []
    , reset_button =
        Ani.style
            []
    , menu_button =
        Ani.style
            []
    }



-- initialize the model.


{-| This function is helped to init our model for the init function, since it is only used to initialize, you can called it by

    newmodel = init_model

Be careful
It is used to create a whole new model, so the windowsize is not the correct one.

-}
init_model : Model
init_model =
    let
        m =
            map_initial

        t =
            [ ( 1, 1 ) ]

        set =
            Game_Set [ Line_element ( 5, -1 ) ( 5, 10 ), Line_element ( 4, -1 ) ( 4, 10 ) ] [] [] ( 0, 10 ) Playing 0 0 m t 0 []
    in
    Model set (Random.initialSeed 2) None ( 0, 0 ) Select_Pos Openanimation (Ani.style [ Ani.opacity 0.0 ]) [] init_board [] [] 1



-- the state of the game.


{-| This is a datatype recording the gamestate. Paused means the game is not continuing and everything stops.
Playing means the game functions normally. Notbegin records the menu state and stopped means
For example, if you have a model with a paused gamestate, the game is now stopped. If you want to make the game continues, you can write in the update function

    newmodel =  {model | GameState = Playing}

Please return the new model in the Update function so that the game continues.

-}
type GameState
    = Paused
    | Playing
    | Notbegin



-- the level of the game.


{-| This is a type that records which level the player is in now. Endless means the endless mode. for Finite Int Int, First int is the level (1,2,3) ,second is the stage, set whatever you like, use it to operate what instruction need to appear at where.
For example, if the player click the Endless button, we will write

    newmodel = {model | Level = Endless}

And return the new model in the Update function so that the game enters the endless mode.

-}
type Level
    = Endless
    | Finite Int Int -- First int is the level (1,2,3) ,second is the stage, set whatever you like, use it to operate what instruction need to appear at where



-- the progress state of the game.


{-| This is a type that records which progress the game is at now. It mainly focuses on what we show in the view function. Gaming Level means the player is playing a certain level.
Openanimation means that we are now showing the open animation to the player. Menu means we are showing the menu page. Helppage
menas we are showing the helppage. Fadeout means the player loses the game and the view is fading out. ShowScoreBoard is after the
fade out animation to show the score of the plyer.
For example, when the player click the Helppage button, we will write

    newmodel = {model | ProgressState = Helppage}

And return the new model in the Update function so that the helppage is shown.

-}
type ProgressState
    = Gaming Level
    | Openanimation
    | Menu
    | Helppage
    | Fadeout Level
    | ShowScoreBoard Level



-- the type of an object.


{-| This is a type that records the the type of object. Mirror means it is a mirror. Plant ( ( Int, Int ), Float ) means it is a plant and first int is type(Plant first Int : 1,2 normal plant. 3 dark plant. 4 final plant for finite level 1 and 2), second is state(Lighted or not), float is incline angle.
Splitter Int means it is a splitter, and Int value 1 for already generating light, 0 for not yet generating light. Stone Int Int
means that it is a stone(First Int denotes the type of stone, Second Int is a random number for determining whether it is an explosive rock). Default means it is an object that doesn't belong to above type.
For example, you can use

    Object [(0,0), (1,1)] Mirror (0.5,0.5)

to generate a mirror with head (0,0) tail (1,1) in the game. And add it to the object list in model.

-}
type ObjectType
    = Mirror
    | Plant ( ( Int, Int ), Float ) -- first int is type, second is state, float is incline angle.
      -- Plant first Int : 1,2 normal plant. 3 dark plant. 4 final plant for finite level 1 and 2.
    | Splitter Int --(1 for already generating light, 0 for not yet generating light)
    | Stone Int Int
    | Default



-- only for light-related device
-- the info of an object.


{-| This is a datatype that records all the objects that may have influence on the light, including mirror, splitter, stone, plants.
nodes records all the node of that object
object\_type tells which kind of object it is
pos records the object's center position
-}
type alias Object =
    { nodes : List ( Float, Float )
    , object_type : ObjectType
    , pos : ( Float, Float )
    }



-- the info for a light.


{-| This is a datatype that records all the information needed for a light.
-}
type alias Light =
    { source : ( Float, Float )
    , dir : Float -- 0 means point to right, 90 upwards, 180 left, 270 downwards
    , path : List ( Float, Float )
    }



-- tell us what state the players are in now. So that we can determine what operations are allowed.


{-| This is a datatype that tells us what state the players are in now. So that we can determine what operations are allowed.
Select\_Pos means that the player is now permitted to select a position. Select\_Device means that the player is now permitted
to press Q or W to select a mirror or splitter. Device\_Placed means that the player has already place a device and may now rotate
the device. Adjust\_Angel means that the player is pressing space now, so we need to rotate the selected mirror.
For example, when the player press space in case that the PlaceState is currently Device\_Placed with a mirror, you can write.

    newmodel={model|PlaceState=Adjust_Angle}

So that the mirror begins to rotate.

-}
type PlaceState
    = Select_Pos
    | Select_Device
    | Device_Placed
    | Adjust_Angle



-- the type of the button.


{-| This is a datatype that records the type of a button. Start Game Level defines a button that will start the game with level 1,2 or endless.
Help defines a button that will jump into a help page. Reset Level defines a button that will restart this level. ReturnMenu defines
a button that will jump to the menu. Clicking different buttons results in different msg so that we can adjust our game.
For example, when you click Help button, a message

    Mouseclick Help

will generate and we can change our game model accordingly.

-}
type ButtonType
    = StartGame Level
    | Help
    | Reset Level
    | ReturnMenu



-- the information of a button.


{-| This is a datatype recording the buttons on the menu page.
anistate means the current animation state
helppage stores the pages corresponding to the button, since it might more than 1 so we use a list to store all the animation state
buttontype tells what kinds of button it is
-}
type alias Button =
    { anistate : Ani.State
    , helppage : List Ani.State
    , buttontype : ButtonType
    }


{-| This is a datatype that records all the stuffs that may appear and is used to control the game
light means all the light source(only appear at the top of the screen)
light\_path is the path of all the light souce after impacted by the objects
objects store all the objects in the game
windowsize is the current size of your web browser
gamestate is the Current game state, records a type called GameState
uppos is the current position of the upper bound of your viewport, it stores a float to reflect the y axis number in the game's reference
timer records how much time the game has float. And it stores a float
map records the current map of the game, it will generate automatically and delete out range to keep in a suitable size
todo records the position which needs to be generate into map, since we are generating a limit amount of map brick once, we use it to guide where we should start in the next generation
maptimer records how much level of map bricks have been deleted, it is used to calculate the score of the player and helps to decide when to start a new generation of map
score records how many flowers and which types of flowers players have lightened
-}
type alias Game_Set =
    { light : Line --light source
    , light_path : Line
    , objects : List Object
    , windowsize : ( Float, Float )
    , gamestate : GameState
    , uppos : Float
    , timer : Float
    , map : Map
    , todo : Todolist
    , maptimer : Int
    , score : List Int
    }


{-| This is the model of our game, it stops all the things that might be used to run our game
gameset is storing all the basic element in our game
seed is used to generate random number
events is used to get the position where the player clicks
clickpos record the position in the last field
place\_state stores the current state of setting a optical instrument, e.g. Select\_device, Selece\_pos etc.
progress stores the current progress of the game
animatecurtain only takes care of the animation relates to opening animation
button stores the button in the menu page
scoreboard stores all the elements on our scoreboard
highscore records all the former score of the players
instructions controls all the animation relates to instructions in finite level
volume stores the current volume of the game range from 0 to 1
-}
type alias Model =
    { gameset : Game_Set
    , seed : Random.Seed
    , events : Msg
    , clickpos : ( Float, Float )
    , place_state : PlaceState
    , progress : ProgressState
    , animatecurtain : Ani.State
    , button : List Button
    , scoreboard : ScoreBoard
    , highscore : List Int -- use to store high score list
    , instructions : List Ani.State
    , volume : Float
    }



-- the state of the scoreboard.


{-| This data type records the state of the Score Board
Begin means the scoreboard is initializing
Dropdown means the scoreboard is dropping downward
Counting means the number of score is flipping
Recording means the "new record" are zooming in
ButtonRaise means the buttons "return menu" and "reset" zooming in
-}
type ScoreBoard_State
    = Begin
    | Dropdown
    | Counting
    | Recording
    | ButtonRaise



-- the info for the scoreboard.


{-| This datatype stores all the parameter needed to control a score board
board stores the animation state of the main board(the big rectangle)
state stores the current animation state of the whole process
score stores the tuple, first is to store its animation state and the second store the current number the score has flipped
newrecord stores the animation state of the "new record"
reset\_button and the menu\_button stores the animation state of two buttons
-}
type alias ScoreBoard =
    { board : Ani.State
    , state : ScoreBoard_State
    , score : ( Ani.State, Int )
    , newrecord : Ani.State
    , reset_button : Ani.State
    , menu_button : Ani.State
    }


{-| This datatype contains all the Msg that will transfer information between model and the player.
Key\_Down Int means that a key is press and the Int store the key code of that key
Key\_Up Int means that a key is releasse and the Int store the key code of that key
Tick Float records the time interval between two tick messages
Rocktype (List Int) describes the rocks, first Int is for rock type and the rest is for rock shape
GetViewport Viewport is used to control the viewport of the web browser
Resize Int Int is used to adapt to current size of web browser
Start Level is used to start a specific level
None means no msg
RaiseButton Int means the mouse is over the button and the certain animation will be played
DropButton Int means the mouse is leaving the button and the certain animation will be played
HelpClick helps to enter the helppage
Click Mouse.Event records the click of the user
Animate Ani.Msg used to store the animation msg when something is animating
Mouseover ButtonType is used to store the button for the scoreboard button when mouse is over
Mouseleave used to start animation when mouse is leave
Mouseclick used to check if the button is clicked.
-}
type Msg
    = Key_Down Int
    | Key_Up Int
    | Tick Float
    | Rocktype (List Int) --the first for rocktype; rest for rock shape
    | GetViewport Viewport
    | Resize Int Int
    | Start Level
      -- | Pause
      -- | Resume
      -- | Fail
      -- | Victory
    | None
    | RaiseButton Int
    | DropButton Int
      -- | Jump
    | HelpClick
    | Click Mouse.Event
    | Animate Ani.Msg
    | Mouseover ButtonType
    | Mouseleave ButtonType
    | Mouseclick ButtonType


{-| This is a data type record the information of a brick.
Empty means that this brick has not been filled
Rock a (x,y) means that the rock type is a and (x,y) is relative position of this brick in the rock
-}
type Brick
    = Empty
    | Rock Int ( Int, Int )


{-| This is a datatype that cotains the message of the map.
Every element of it is a brick.
-}
type alias Map =
    List (List Brick)


{-| This is a data type store the postion in the map to be filled with brick
-}
type alias Todolist =
    List ( Int, Int )


{-| This is the width of the map

    right_bound

    --12

-}
right_bound : Int
right_bound =
    12


{-| This function returns the initial empty map.

    map_initial

    --[ [Empty,Empty,Empty,Empty,Empty,Empty,Empty,Empty,Empty,Empty,Empty,Empty] ]

-}
map_initial : Map
map_initial =
    [ map_initial_empty right_bound ]


{-| This function returns the initial line of the empty map.

    map_initial_empty 5

    -- [Empty,Empty,Empty,Empty,Empty]

-}
map_initial_empty : Int -> List Brick
map_initial_empty n =
    if n == 0 then
        []

    else
        Empty :: map_initial_empty (n - 1)


{-| This is a datatype that defines a vector in our game. The head means the initial point and the tail means the point which the
vector is pointed to.
-}
type alias Line_element =
    { head : ( Float, Float )
    , tail : ( Float, Float )
    }


{-| This is a datatype that defines a list of vectors in our game.
-}
type alias Line =
    List Line_element
