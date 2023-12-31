# Keystroke Labeler
A simple tool for manually categorizing images as quickly as humanly possible.

## Description
Keystroke Labeler is a simple client-side web application for quickly adding pre-defined labels to a set of images.

Also included in this repository are Python scripts for creating collections of labelable images from video files.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Installation

Just clone the repository, which creates a directory called `keystrokelabeler`.

If you wish to run the included Python scripts, change to that directory and do a `pip install -r requirements.txt`.

## Usage

### Starting and restarting

The labeler requires a collection of image files and an index.  Your collection of image files should be in a directory called `images` which is in the same directory as the HTML, JavaScript, and CSS files from this repository.  The index is in a file called `img_arr_init.js`, which can be created by the `getstills` module.

For details on file organization and data structures, consult `labeler_data_readme.md`.

You start the labeler simply by opening `labeler.html` in your web browser.

You exit the labeler simply by closing the browser window.  **Note:** *When the browser window closes, any labels you have created will be lost, unless you save your progress by exporting the array of labels.*

You can save your progress by using the "Export JS array" button and saving the file `img_arr_prog.js` in the same directory as `labeler.html` and the other JavaScript files.  The next time you load `labeler.html` from that directory, your previously entered labels will be registered by the labeler.

### Operation

**Keyboard interaction**:  Operation is primarily driven by the keyboard.  Some keys (typically alphabetical keys) signify labels.  Other keys are command keys.  The meanings of keys (relative to the current mode) are explained in the right sidebar.  

**Labels**:  Each item in a collection may be given one type label and one subtype label.  Not all types have associated subtypes.  Types and subtypes are defined in `conf.js`.  Available type labels and subtype labels are displayed in the right sidebar.  Labels are set by pressing the keyboard key that stands for that label.

**Modifier flag**:  For any item that has a type label set, it can also have a modifier flag set.  When the Keystroke Labeler is used for the classification of still frames from videos, the presence of the modifier means that the still is a "transitional" frame, in that the distinguishing features of the label's category are not fully present (typically because the feature is, at the instant, appearing or disappearing).  To set a type label with the modifier flag, hold `Shift` while pressing the key for that label.

**Seen items**:  Labeling an item marks it as "seen".  You can also "see" an item without labeling it.  If an item is marked as seen but has no label, that is an assertion that none of the categories defined in `conf.js` applies to the item.  You can think of seen items without labels as falling into an implicit category of "none of the explicitly defined categories".  

**Modes**:  The labeler has two main modes:  *keystroke mode* (the default) and *editor mode*.  You can switch between these modes using the `Esc` key.  There are two main differences between keystroke mode and editor mode.  First, keystroke mode automatically advances to the next item after an item is seen.  Second, keystroke mode does *not* allow application of subtype labels.  To edit an item's subtype, you must use editor mode.  

**Jump factor**:  The *jump factor* is the distance, in terms of the number of items, of navigation through the set of images.  For example, if the jump factor is 5 and the current item is number 31, then proceeding forward will jump to item 36.

**Buttons**:  Below the labeling area is a collection of clickable buttons which provide additional navigation features and options for saving and exporting your work.

## Contributing

Feel free to make a pull request.  However, if your issue or change is unrelated to work at GBH or the CLAMS project, then it may not be prioritized.  

Regarding any ideas for significant contributions or changes, please get in touch with Owen.


## Credits
Keystroke Labeler was written by Owen King to create training data for the [CLAMS project](https://clams.ai/), in support of the [American Archive of Public Broadcasting](https://americanarchive.org/). 


## License
See `LICENSE` for details.

