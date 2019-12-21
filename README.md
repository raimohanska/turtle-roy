# Turtle Roy

A [Roy](http://roy.brianmckenna.org/) programming/learning environment with [Turtle Graphics](http://en.wikipedia.org/wiki/Turtle_graphics), as in the
[Logo](http://el.media.mit.edu/logo-foundation/logo/programming.html) programming language.

Try it online: [turtle-roy.heroku.com/](http://turtle-roy.heroku.com/)

# Turtle functions

Command                     | Result
----------------------------|-------------------------------------------
fd 100                      | moves 100 pixels forward
lt 45                       | turns left 45 degrees
rt 90                       | turns right 90 degrees
penup                       | lifts the pen, no trace left when moving
pendown                     | lowers the pen again for drawing
setshape "rocket-large"     | changes the cursor. available (with and without -large): butterfly, car, fairy, formula, princess, rocket, turtle
clear                       | clear the paper and reset turtle to center
home                        | reset the turtle to center
bg "red"                    | change background color (red, rgb(255,0,0), #FF0000)
color "red"                 | change pen color (red, rgb(255,0,0), #FF0000)
text "HELLO"                | draw the text "HELLO" beside the turtle
font "40px Arial"           | changes to the 40px Arial font
font 100                    | changes to the 100px Courier font

# Sound functions

Command                     | Result
----------------------------|-------------------------------------------
say "wat"                   | speak!
play c                      | plays the note C
play c 500                  | plays the note C for 500 milliseconds (half a second)
play c*2                    | plays the note C2 (frequency = C * 2)
pause                       | pauses for a while
pause 1000                  | pauses for 1000 milliseconds (1 second)

# Other functions

Command                     | Result
----------------------------|-------------------------------------------
print "x"                   | print to console
login "raimo"               | login as "raimo" (this is the author name in your saved work)
save "asdf"                 | save current work as "asdf"
open "asdf"                 | open saved work "asdf" (presuming you've saved with this name and current author name)
whoami                      | show the author name of the logged-in user (this is just saved in a cookie)
ls                          | list your saved works
sequence [fd 100, rt 90]    | 100 pixels forward, then right turn
s [fd 100, rt 90]           | same as above
repeat 4 (say "hello")      | says "hello" 5 times
r 4 (say "hello")           | same as above
par [play c, play e]        | playes notes C and E in parallel
later 500 (say "hello")     | waits 500 milliseconds in the backround and says "hello"
interval 1000 (say "hello") | Says hello each second

# Array / List functions

Example                     | Result         |   Description
----------------------------|----------------|----------------------
range 1 3                   | [1,2,3]        |   range of numbers
length [1,2,3]              | 3              |   list length
empty [1]                   | false          |   is list empty
concat [1,2] [3]            | [1,2,3]        |   concatenate lists
cons 1 [2,3]                | [1,2,3]        |   prepend to list
head [1,2]                  | 1              |   first item on list
tail [1,2,3]                | [2,3]          |   all but first item on list
last [1,2]                  | 2              |   last item on list
times 2 "yes"               | ["yes", "yes"] |   repeat same element
sum [1,2,3]                 | 6              |   sum of items on list
map (\x -> x * 2) [1,2]     | [2,4]          |   map list items with function
filter (\x -> x ==1) [1,2]  | [1]            |   filter list with function
zip plus [1,2] [3,4]        | [4,6]          |   zip lists pairwise with function
scanl plus 0 [1,2,3]        | [0,1,3,6]      |   accumulate values, output all
foldl plus 0 [1,2,3]        | 6              |   accumulate values, output last

In addition to this, you may use the full [Roy](http://roy.brianmckenna.org/) programming language.

# Examples

Bunch of examples available in the demo menu. Some more stuff here.

Basic Turtle commands

    fd 100
    lt 90
    rt 45

Square

    let square = repeat 4 (sequence[fd 50, lt 90])
    square

Flower

    let flower = repeat 36 (sequence[rt 10, square])
    flower

Math

    3 + 4
    3 / 4
    let factorial n = if n==1 then 1 else n * (factorial n - 1)
    factorial 12

Strings

    "apple" ++ "sauce"
    "apple" + 10 (won't compile)

Lists

    range 1 99
    times 100 "lol"
    head [1,2,3]
    tail [1,2,3]
    concat [1,2,3] [4,5,6]
    length [1,2,3]
    empty []
    let reverse xs = if (empty xs) then [] else concat (reverse (tail xs)) [head xs]
    reverse [1,2,3]
    sum [1,2,3]
    map (\x -> x * 2) [1,2,3]
    filter (\x -> x > 1) [1,2,3]
    foldl (\x y -> x * y) 1 [1,2,3]

# Export

You can export your drawing as a series of commands in JSON format by opening your browser's 
developer console and typing `turtle.export()`.

# Building and running

Build (and rebuild on javascript changes)

    npm install

Install mongodb

    brew install mongo

Run the server (node.js / express)

    ./runmongo
    ./server

And

    open http://localhost:8070

To build client-side code on every change, just

    npm run watch

# Credits

Thanks to Miikka "arcatan" Koskinen for creating [tryroy](https://github.com/miikka/tryroy), from where I shamelessly stole the Roy browser REPL.

Thanks to Brian McKenna for the [Roy](https://github.com/pufuwozu/roy) language and support.

See origins of the cursor images from src/main/webapp/images/image-sources.txt
