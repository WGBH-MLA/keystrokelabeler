cats = 
{
    "B": {
        "key": "B",
        "name": "Bars",
        "desc": "SMPTE bars typically often appearing before and/or after a program",
        "subtypes": {}
    },
    "S": {
        "key": "S",
        "name": "Slate",
        "desc": "Program slate, typically appearing immediately before a program, displaying basic program information.",
        "subtypes": {
            "H": {
                "key": "H",
                "name": "Handwritten",
                "desc": "Slate information written by hand with chalk or marker"
            },
            "C": {
                "key": "C",
                "name": "Clapperboard",
                "desc": "Slate information displayed on a clapperboard"
            },
            "S": {
                "key": "D",
                "name": "Digital text",
                "desc": "Slate appearing as text on a digital display"
            },
            "B": {
                "key": "B",
                "name": "Slate over bars",
                "desc": "Slate information digitally imposed over SMPTE bars"
            },
            "G": {
                "key": "G",
                "name": "Graphical",
                "desc": "Slate information interspersed with graphical elements"
            }
        }
    },
    "W": {
        "key": "W",
        "name": "Audience or content warning",
        "desc": "Frame displaying information about audience level of sensitive content",
        "subtypes:": {}
    },
    "L": {
        "key": "L",
        "name": "Organization logo",
        "desc": "Logo of an organization involved in the production of the program",
        "subtypes:": {}
    }
}
;

modCode = "T"
modName = "transitional"
modDesc = "The frame occurs during an interval of transition between frame types."

jumpFactors = [1, 2, 5, 15, 30, 60, 90, 120, 180, 360] ; 