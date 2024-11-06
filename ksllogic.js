/**
 * ksllogic.js
 * 
 * This file contains Javascript commands and function for implementing display
 * logic and user interaction for the Keystroke Labeler tool.
 * 
 * It is intended to be referenced at the bottom of `labeler.html`.
 * 
 */

console.log("ksl logic now running...");


/***************************************************************************
 * Set lots of global variables
 * *************************************************************************/

// Define global data structures
ksModeCmdKeys = {
    "Enter": {
        "disp": "Enter",
        "desc": "Mark seen (as is) and jump to next",
        "help": ""
    },
    "ArrowRight": {
        "disp": "Right arrow",
        "desc": "Jump to next",
        "help": ""
    },
    "ArrowLeft": {
        "disp": "Left arrow",
        "desc": "Jump to previous",
        "help": ""
    },
    "ArrowUp": {
        "disp": "Up arrow",
        "desc": "Increase jump factor",
        "help": ""        
    },
    "ArrowDown": {
        "disp": "Down arrow",
        "desc": "Decrease jump factor",
        "help": ""        
    },
    " ":  {
        "disp": "Spacebar",
        "desc": "Mark seen with no label",
        "help": ""        
    },
    "Delete": {
        "disp": "Delete",
        "desc": "Unsee current item",
        "help": ""
    },
    "Backspace": {
        "disp": "Backspace",
        "desc": "Unsee previous item",
        "help": ""        
    },
    "Escape": {
        "disp": "Esc",
        "desc": "Go to Editor mode",
        "help": ""
    },
    "1": {
        "disp": "Number 1",
        "desc": "Go to Editor mode - Type",
        "help": ""        
    },
    "2": {
        "disp": "Number 2",
        "desc": "Go to Editor mode - Subtype", 
        "help": ""        
    }
};
ksModeCmdKeysOrder = [ 
    "ArrowRight", 
    "ArrowLeft", 
    "ArrowUp", 
    "ArrowDown", 
    "Enter", 
    " ", 
    "Delete", 
    "Backspace", 
    "Escape", 
    "1", 
    "2"  ];

edModeCmdKeys = {
    "Escape": {
        "disp": "Esc",
        "desc": "Return to Keystroke mode",
        "help": ""
    },
    " ":  {
        "disp": "Spacebar",
        "desc": "Mark seen, with no label",
        "help": ""             
    },
    "Delete": {
        "disp": "Delete",
        "desc": "Unsee current item",
        "help": ""
    },
    "ArrowRight": {
        "disp": "Right arrow",
        "desc": "Jump to next",
        "help": ""
    },
    "ArrowLeft": {
        "disp": "Left arrow",
        "desc": "Jump to previous",
        "help": ""
    },
    "ArrowUp": {
        "disp": "Up arrow",
        "desc": "Edit higher label",
        "help": ""        
    },
    "ArrowDown": {
        "disp": "Down arrow",
        "desc": "Edit lower label",
        "help": ""        
    },
    "1": {
        "disp": "Number 1",
        "desc": "Edit Type",
        "help": ""        
    },
    "2": {
        "disp": "Number 1",
        "desc": "Edit Subtype",
        "help": ""        
    }
};
edModeCmdKeysOrder = [ 
    "ArrowRight", 
    "ArrowLeft", 
    "ArrowUp", 
    "ArrowDown",
    " ", 
    "Delete", 
    "Escape", 
    "1", 
    "2"  ];

    
// total number of images in the set
count = imgArray.length;
// index of the current image in the array
cur = 0;
// index of the last image in the array
last = count - 1;

// update unseen counts
unseenCount = count;
updateUnseen();

// set the index for the inital jump factor
jfi = 0;
// mode
mode = "ks";

// create global help object
help = {};
// build the help information to display
buildHelp();
// render help
renderHelp();


/***************************************************************************
 * Attach listener fucntions
 * *************************************************************************/

// Attach the key press event listener to the HTML document
document.addEventListener("keydown", handleKeydown);

// Attach functions to jump buttons
document.getElementById("jump-first").addEventListener("click", function(){jump(0);});
document.getElementById("jump-first-unseen").addEventListener("click", function(){jump(nextUnseen());});
document.getElementById("jump-last-seen").addEventListener("click", function(){jump(lastSeen());});
document.getElementById("jump-last").addEventListener("click", function(){jump(last);});


