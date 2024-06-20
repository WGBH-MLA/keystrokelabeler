# Structure of labeler data 

## Directory structure and files

For each image collection (e.g., corresponding to the stills from one video), there must be the following files:

`images/` - directory with images that were labeled

`conf.js` - Javascript objects representing labeling environment when these images were labeled.  Defines the available type labels and subtype labels.  Also names and describes the modifier.

`img_arr_init.js` - Javascript array of image filenames and labels before any labeling happened (all images unlabeled; all images unseeen).  This file can be created with the `getstills` Python module.  It is for initializing the Keystroke Labeler utility with the images in the `images/` directory.

If labeling has taken place, and data has been exported, the following files may be associated with the image collection:

`img_arr_prog.js` - Javascript array of images and labels after labeling.  This file can be used to re-start the Keystroke Labeler utility with labels already entered.

`img_labels.csv` - CSV export of image labels.  Contains exactly the same data as in `img_arr_prog.js`.


## Tabular data explanation

The tabular data has seven columns, as labeled in the CSV file.

0. **filename** (string) - the filename of the image to be labeled

1. **seen** (bool) - indicates whether the item has been seen

2. **type label** (char) - indicates the type label, if any, of seen items

3. **subtype label** (char) - indicates the subtype label, if any, of items with type labels

4. **modifier** (bool) - indicates whether the label has the "modifier" status

5. **transcript** (string) - displayed and saved if included in `img_arr_init.js` or `img_arr_prog.js`; not editable within labeler

6. **note** (string) - displayed and saved if included in `img_arr_init.js` or `img_arr_prog.js`; not editable within labeler

