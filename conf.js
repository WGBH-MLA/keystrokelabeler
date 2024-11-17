/**
 * conf.js
 * 
 * This file assigns values to global variables that configure the Keystroke
 * Labeler application.
 * 
 * In particular, it defines the labels and their meanings (as to be displayed
 * in the help panel of the application).
 * 
 * It also defines useful configuration options.
 * 
 * Values of variables are intended to be set by users according to the categories
 * involved in their labeling project.
 * 
 * Hence, the data in this file constitutes metadata for the labeling project.
 * It is recommended to keep a copy of the `conf.js` file used in a particular 
 * labeling project with the dataset produced.
 * 
 */


// The `imgDir` is the path to the directory where the images to be labeled 
// are stored.  
// If a relative path is used, it must be relative to the location of the main
// labeler.html file.
// (This value may be overridden if it is also set in the img_arr_init.js file.)
let imgDir = "./images/"

// The `jumpFactors` array defines the allowed jump factors.
// The jump factor is the number of items between the current item and the next
// or previous item when navigating.
let jumpFactors = [1, 5, 15, 30, 60, 120] ; 

// The `feedbackPause` is the number of milliseconds to register key entry
// in keystroke mode, before advancing to the next item.
let feedbackPause = 300 ;

// The `cats` dictionary defines all labels for the labeling project.
// Each top-level key in the `cats` object must be a single uppercase letter.
let cats = 
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
        "desc": "Program slate, typically appearing immediately before a program, displaying basic program information",
        "subtypes": {
            "H": {
                "key": "H",
                "name": "Handwritten",
                "desc": "Slate information written by hand with chalk or marker, but not on clapperboard"
            },
            "C": {
                "key": "C",
                "name": "Clapperboard",
                "desc": "Slate information displayed on a clapperboard"
            },
            "D": {
                "key": "D",
                "name": "Simple digital text",
                "desc": "Slate appearing as text on a digitally-generated display"
            },
            "B": {
                "key": "B",
                "name": "Slate over bars",
                "desc": "Slate information digitally imposed over SMPTE bars"
            },
            "G": {
                "key": "G",
                "name": "Graphical",
                "desc": "Slate information digitally interspersed with graphical elements"
            }
        }
    },
    "W": {
        "key": "W",
        "name": "Warning for audience",
        "desc": "A frame displaying information about audience level of sensitive content",
        "subtypes": {}
    },
    "L": {
        "key": "L",
        "name": "Logo",
        "desc": "Logo, usually of an organization involved, but not a title card",
        "subtypes": {}
    },
    "O": {
        "key": "O",
        "name": "Opening sequence text",
        "desc": "A frame with text that is part of the opening credits or intro sequence",
        "subtypes": {}
    },
    "M": {
        "key": "M",
        "name": "Main title card",
        "desc": "Title card dipslaying the title of the main program",
        "subtypes": {}
    },
    "I": {
        "key": "I",
        "name": "Chyron for person ID",
        "desc": "Text on the lower third of the screen that identifies the focal person on the screen",
        "subtypes": {}
    },
    "N": {
        "key": "N",
        "name": "Person focal and chyron; No ID",
        "desc": "Text on the lower third of the screen, along with a focal person, but not identifying that person",
        "subtypes": {}
    },
    "E": {
        "key": "E",
        "name": "Person focal, with Extra text",
        "desc": "A frame prominently displaying a single person, with extra text that is not a chyron",
        "subtypes": {}
    },
    "P": {
        "key": "P",
        "name": "Person focal; No text",
        "desc": "A frame prominently displaying a single person but without text",
        "subtypes": {}
    },
    "Y": {
        "key": "Y",
        "name": "Chyron; No focal person",
        "desc": "Text on the lower third of the screen, but without a single person most prominent",
        "subtypes": {}
    },
    "U": {
        "key": "U",
        "name": "Subtitling",
        "desc": "Subtitles burned in to the screen image",
        "subtypes": {}
    },
    "K": {
        "key": "K",
        "name": "Ticker; No chyron",
        "desc": "Text appearing in a ticker or crawler, but without a traditional chyron above it",
        "subtypes": {}
    },
    "G": {
        "key": "G",
        "name": "Graphical text",
        "desc": "A frame including text arranged or interspersed with graphics",
        "subtypes": {}
    },
    "T": {
        "key": "T",
        "name": "Text, miscellaneous",
        "desc": "An ordinary frame of a video that includes miscellaneous text",
        "subtypes": {}
    },
    "F": {
        "key": "F",
        "name": "Filmed text",
        "desc": "Camera footage of prominent, readable text",
        "subtypes": {}
    },
    "C": {
        "key": "C",
        "name": "Closing credits",
        "desc": "A frame from the closing credits sequence",
        "subtypes": {}
    },
    "R": {
        "key": "R",
        "name": "Copyright statement",
        "desc": "A frame displaying the rights holder and the year, along the word 'copyright' or copyright symbol",
        "subtypes": {}
    }

};

// The `modeName` and `modeDes` define the meaning of the label modifier that 
// can be triggered by holding the shift key with top-level type labels.
let modName = "transitional" ;
let modDesc = "The frame occurs during an interval of transition between frame types." ;

// The `an3Guidance` and `an4Guidance` are strings of HTML that will be displayed
// when in the relevant annotation modes.
// (To provide complex, formatted HTML, it may be useful to write additional JavaScript
// code to build up the strings.)
let an3Guidance = "";
let an4Guidance = "";