// Attach functions to export buttons
document.getElementById("export-JSON").addEventListener("click", exportJSON);
document.getElementById("export-CSV").addEventListener("click", exportCSV);
document.getElementById("export-array").addEventListener("click", exportArray);


/***************************************************************************
 * Set display elements
 * *************************************************************************/
// Initialize display after showing welcome for 1 second
document.getElementById("img-cnt").innerText = count;
setTimeout(updateStatusDisplay, 1000);  
setTimeout(updateItemDisplay, 1000);  


/**
 * Create HTML for the help area, based on definitions in objects
 */
function buildHelp() {

    var ksHelp = "";
    var edHelp = "";
    var typeKeyHelp = "";
    var subKeyHelp = {};
    var line = "";

    // build keystroke mode command help
    for (var key of ksModeCmdKeysOrder) {
        line = "<div class='help-key'>" +
               ksModeCmdKeys[key]["disp"] + " : " + "</div>" +
               "<div class='help-desc'>" +
               ksModeCmdKeys[key]["desc"] + "</div>";
        ksHelp += line;
    }

    // build editor mode command help 
    for (var key of edModeCmdKeysOrder) {
        line = "<div class='help-key'>" +
               edModeCmdKeys[key]["disp"] + " : " + "</div>" +
               "<div class='help-desc'>" +
               edModeCmdKeys[key]["desc"] + "</div>";
        edHelp += line;
    }

    // build type key help
    for (var key in cats) {
        line = "<div class='help-key'>" +
               cats[key]["key"] + " : " + "</div>" +
               "<div class='help-desc'>" +
               cats[key]["name"] + "</div>";
        typeKeyHelp += line;
    }
    if (! modName == "") {
        var modHelp = "";
        modHelp += '<div class="help-msg">To indicate the label is "';
        modHelp += modName; 
        modHelp += '", hold Shift when pressing the label key.';
        typeKeyHelp += modHelp;
    }

    // build subtype key help
    for (var key in cats) {
        subKeyHelp[key] = "";
        stcats = cats[key]["subtypes"];
        for (var stkey in stcats) {
            line = "<div class='help-key'>" +
                   stcats[stkey]["key"] + " : " + "</div>" +
                   "<div class='help-desc'>" +
                   stcats[stkey]["name"] + "</div>";
            subKeyHelp[key] += line;
        }
    }

    // Set properties of the global help object
    help["ksCmds"] = ksHelp;
    help["edCmds"] = edHelp;
    help["typeKeys"] = typeKeyHelp;
    help["subTypeKeys"] = subKeyHelp;
}



/***************************************************************************
 * Branching and execution flow function definitions
 * *************************************************************************/

/**
 * Controls branching execution folow depending on user keypress.
 * 
 */
function handleKeydown(event) {

    console.log("key pressed: " + event.key);

    // prevent browser from doing something else with command keys
    if (event.key in ksModeCmdKeys || event.key in edModeCmdKeys) 
        event.preventDefault();

    // Execution branching

    // KS mode braching
    if (mode === "ks") {
        if (event.key in ksModeCmdKeys) {
            switch (event.key) {
                case "Escape":
                    changeMode("ed1");
                    break;
                case "Enter":
                    //nav("R");
                    acceptAndMove();
                    break;
                case "ArrowUp":
                    changeJump("up");
                    break;
                case "ArrowDown":
                    changeJump("down");
                    break;
                case "ArrowRight":
                    nav("R");
                    break;
                case "ArrowLeft":
                    nav("L");
                    break;
                case " " :  // spacebar
                    see();
                    break;
                case "Delete":
                    forgetStay();
                    break;
                case "Backspace":
                    moveBackForget();
                    break;
                case "1":
                    changeMode("ed1");
                    break;
                case "2":
                    changeMode("ed2");
                    break;
                default:
                    console.error("Error: That special key is listed, but not implemented.");
            }
        } 
        else if (event.key.toUpperCase() in cats) {
            ksLabelItem(event.key);
        } 
        else {
            console.log("no actions set for that key in keystroke mode");
        }
    } 
    // Edit mode branching
    else if ( mode === "ed1" || mode === "ed2" ) {
        var level;
        if (mode === "ed1")
            level = 1;
        else if (mode === "ed2")
            level = 2;

        if (event.key in edModeCmdKeys) {
            switch (event.key) {
                case "Escape":
                    changeMode("ks");
                    break;
                case " ":  // spacebar
                    removeLabel(level, true);
                    break;
                case "Delete":
                    removeLabel(level, false);
                    break;
                case "ArrowRight":
                    nav("R");
                    break;
                case "ArrowLeft":
                    nav("L");
                    break;
                case "ArrowUp":
                    changeMode("ed1");
                    break;
                case "ArrowDown":
                    changeMode("ed2");
                    break;
                 case "1":
                    changeMode("ed1");
                    break;
                case "2":
                    changeMode("ed2");
                    break;
                default:
                    console.error("Error: That special key is listed, but not implemented.");
            }
        }
        else if ( event.key.length === 1  &&  /[a-zA-Z]/.test(event.key) ) {
            edLabelItem(event.key, level);
        }
        else {
            console.log("no actions set for that key in edit mode");
        }
    }
    else {
        console.error("Error: Invalid `mode`.");
    }

}


