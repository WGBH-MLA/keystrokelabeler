# Keystroke Labeler
A simple tool for manually categorizing images as quickly as humanly possible.

## Description
Keystroke Labeler is a simple, browser-based application for quickly adding pre-defined labels to a set of images.  The application runs locally and does not require a web server.  The only dependency is a modern JavaScript-enabled browswer, like Firefox, Chrome, or Safari.

Primary design goals:
- Record human judgments at maximum speed via keyboard-only interaction and minimization of unnecessary keystrokes
- Support both simple and complex, multi-level annotation, without sacrificing speed for the simple case
- Allow arbitrary configuration of category and subcategory labels
- Ensure responsiveness by allowing fully local execution (with no network calls)

Also included in this repository are Python scripts for conveniently creating collections of labelable images from video files.  

This tool was created to support the development of scene recognition tools in the [CLAMS project](https://clams.ai/).  Scene recognition tools analyze video footage and assign labels to scenes (intervals of video playback) according to a set of established categories.  The [documentation for CLAMS scene recogntion annotations](https://github.com/clamsproject/aapb-annotations/tree/main/scene-recognition) describes how the Keystroke Labeler was used to perform manual (human) labeling of tens of thousands of images.

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

### Labeling project setup

The labeler requires a **collection of image files** and an **index**.  Your collection of image files should be in a directory called `images` which must be located in the same directory as the HTML, JavaScript, and CSS files from this repository.  The index must be in a file called `img_arr_init.js`, which can be created by the `getstills` Python module.

For details on file organization and data structures, consult [labeler_data_structure.md](docs/labeler_data_structure.md). 

You start the labeler simply by opening the `labeler.html` file in your web browser.

You exit the labeler simply by closing the browser window.  **Note:** *When the browser window closes, any labels you have created will be lost, unless you save your progress.*

You can save your progress by using the "Save progress" button and saving the file `img_arr_prog.js` in the same directory as `labeler.html` and `img_arr_init.js`.  The next time you load `labeler.html` from that directory, your previously entered labels will be loaded into the labeler.

### Labeler operation

![screenshot of the Keystroke Labeler interface](/docs/ksl_screenshot.png?raw=true)

**Keyboard interaction**:  Operation is primarily driven by the keyboard.  Some keys (typically alphabetical keys) signify labels.  Other keys are command keys.  The meanings of keys (relative to the current mode) are explained in the right sidebar.  

**Labels**:  Each item in a collection may be given one type label and one subtype label.  Not all types have associated subtypes.  Types and subtypes are defined in `conf.js`.  Available type labels and subtype labels are displayed in the right sidebar.  Labels are set by pressing the keyboard key that stands for that label.

**Modifier flag**:  For any item that has a type label set, it can also have a modifier flag set.  When the Keystroke Labeler is used for the classification of still frames from videos, the presence of the modifier means that the still is a "transitional" frame, in that the distinguishing features of the label's category are not fully present (typically because the feature is, at the instant, appearing or disappearing).  To set a type label with the modifier flag, hold `Shift` while pressing the key for that label.

**Seen items**:  Labeling an item marks it as "seen".  You can also "see" an item without labeling it.  If an item is marked as seen but has no label, that is an assertion that none of the categories defined in `conf.js` applies to the item.  You can think of seen items without labels as falling into an implicit category of "none of the explicitly defined categories".  

**Modes**:  The labeler has three main modes:  **keystroke mode** (the default), **editor mode**, and **annotation mode**.  

You can switch between Keystroke mode and editor mode by pressing the `Esc` key.  There are two main differences between keystroke mode and editor mode.  First, keystroke mode automatically advances to the next item after an item is seen.  Second, keystroke mode does *not* allow application of subtype labels.  To edit an item's subtype, you must use editor mode.  

You center annotation mode by selecting one of the annotation (or "Note") areas from editor mode, and then pressing the `Enter` key.

**Jump factor**:  The *jump factor* is the distance, in terms of the number of items, of navigation through the set of images.  For example, if the jump factor is 5 and the current item is number 31, then proceeding forward will jump to item 36.

**Buttons**:  Below the labeling area is a collection of clickable buttons which provide additional navigation features and options for saving and exporting your work.

## Known issues

There is a [known issue](https://github.com/WGBH-MLA/keystrokelabeler/issues/3) that, when using Chrome (or Chromium-based browsers such as Edge), editing an annotation with linebreaks sometimes results in extra linebreaks.  Using Firefox or Safari is recommended.

## Contributing

Feel free to make a pull request.  However, if your issue or change is unrelated to work at GBH or the CLAMS project, then it may not be prioritized.  

Regarding any ideas for significant contributions or changes, please get in touch with Owen.


## Credits
Keystroke Labeler was written by Owen King to create training data for the [CLAMS project](https://clams.ai/), in support of the [American Archive of Public Broadcasting](https://americanarchive.org/). 


## License
See `LICENSE` for details.

