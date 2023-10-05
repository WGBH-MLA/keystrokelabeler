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
Your collection of image files should be in a directory called `images` in the same directory as the HTML, JavaScript, and CSS files from this repository.
You should also have an `img_arr_init.js` file, which can be created by the `getstills` module.

For details on file organization and data structures, consult `labeler_data_readme.md`.

You start the labeler simply by opening `labeler.html` in your web browser.

You can save your progress by using the "Export JS array" button and putting the file `img_arr_prog.js` the same directory as the other JavaScript files.

## Contributing
Feel free to make a pull request.

## Credits
Keystroke Labeler was written by Owen King to create training data for the [CLAMS project](https://clams.ai/), in support of the [American Archive of Public Broadcasting](https://americanarchive.org/). 

## License
See `LICENSE` for details.