function changeMode(newMode) {

    // do not allow change to edit mode 2 if item type is not yet set
    // if specified mode is "ed2" and that's not valid, change to "ed1".
    if (newMode === "ed2" && !(imgArray[cur][2] in cats)) {
        console.warn("Warning: Tried to  edit mode 2 without a value for edit mode 1.");
        newMode = "ed1";
    }

    mode = newMode;

    updateStatusDisplay();
    updateItemDisplay();
    renderHelp();
}


/***************************************************************************
 * Top-level Keystroke mode and Editor mode function definitions
 * *************************************************************************/

/**
 * Changes the jump factor index up or down, within the list of allowed values
 * 
 * @param {string} dir - The direction of change; must be either "up" or "down".
 */
function changeJump(dir) {
    if (dir == "up") {
        console.log("trying to increase jump factor");
        if (jfi < (jumpFactors.length - 1)) jfi++;
    } else if (dir == "down") {
        console.log("trying to decrease jump factor");
        if (jfi > 0) jfi--;
    }
    updateStatusDisplay()
}

function jump(index) {
    if (index >= 0 && index <= last) {
        cur = index;
    }
    else {
        console.error("Error: tried to jump out of range");
    }

    // turn off command indicator (just in case it is on)
    cmdIndicator("off")

    updateItemDisplay();
    updateStatusDisplay();
    renderHelp();
}


/**
 * Performs basic navigation through the image array.
 * 
 * @param {string} dir - The direction of navigation; must be either "L" or "R".
 */
function nav(dir) {

    // navigate by adjusting current image according to navigation factor
    if (dir === "R" && ((cur + jumpFactors[jfi]) <= last)) {
        console.log("navigating right");
        cur += jumpFactors[jfi];
    } else if (dir === "L" && ((cur - jumpFactors[jfi]) >= 0)) {
        console.log("navigating left");
        cur -= jumpFactors[jfi];
    } else {
        console.warn("Warning: tried to navigate out of range.");
    }

    // Keep previous mode as current mode (if current mode is valid for current item)
    changeMode(mode);

    // turn off command indicator
    cmdIndicator("off")

    updateItemDisplay();
    updateStatusDisplay();
    renderHelp();
}

// This function marks an item as seen, but removes any label
function see() {
    imgArray[cur][1] = true;
    imgArray[cur][2] = imgArray[cur][3] = "";
    imgArray[cur][4] = false;

    // go ahead an display new values for the current item
    updateItemDisplay();

    // Update status
    updateUnseen();
    updateStatusDisplay();

    // light up command indicator
    cmdIndicator("on", "&#x1F441;")

    // after a delay, move to the next image.
    setTimeout(nav, feedbackPause, "R");
}

function forgetStay() {
    imgArray[cur][1] = imgArray[cur][4] = false;
    imgArray[cur][2] = imgArray[cur][3] = "";

    // go ahead an display new values for the current item
    updateItemDisplay();

    // Update status
    updateUnseen();
    updateStatusDisplay();

    // light up command indicator
    cmdIndicator("on", "&empty;")

    // after a delay, turn off the command indicator.
    setTimeout(cmdIndicator, feedbackPause, "off");
}

function moveBackForget() {
    nav("L");

    imgArray[cur][1] = imgArray[cur][4] = false;
    imgArray[cur][2] = imgArray[cur][3] = "";

    // light up command indicator
    cmdIndicator("on", "&empty; &#x23F4;");

    // go ahead an display new values for the current item
    updateItemDisplay();

    // Update status
    updateUnseen();
    updateStatusDisplay();

    // after a delay, turn off the command indicator.
    setTimeout(cmdIndicator,  feedbackPause, "off");
}

