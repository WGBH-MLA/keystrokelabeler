console.log("ksl logic running...");

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
    console.log("key pressed: " + event.key)

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
        
        default:
            console.log("no actions set for that key")
    }

}

function updateItemDisplay() {
    document.getElementById("item-image").src = stillsDir + imgArray[cur][0];
    document.getElementById("filename").innerText = imgArray[cur][0];
    document.getElementById("seen").innerText = imgArray[cur][1]? "SEEN" : "UNSEEN" ;
}

function updateStatusDisplay() {
    document.getElementById("img-num").innerText = cur + 1;
    document.getElementById("jump-factor").innerText = jumpFactors[jfi];
}

function nav(dir) {
    if (dir === "R" && cur < last) {
        console.log("navigating right");
        cur++;
    } else if (dir === "L" && cur > 0 ) {
        console.log("navigating left");
        cur--;
    } else {
        console.error("Error: tried to navigate out of range.");
    }

    updateItemDisplay();
    updateStatusDisplay();
}

function changeJump(dir) {
    if (dir == "up") {
        console.log("trying to increase jump multiple");
        if (jfi < (jumpFactors.length - 1)) jfi++;
    } else if (dir == "down") {
        console.log("trying to decrease jump multiple");
        if (jfi > 0) jfi--;
    }
    updateStatusDisplay()
}



// Attach the event listener to the whole document
document.addEventListener('keydown', handleKeydown);

// filename = imgArray[2][0];

// console.log("Filename: " + filename);


