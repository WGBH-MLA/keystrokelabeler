console.log("ksl logic running...");

// Attach the event listener to the  HTML document
document.addEventListener('keydown', handleKeydown);

// Initialize global variables

// total number of images in the set
count = imgArray.length;

// index of the current image in the array
cur = 0

// index of the last image in the array
last = count - 1

// set the index for the inital jump factor
jfi = 0


// Initialize display elements
document.getElementById("img-cnt").innerText = count;
updateStatusDisplay();
updateItemDisplay();


function handleKeydown(event) {
    console.log("key pressed: " + event.key);

    specialKeys = {
        "ArrowRight": {
        },
        "ArrowLeft": {
        },
        "ArrowUp": {
        },
        "ArrowDown": {
        },
        " ":  {
        },  // spacebar
        "Delete": {
        },
        "Backspace": {
        }
    };

    if (event.key in specialKeys) {
        switch (event.key) {

            case "ArrowRight":
                nav("R");
                break;

            case "ArrowLeft":
                nav("L");
                break;

            case "ArrowUp":
                changeJump("up");
                break;

            case "ArrowDown":
                changeJump("down");
                break;

            case " " :  // spacebar
                see();
                break;
            
            case "Delete":
                forgetMoveOn();
                break;

            case "Backspace":
                forgetStay();
                break;

            default:
                console.error("That special key that is not implemented.");
        }
    } 
    else if (event.key.toUpperCase() in cats) {
        labelItem(event.key)
    } 
    else {
        console.log("no actions set for that key");
    }

}

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
    cmdIndicator("on", "Seen,  not labeled.")

    // after a delay, move to the next image.
    setTimeout(nav, feedbackPause, "R");
}

function forgetMoveOn() {
    imgArray[cur][1] = imgArray[cur][4] = false;
    imgArray[cur][2] = imgArray[cur][3] = imgArray[cur][5] = "";

    // go ahead an display new values for the current item
    updateItemDisplay();

    // light up command indicator
    cmdIndicator("on", "Unseen")

    // after a delay, move to the next image.
    setTimeout(nav, feedbackPause, "R");
}

function forgetStay() {
    imgArray[cur][1] = imgArray[cur][4] = false;
    imgArray[cur][2] = imgArray[cur][3] = imgArray[cur][5] = "";

    // go ahead an display new values for the current item
    updateItemDisplay();

    // light up command indicator
    cmdIndicator("on", "Unseen")
}

function labelItem( key ) {
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
        modNameStr = " (" + modCode + ")";
    }
    var msg = cats[key.toUpperCase()]["name"] + modNameStr ;
    cmdIndicator("on", msg)

    // after a delay, move to the next image.
    setTimeout(nav, feedbackPause, "R");
}


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

function cmdIndicator(status, msg = " ") {
    if (status === "off") {
        document.getElementById("indicator-msg").innerText = " ";
    } else if (status === "on" ) {
        document.getElementById("indicator-msg").innerText = msg;
    } else {
        console.error("Bad `status` argument passed to cmdIndicator.")
    }
}

function updateStatusDisplay() {
    document.getElementById("img-num").innerText = cur + 1;
    document.getElementById("jump-factor").innerText = jumpFactors[jfi];
}

function updateItemDisplay() {
    document.getElementById("item-image").src = stillsDir + imgArray[cur][0];

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
        document.getElementById("item-mod-code").innerText = "(" + modCode + ")";
        document.getElementById("item-mod-name").innerText = "(" + modName + ")";
    } else {
        document.getElementById("item-mod-code").innerText = "";
        document.getElementById("item-mod-name").innerText = "";
    }

}

function exportArray() {

}