function cmdIndicator(shown, msg=" ") {
    if (shown === "off") {
        document.getElementById("indicator-msg").innerHTML = " ";
    } else if (shown === "on" ) {
        document.getElementById("indicator-msg").innerHTML = msg;
    } else {
        console.error("Bad `shown` argument passed to cmdIndicator.")
    }
}


function acceptAndMove() {

    // accept labeling, i.e., mark item as seen
    imgArray[cur][1] = true

    // if invalid type label (which wouldn't be displayed anyway), then set 
    // the label to an empty string.
    // (This handles the case where the ksl index was pre-populated with
    // pseudo labels like "NEG".)
    if (imgArray[cur][2].length !== 1) {
        imgArray[cur][2] = ""
    }

    // update display to reflect seen status
    updateItemDisplay()

    // Update status
    updateUnseen();
    updateStatusDisplay();
    
    // going to light up command indicator for a moment
    var msg;
  
    // if no type label, then message just indicates seen
    if (imgArray[cur][2] === "" ) {
        msg = "&#x1F441;" ;
    }
    // if there is a type label, build the appropriate message
    else {
        var modNameStr = "";
        if (imgArray[cur][4]) {
            modNameStr = " (" + modName + ")";
        }
        msg = cats[imgArray[cur][2]]["name"] + modNameStr ;

        if (imgArray[cur][3] in cats[imgArray[cur][2]]["subtypes"]) {
            msg += ( " / " + cats[imgArray[cur][2]]["subtypes"][imgArray[cur][3]]["name"] );
        }
    }

    cmdIndicator("on", msg)

    changeMode("ks");
    setTimeout(nav, feedbackPause, "R");
}


function removeLabel(level, seen) {

    if (level === 1) {
        imgArray[cur][1] = seen;
        imgArray[cur][2] = imgArray[cur][3] = "";
        imgArray[cur][4] = false;  
    } 
    else if (level === 2) {
        imgArray[cur][3] = "";
    }
    else 
        console.error("Error: Invalid label level for removal.");

    // Display updated values for the current item
    updateItemDisplay();

    // Update status
    updateUnseen();
    updateStatusDisplay();
}


/***************************************************************************
 * Labeling functions
 * *************************************************************************/

function ksLabelItem(key) {

    var success = labelItem(key, 1);

    if (success) {

        // Display updated values for the current item
        updateItemDisplay();

        // Update status
        updateUnseen();
        updateStatusDisplay();
  
        // light up command indicator for a moment
        var modNameStr = "";
        if (imgArray[cur][4]) {
            modNameStr = " (" + modName + ")";
        }
        var msg = cats[key.toUpperCase()]["name"] + modNameStr ;
        cmdIndicator("on", msg)

        setTimeout(nav, feedbackPause, "R");
    }
    
}

function edLabelItem(key, level) {

    var success = labelItem(key, level);

    if (success) {
        // Display updated values for the current item
        updateItemDisplay();

        // Update status
        updateUnseen();
        updateStatusDisplay();
    }
}

/**
 * Applies a label to the current item.
 * 
 * Includes checking for the validity of the label.
 * 
 * Does not update display or affect navigation.
 * 
 * @param {string} key - The key from `cats` to apply 
 * @param {int} level - The key from `cats` to apply 
 */
