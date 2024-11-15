"""
make_ksl_index.py

Creates a Keystroke Labeler index file (which is a JavaScript file) for
the image files in a given directory.

File is named `img_arr_init.js` and overwrites any existing file with that
name.
"""

import argparse
import os
import json

def make_index( dir_path:str ):
    """
    Builds an index of the image files in a given directory
    """

    print("Using directory:", dir_path)

    if not os.path.isdir(dir_path):
        print("Error:  Invalid directory path for image files.")
        raise FileNotFoundError("Invalid directory path for image files.")

    filenames = os.listdir(dir_path)

    # filter filenames by extension
    last4 = [ ".jpg",
              "jpeg",
              ".png",
              ".bmp",
              "webp" ]
    img_filenames = [ f for f in filenames if (len(f) > 4 and f[-4:].lower() in last4) ]
    
    # first, flesh out the list
    image_array = []
    for iname in img_filenames:
        image_array.append([iname, False, "", "", False, "", ""])

    # convert array to a JSON string 
    image_array_j = json.dumps(image_array)

    # prettify with line breaks
    image_array_j = image_array_j.replace("[[", "[\n[")
    image_array_j = image_array_j.replace("], [", "], \n[")
    image_array_j = image_array_j.replace("]]", "]\n]")

    # add bits around the JSON text to make it valid Javascript
    image_array_j = "imgArray=\n" + image_array_j
    image_array_j = image_array_j + "\n;"

    # write Javascript file in current directory
    array_pathname = "img_arr_init.js"
    with open(array_pathname, "w") as array_file:
        array_file.write(image_array_j)

    print("Keystroke Labeler image index created at " + array_pathname + ".")


############################################################################
def main():


    parser = argparse.ArgumentParser(
        prog='make_ksl_index.py',
        description='Creates a Keystroke Labeler index file for the image files in a given directory.',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument("img_dir", metavar="DIR", 
        help="Path to the directory of image files to index")
    
    args = parser.parse_args()

    dir_path = args.img_dir

    make_index(dir_path)


if __name__ == "__main__":
    main()
