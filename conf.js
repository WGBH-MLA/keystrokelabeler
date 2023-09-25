jumpFactors = [1, 2, 5, 15, 30, 60, 90, 120, 180, 360] ; 

feedbackPause = 700 ;

// Each top-level key in the `cats` object must be a single uppercase letter.
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
            "D": {
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
        "name": "Warning for audience",
        "desc": "Frame displaying information about audience level of sensitive content",
        "subtypes": {}
    },
    "L": {
        "key": "L",
        "name": "Logo of an organization",
        "desc": "Logo of an organization involved in the production of the program",
        "subtypes": {}
    },
    "O": {
        "key": "O",
        "name": "Opening sequence text",
        "desc": "",
        "subtypes": {}
    },
    "T": {
        "key": "T",
        "name": "Main title card",
        "desc": "",
        "subtypes": {}
    },
    "I": {
        "key": "I",
        "name": "Chyron for speaker ID",
        "desc": "",
        "subtypes": {}
    },
    "N": {
        "key": "N",
        "name": "Chyron and person, without speaker ID",
        "desc": "",
        "subtypes": {}
    },
    "P": {
        "key": "P",
        "name": "Person centered without Chyron",
        "desc": "",
        "subtypes": {}
    },
    "Y": {
        "key": "Y",
        "name": "Chyron with no single person",
        "desc": "",
        "subtypes": {}
    },
    "K": {
        "key": "K",
        "name": "Ticker without Chyron",
        "desc": "",
        "subtypes": {}
    },
    "G": {
        "key": "G",
        "name": "Graphical text",
        "desc": "",
        "subtypes": {}
    },
    "M": {
        "key": "M",
        "name": "Miscellaneous text",
        "desc": "",
        "subtypes": {}
    },
    "C": {
        "key": "C",
        "name": "Closing credits",
        "desc": "",
        "subtypes": {}
    },
    "R": {
        "key": "R",
        "name": "Copyright statement",
        "desc": "",
        "subtypes": {}
    }

}
;

modCode = "T" ; 
modName = "transitional" ;
modDesc = "The frame occurs during an interval of transition between frame types." ;