function labelItem(keyStroke, level) {

    // `key` is the key in `cats` which is always capitalized.
    // `keyStroke` is capitalized only if the frame has a modifier.
    var key = keyStroke.toUpperCase();
    
    var retVal = true;

    if ( level === 1 ) {

        // First check that the type specified is valid
        if (!(key in cats)) {
            console.error("Error: Invalid label passed to `labelItem`.");
            retVal = false;
        }
        else {
            // Check to see if type label and modifier already set to this value.  
            // If so, do nothing except marking seen
            if ( key === imgArray[cur][2] &&
                (  ( keyStroke === key && imgArray[cur][4] === true ) ||
                    ( keyStroke != key && imgArray[cur][4] === false) ) ) {
                console.log("Entered label is current label.  Not changing labels.  Marking seen");
                imgArray[cur][1] = true;
            }
            // If label and/or modifier need to be changed, then change them
            else {
                // set labels    
                imgArray[cur][1] = true;
                imgArray[cur][2] = key;
                imgArray[cur][3] = "";

                // set the modifier, if appropriate
                if ( key === keyStroke )
                    imgArray[cur][4] = true;
                else 
                    imgArray[cur][4] = false;
           
            }
        } 
    } 
    else if ( level === 2 ) {

        // First check to make sure we have a Type label at Level 1
        if (!(imgArray[cur][2] in cats)) {
            console.warn("Warning: Trying to change subtype label without type label set.")
            retVal = false;
        }
        // Then check that subtype specified is valid for the type 
        else if ( !(key in cats[imgArray[cur][2]]["subtypes"] ) ) {
            console.warn("Warning: '" + key + "' is not a valid subtype for type '" + imgArray[cur][2] + "'.");
            retVal = false;
        }
        // Set the subtype code
        else {
            imgArray[cur][1] = true;
            imgArray[cur][3] = key;
        }

    } 
    else {
        console.error("Error:  Labeling beyond level 2 not implemented.");
        retVal = false;
    }

    return retVal;

}


/**
 * Finds spans of unseen images between identically labeled images.
 * Replicates the labels for those bookend images for all the unlabeled images.
 * 
 */
function backfillLabels() {

    console.log("Attempting to backfill unseen gaps...");
    // Strategy: 
    // Find a suitable left bookend
    // Search for the right bookend.
    // If the right bookend is a match, then backfill.
    // If the right bookend is not a match, then search for a new left bookend.
    var left = 0; 
    var right;

    while ( left < last ) {

        // Find the next left bookend (a seen image that has an unseen just after it)
        while ( left < last ) {
            if ( imgArray[left][1]  && !imgArray[left+1][1] ) {
                break;
            }
            else {
                left++;
            }
        }
        // We have a left bookend.

        // Now traverse the gap and see whether we find a matching right bookend
        right = left + 1;
        
        while ( right <= last ) {

            // Check if it's a right bookened.
            if ( imgArray[right][1] ) {

                // Check if it's a matching bookend
                if (imgArray[left][2] === imgArray[right][2] &&
                    imgArray[left][3] === imgArray[right][3] &&
                    imgArray[left][4] === imgArray[right][4] &&
                    imgArray[left][5] === imgArray[right][5] &&
                    imgArray[left][6] === imgArray[right][6] ) {
                    
                    // It's a matching bookend; fill in the gap of unseen images
                    console.log("Matching bookends found;  filling between " + left + " and " + right);
                    var i;
                    var j;
                    for ( i=left+1; i<right; i++ ) {
                        for ( j=1; j<imgArray[i].length; j++) {
                            imgArray[i][j] = imgArray[left][j];
                        }
                    }
                }
                break;
            }
            else {
                right++;
            }
        }
        // We are at a right bookend; now reset search for left bookend
        left = right;

    } // end of main while loop

    updateUnseen();
    updateItemDisplay();
    updateStatusDisplay();
}




/***************************************************************************
 * Stats update functions
 * *************************************************************************/

/**
 * Iterates through the image array and sets global variables about unseen 
 * items.
 * 
 * This function may take a moment if the img array is large. Call only if 
 * there has been an operation that might change the number of seen items.
 */
function updateUnseen() {
    var unseenItem = imgArray.length - 1;
    var count = 0;
    var i;

    for (i=0; i<imgArray.length; i++) {
        // check whether item is unseen
        if ( !imgArray[i][1] ) {
            count++;
            if ( (i > cur) && (i < unseenItem) )
                unseenItem = i;
        }
    }
    // set global variable
    unseenCount = count;
}

/**
 * Returns the next unseen item after the current one, or the last item, 
 * if no unseen items are found. * 
 */
function nextUnseen() {
    var unseenItem = imgArray.length - 1;
    var i;

    for (i=cur+1; i<imgArray.length; i++) {

        // check whether item is unseen
        if ( !imgArray[i][1] && i < unseenItem ) {
                unseenItem = i;
                break;
        }
    }

    return unseenItem;
}

/**
 * Returns the last seen item in the list, i.e., the seen item with highest index.
 * If no items have been seen, returns the first item
 */
