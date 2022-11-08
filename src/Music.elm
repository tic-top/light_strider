port module Music exposing
    ( changeVolume
    , pause
    , start
    , settime
    , setrate
    )

{-| This module is used to control the BGM music.


# Functions

@docs changeVolume
@docs pause
@docs start
@docs settime
@docs setrate

-}


{-| This is a port function that can help you to control the volume of the music.
For example, if you want to change the volume of a audio tag, you need to make sure that the audio tag is written like this in view:

    audio
        [ Html.Attributes.src "assets/sample.ogg"
        , Html.Attributes.id "audio-sample"
        ]
        []

Change the id to a name that you want.

Then, if you want to change the volume on the music to 95%, you just need to call:

    changeVolume ( "audio-sample", 0.95 )

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the changeVolume function, it will print a console log in the browser like this

    Change_Volume audio - sample 0.9

-}
port changeVolume : ( String, Float ) -> Cmd msg


{-| This is a port function that can help you to pause the music.
For example, if you want to pause a music that is tagged "audio-sample", please write like this:
Change the id to a name that you want.

    pause "audio-sample"

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the function, it will print a console log in the browser like this

    Pause: audio - sample

-}
port pause : String -> Cmd msg


{-| This is a port function that can help you to start the music.
For example, if you want to start a music that is tagged "audio-sample", please write like this:
Change the id to a name that you want.

    start "audio-sample"

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the function, it will print a console log in the browser like this

    Start_Music: audio - sample

-}
port start : String -> Cmd msg


{-| This is a port function that can help you to set the progression bar of the music.
For example, if you want to set a music that is tagged "audio-sample" to 10s, please write like this:
Change the id to a name that you want.

    settime ( "audio-sample", 10 )

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the function, it will print a console log in the browser like this

    Set_Play_Time: audio - sample 10

-}
port settime : ( String, Float ) -> Cmd msg


{-| This is a port function that can help you to slow down or speed up the music.
For example, if you want to set the rate of a music that is tagged "audio-sample" to 0.5, please write like this:
Change the id to a name that you want.

    setrate ( "audio-sample", 0.5 )

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the function, it will print a console log in the browser like this

    Set_Music_Rate: audio - sample

-}
port setrate : ( String, Float ) -> Cmd msg
