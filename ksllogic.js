/**
 * ksllogic.js
 * 
 * This file contains Javascript commands and function for implementing display
 * logic and user interaction for the KeyStroke Labeler tool.
 * 
 * It is intended to be referenced at the bottom of `labeler.html`.
 * 
 */


/***************************************************************************
 * Initialization steps
 * *************************************************************************/
console.log("ksl logic now running...");

// Initialize global variables

ksModeCmdKeys = {
    "Escape": {},
    "ArrowRight": {},
    "ArrowLeft": {},
    "ArrowUp": {},
    "ArrowDown": {},
    " ":  {},   // spacebar
    "Delete": {},
    "Backspace": {},
    "1": {},
    "2": {}
};

edModeCmdKeys = {
    "Escape": {},
    " ":  {},   // spacebar
    "Delete": {},
    "1": {},
    "2": {}
};


// total number of images in the set
count = imgArray.length;
// index of the current image in the array
cur = 0
// index of the last image in the array
last = count - 1
// set the index for the inital jump factor
jfi = 0
// mode
mode = "ks"

// Attach the key press event listener to the HTML document
document.addEventListener("keydown", handleKeydown);

// Attach functions to buttons
document.getElementById("export-JSON").addEventListener("click", exportJSON);
document.getElementById("export-CSV").addEventListener("click", exportCSV);
document.getElementById("export-array").addEventListener("click", exportArray);