function lastSeen() {
    var lastSeen = 0;
    var i;

    for (i=last; i>0; i--) {
        // check whether item is seen
        if ( imgArray[i][1] ) {
                lastSeen = i;
                break;
        }
    }
    return lastSeen;
}


/***************************************************************************
 * Display functions
 * *************************************************************************/

/**
 * Displays the appropriate help HTML string according to the current mode.
 * 
 * (The HTML strings were already built when the page was first loaded.) 
 */
function renderHelp() {

    // render command key help
    if (mode === "ks") {
        document.getElementById("help-cmd-keys").innerHTML = help["ksCmds"];
    }
    else if (mode === "ed1" || mode === "ed2" ) {
        document.getElementById("help-cmd-keys").innerHTML = help["edCmds"];
    }
    else {
        console.error("Error: Invalid mode");
    }

    // render labeling key help
    if (mode === "ks" || mode === "ed1") {
        document.getElementById("help-label-keys").innerHTML = help["typeKeys"];
    }
    else if (mode === "ed2") {
        tKey = imgArray[cur][2]; 
        if (tKey in cats) {    
            document.getElementById("help-label-keys").innerHTML = help["subTypeKeys"][tKey];
        }
        else {
            document.getElementById("help-label-keys").innerHTML = "";
        }
    }
}

function updateStatusDisplay() {
    if (mode === "ks") {
        document.getElementById("input-mode").innerText = "Keystroke mode";
        document.getElementById("input-mode").classList.remove("editor-mode");
    } else if (mode.startsWith("ed")) {
        document.getElementById("input-mode").innerText = "Editor mode";
        document.getElementById("input-mode").classList.add("editor-mode");        
    } else {
        console.error("Invalid input mode.")
    }

    document.getElementById("img-num").innerText = cur + 1;
    document.getElementById("unseen-cnt").innerText = unseenCount;
    document.getElementById("jump-factor").innerText = jumpFactors[jfi];
    if (jumpFactors[jfi] == 1) {
        document.getElementById("jump-factor-status").classList.remove("high-jump");
    } else {
        document.getElementById("jump-factor-status").classList.add("high-jump");
    }
}

function updateItemDisplay() {
    document.getElementById("item-image").src = imgDir + imgArray[cur][0];

    // set text of the status bar
    document.getElementById("filename").innerText = imgArray[cur][0];
    document.getElementById("seen").innerText = imgArray[cur][1]? "SEEN" : "UNSEEN" ;

    // add visual emphasis to status of seen elements
    if (imgArray[cur][1]) {
        document.getElementById("filename").classList.remove("status-unseen");
        document.getElementById("seen").classList.remove("status-unseen");
        document.getElementById("filename").classList.add("status-seen");
        document.getElementById("seen").classList.add("status-seen");

        document.getElementById("item-type-label").classList.add("seen");        
        document.getElementById("item-subtype-label").classList.add("seen");        
    } else {
        document.getElementById("filename").classList.remove("status-seen");
        document.getElementById("seen").classList.remove("status-seen");
        document.getElementById("filename").classList.add("status-unseen");
        document.getElementById("seen").classList.add("status-unseen");

        document.getElementById("item-type-label").classList.remove("seen");
        document.getElementById("item-subtype-label").classList.remove("seen");
    }

    // Display type-level labels
    if (imgArray[cur][2].length === 1) {
        document.getElementById("item-type-label").classList.add("labeled");
        document.getElementById("item-type-key").innerText = cats[imgArray[cur][2]]["key"];
        document.getElementById("item-type-name").innerText = cats[imgArray[cur][2]]["name"];
    } else {
        document.getElementById("item-type-label").classList.remove("labeled");
        document.getElementById("item-type-key").innerText = "-";
        document.getElementById("item-type-name").innerText = "-";
    }
    // Display subtype-level labels
    if (imgArray[cur][3].length === 1) {
        document.getElementById("item-subtype-key").innerText =
            cats[imgArray[cur][2]]["subtypes"][imgArray[cur][3]]["key"];
        document.getElementById("item-subtype-name").innerText = 
            cats[imgArray[cur][2]]["subtypes"][imgArray[cur][3]]["name"];
        document.getElementById("item-subtype-label").classList.add("labeled");
    } else {
        document.getElementById("item-subtype-key").innerText = "-";
        document.getElementById("item-subtype-name").innerText = "-";
        document.getElementById("item-subtype-label").classList.remove("labeled");
    }
    // Display modifer
    if (imgArray[cur][4]) {
        document.getElementById("item-mod-code").innerText = "*";
        document.getElementById("item-mod-name").innerText = "(" + modName + ")";
    } else {
        document.getElementById("item-mod-code").innerText = "";
        document.getElementById("item-mod-name").innerText = "";
    }
    // Display transcript
    if (imgArray[cur][5]) {
        document.getElementById("item-transcript-text").innerText = imgArray[cur][5];
    } else {
        document.getElementById("item-transcript-text").innerText = "";
    }
    // Display item note
    if (imgArray[cur][6]) {
        document.getElementById("item-note-text").innerText = imgArray[cur][6];
    } else {
        document.getElementById("item-note-text").innerText = "";
    }

    // Focus areas relevant areas, if in editor mode
    if (mode === "ks") {1
        document.getElementById("item-type-label").classList.remove("area_focus");
        document.getElementById("item-subtype-label").classList.remove("area_focus");
    } else if (mode === "ed1") {
        document.getElementById("item-type-label").classList.add("area_focus");
        document.getElementById("item-subtype-label").classList.remove("area_focus");
    } else if (mode === "ed2") {
        document.getElementById("item-type-label").classList.remove("area_focus");
        document.getElementById("item-subtype-label").classList.add("area_focus");
    }

}

