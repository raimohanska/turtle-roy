# Turtle Roy

A Roy programming/learning environment with Turtle Graphics, as in the
Logo programming language.

Try it online: [turtle-roy.heroku.com/](http://turtle-roy.heroku.com/)

You can of course try it on your own box too by running the "run" script.

# Examples

Basic Turtle commands

    fd 100
    lt 90
    rt 45

Square

    let square = repeat 4 (sequence[fd 50, lt 90])
    square

Flower

    let flower = repeat 36 (rt 10, square)
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
    head [1,2,3]
    tail [1,2,3]
    concat [1,2,3] [4,5,6]
    length [1,2,3]
    let reverse xs = if (empty xs) then [] else concat (reverse (tail xs)) [head xs]
    reverse [1,2,3]

# Credits

Thanks to Miikka "arcatan" Koskinen for creating [tryroy](https://github.com/miikka/tryroy), from where I shamelessly stole the Roy browser REPL.

Thanks to Brian McKenna for the [Roy](https://github.com/pufuwozu/roy) language and support.