// Initialize display elements after showing welcome for 1 second
document.getElementById("img-cnt").innerText = count;
setTimeout(updateStatusDisplay, 1000);  
setTimeout(updateItemDisplay, 1000);  


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
        if (event.key in edModeCmdKeys) {
            switch (event.key) {
                case "Escape":
                    changeMode("ks");
                    break;
                case " ":  // spacebar
                    break;
                case "Delete":
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
        else if ( event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
            edLabelItem(event.key);
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

    // can't change to edit mode 2 if item type is not yet set
    if (newMode === "ed2" && !(imgArray[cur][2] in cats)) {
        console.log("Cannot enter edit mode 2 without a value for edit mode 1.");
        newMode = "ed1";
    }

    mode = newMode;

    updateStatusDisplay();
    updateItemDisplay();
}


/***************************************************************************
 * Keystroke mode function definitions
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

    // turn off command indicator
    cmdIndicator("off")

    updateItemDisplay();
    updateStatusDisplay();
}

function see() {
    imgArray[cur][1] = true;
    imgArray[cur][2] = imgArray[cur][3] = imgArray[cur][5] = "";
    imgArray[cur][4] = false;

    // go ahead an display new values for the current item
    updateItemDisplay();

    // light up command indicator
    //cmdIndicator("on", "&#x1F440;")
    cmdIndicator("on", "&#x1F441;")

    // after a delay, move to the next image.
    setTimeout(nav, feedbackPause, "R");
}

function forgetStay() {
    imgArray[cur][1] = imgArray[cur][4] = false;
    imgArray[cur][2] = imgArray[cur][3] = imgArray[cur][5] = "";

    // go ahead an display new values for the current item
    updateItemDisplay();

    // light up command indicator
    cmdIndicator("on", "&empty;")

    // after a delay, turn off the command indicator.
    setTimeout(cmdIndicator, feedbackPause, "off");
}

function moveBackForget() {
    
    nav("L");

    imgArray[cur][1] = imgArray[cur][4] = false;
    imgArray[cur][2] = imgArray[cur][3] = imgArray[cur][5] = "";

    // light up command indicator
    cmdIndicator("on", "&empty; &#x23F4;");

    // go ahead an display new values for the current item
    updateItemDisplay();

    // after a delay, turn off the command indicator.
    setTimeout(cmdIndicator,  feedbackPause, "off");
}

function ksLabelItem(key) {
    if (key.toUpperCase() in cats) {

        imgArray[cur][1] = true;
        imgArray[cur][2] = key.toUpperCase();
        imgArray[cur][3] = imgArray[cur][5] = "";

        // set the modifier, if appropriate
        if ( key === key.toUpperCase() )
            imgArray[cur][4] = true;
        else 
            imgArray[cur][4] = false;

        // go ahead an display new values for the current item
        updateItemDisplay();

        // light up command indicator
        var modNameStr = "";
        if (imgArray[cur][4]) {
            modNameStr = " (" + modName + ")";
        }
        var msg = cats[key.toUpperCase()]["name"] + modNameStr ;
        cmdIndicator("on", msg)

        // after a delay, move to the next image.
        setTimeout(nav, feedbackPause, "R");
    }
    else {
        console.error("Error: Invalid label passed to `kslLabelItem`.");
    }
}

function cmdIndicator(status, msg = " ") {
    if (status === "off") {
        document.getElementById("indicator-msg").innerHTML = " ";
    } else if (status === "on" ) {
        document.getElementById("indicator-msg").innerHTML = msg;
    } else {
        console.error("Bad `status` argument passed to cmdIndicator.")
    }
}


/***************************************************************************
 * Edit mode function definitions
 * *************************************************************************/

function edLabelItem(key) {
    if (key.toUpperCase() in cats) {

        imgArray[cur][1] = true;
        imgArray[cur][2] = key.toUpperCase();
        imgArray[cur][3] = imgArray[cur][5] = "";

        // set the modifier, if appropriate
        if ( key === key.toUpperCase() )
            imgArray[cur][4] = true;
        else 
            imgArray[cur][4] = false;

        // go ahead an display new values for the current item
        updateItemDisplay();

        // light up command indicator
        var modNameStr = "";
        if (imgArray[cur][4]) {
            modNameStr = " (" + modName + ")";
        }
        var msg = cats[key.toUpperCase()]["name"] + modNameStr ;
        cmdIndicator("on", msg)

        // after a delay, move to the next image.
        setTimeout(nav, feedbackPause, "R");
    }
    else {
        console.error("Error: Invalid label passed to `kslLabelItem`.");
    }
}


/***************************************************************************
 * Display function definitions
 * *************************************************************************/

function updateStatusDisplay() {
    document.getElementById("img-num").innerText = cur + 1;
    document.getElementById("jump-factor").innerText = jumpFactors[jfi];

    if (mode === "ks") {
        document.getElementById("input-mode").innerText = "Keystroke mode";
    } else if (mode.startsWith("ed")) {
        document.getElementById("input-mode").innerText = "Editor mode";
    } else {
        console.error("Invalid input mode.")
    }
}

function updateItemDisplay() {
    document.getElementById("item-image").src = imgDir + imgArray[cur][0];

    // set text of the status bar
    document.getElementById("filename").innerText = imgArray[cur][0];
    document.getElementById("seen").innerText = imgArray[cur][1]? "SEEN" : "UNSEEN" ;

    // add visual emphasis to seen elements
    if (imgArray[cur][1]) {
        document.getElementById("filename").classList.remove("unseen");
        document.getElementById("seen").classList.remove("unseen");
        document.getElementById("filename").classList.add("seen");
        document.getElementById("seen").classList.add("seen");
    } else {
        document.getElementById("filename").classList.remove("seen");
        document.getElementById("seen").classList.remove("seen");
        document.getElementById("filename").classList.add("unseen");
        document.getElementById("seen").classList.add("unseen");
    }

    // Display type-level labels
    if (imgArray[cur][2].length === 1) {
        document.getElementById("item-type-key").innerText = cats[imgArray[cur][2]]["key"];
        document.getElementById("item-type-name").innerText = cats[imgArray[cur][2]]["name"];
    } else {
        document.getElementById("item-type-key").innerText = "-";
        document.getElementById("item-type-name").innerText = "-";
    }
    // Display subtype-level labels
    if (imgArray[cur][3].length === 1) {
        document.getElementById("item-subtype-key").innerText =
            cats[imgArray[cur][2]]["subtypes"][imgArray[cur][3]]["key"];
        document.getElementById("item-subtype-name").innerText = 
            cats[imgArray[cur][2]]["subtypes"][imgArray[cur][3]]["name"];
    } else {
        document.getElementById("item-subtype-key").innerText = "-";
        document.getElementById("item-subtype-name").innerText = "-";
    }
    // Display modifer
    if (imgArray[cur][4]) {
        document.getElementById("item-mod-code").innerText = "*";
        document.getElementById("item-mod-name").innerText = "(" + modName + ")";
    } else {
        document.getElementById("item-mod-code").innerText = "";
        document.getElementById("item-mod-name").innerText = "";
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

    // Construct a filename based on the image directory name
    var pathArray = imgDir.split("/");
    var baseFilename = pathArray.pop();
    // handle case where the path itself ends with a slash
    if (baseFilename === "")
        baseFilename = pathArray.pop();

    const filename = baseFilename + "_labels.json";
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

    // Construct a filename based on the image directory name
    var pathArray = imgDir.split("/");
    var baseFilename = pathArray.pop();
    // handle case where the path itself ends with a slash
    if (baseFilename === "")
        baseFilename = pathArray.pop();

    const filename = baseFilename + "_labels.csv";
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