/***************************************************************************
 * Export function definitions
 * *************************************************************************/

function exportJSON() {

    // convert image array to a JSON string
    var imgArrayJSON = JSON.stringify(imgArray);

    // Prettify JSON string, to have one row per line
    imgArrayJSON = imgArrayJSON.replace(/\[\[/g, "[\n[");   
    imgArrayJSON = imgArrayJSON.replace(/\],\[/g, "],\n[");
    imgArrayJSON = imgArrayJSON.replace(/\]\]/g, "]\n]");

    // From the string, create a Blob for downloading
    const filedata = new Blob([imgArrayJSON], {type: "application/json" });

    // Create URL, on the fly, for the Blob object
    const url = window.URL.createObjectURL(filedata);

    const filename = "img_labels.json";
    console.log("filename for 'Export JSON': " + filename);

    // Anchor to new element and initiate download
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    // clean up by removing access to the object created.
    window.URL.revokeObjectURL(url);
}

function exportCSV() {
    // convert image array to a JSON string
    var imgArrayJSON = JSON.stringify(imgArray);

    // add line breaks
    var csvBody = imgArrayJSON.replace(/\],\[/g, "],\n[");
    
    // remove square brackets and commas between rows
    csvBody = csvBody.replace(/\[/g, "");   
    csvBody = csvBody.replace(/\],/g, "");
    csvBody = csvBody.replace(/\]/g, "");

    // construct CSV-formatted string
    var csvHeader = '"filename","seen","type label","subtype label","modifier","transcript","note"\n';
    var imgArrayCSV = csvHeader + csvBody;

    // From the string, create a Blob for downloading
    const filedata = new Blob([imgArrayCSV], {type: "text/csv" });

    // Create URL, on the fly, for the Blob object
    const url = window.URL.createObjectURL(filedata);

    const filename = "img_labels.csv";
    console.log("filename for 'Export CSV': " + filename);

    // Anchor to new element and initiate download
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    // clean up by removing access to the object created.
    window.URL.revokeObjectURL(url);
}

function exportArray() {

    // convert image array to a JSON string
    var imgArrayJSON = JSON.stringify(imgArray);

    // Prettify JSON string, to have one row per line
    imgArrayJSON = imgArrayJSON.replace(/\[\[/g, "[\n[");   
    imgArrayJSON = imgArrayJSON.replace(/\],\[/g, "],\n[");
    imgArrayJSON = imgArrayJSON.replace(/\]\]/g, "]\n]");

    // Add Javascript syntax
    var imgArrayJS = "imgArray = \n";
    imgArrayJS += imgArrayJSON;
    imgArrayJS += "\n;";

    // From the string, create a Blob for downloading
    const filedata = new Blob([imgArrayJS], {type: "text/javascript" });

    // Create URL, on the fly, for the Blob object
    const url = window.URL.createObjectURL(filedata);

    const filename = "img_arr_prog.js";

    console.log("filename for 'Export array': " + filename);

    // Anchor to new element and initiate download
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    // clean up by removing access to the object created.
    window.URL.revokeObjectURL(url);
}


