"""
getstills.py

# Overview

Creates periodic stills from a video file, with image filenames including 
millisecond timestamps.

# Usage

$ python getstills.py <filename> [period]

The period is expressed in milliseconds.

If no period is specified, the default is 1000 ms.
To extract every frame as a still, specify a period of 0 ms.

# Output

The application creates a directory based on the filename of the video file, 
and adds each still to that directory.

Image filenames include the base filename (without the extension) of the 
media file, the timestamp (expressed in milliseconds), and the total length 
of the video (in milliseconds). 

Caveat:  Calculation of timestamps assumes that the video has constant 
framerate.
"""

# %%
import sys
import os
import json
import argparse

import av

# %%

def extract( video_path, 
             period=1000, 
             first_time=0, 
             last_time=-1, 
             max_stills=-1, 
             hard_break=False, 
             filetype_ext="jpg", 
             prep_ksl=False):
    """Performs extraction of stills from the video and creates an index of 
    extracted image files in a JSON array.  

    Filenames have timestamps of, expressed in milliseconds, for each still.

    Caveat:  Calculation of timestamps assumes that the video has constant framerate.
    """
    
    # %% 
    # Create directory for the project based on the filename of the media
    vfilename = os.path.basename(video_path)
    fname, ext = os.path.splitext(vfilename)
    
    basename = "stills_" + fname 
    
    # If this is for a KSL project, create appropriate directories
    if prep_ksl: 
        proj_dir = "./" + basename + "/"
        stills_dir = proj_dir + "images/"

        if not os.path.exists(proj_dir):
            print("Creating directory:", proj_dir)
            os.mkdir(proj_dir)
        else:
            print("Warning: Project directory exists.  Existing data may be overwritten.")

        if not os.path.exists(stills_dir):
            print("Creating directory:", stills_dir)
            os.mkdir(stills_dir)
        else:
            print("Warning: Stills directory exists.  Existing stills may be overwritten.")
    else:
        proj_dir = "./" 
        stills_dir = proj_dir 

    # Print explanatory messages.
    print("Using video from", video_path)
    print("Starting at", first_time, "ms")
    if last_time != -1:
        print("Will stop at", last_time, "ms")
    if max_stills != -1:
        print("Will stop after extracting", max_stills, "stills")
    print("Extracting stills every", period, "ms ...") 

    # Initialize counters for iteration
    image_list = []
    stills_count = 0
    fcount = 0
    next_target_time = first_time

    # find the first video stream
    container = av.open(video_path)
    video_stream = next((s for s in container.streams if s.type == 'video'), None)
    if video_stream is None:
        raise Exception("No video stream found in {}".format(vfilename) ) 

    # get technical stats on the video stream; assumes FPS is constant
    fps = video_stream.average_rate.numerator / video_stream.average_rate.denominator
   
    # calculate duration in ms
    length = int((video_stream.frames / fps) * 1000)

    #%%
    # going to loop through every frame in the video stream, starting at the beginning 
    for frame in container.decode(video_stream):

        # deprecated frame time calculation
        # This calculation assumes constant FPS
        # It also (rarely) differs from frame.time by 1msec even with constant FPS videos
        #ftime = int((fcount/fps) * 1000)

        ftime = int(frame.time * 1000)   # Probably more accurate with variable FPS
       
        # print("fcount:", fcount, "; ftime:", ftime) #DEBUG

        # break the loop if we've exceeded the limits
        if ( hard_break and
             ( ( max_stills > -1 and stills_count >= max_stills ) or
             ( last_time > -1 and ftime > last_time ) ) ):
            break

        # Grab the first still after the target time index
        # (assuming the limits have not been exceeded.)
        if ( ( max_stills == -1 or stills_count < max_stills ) and
             ( last_time == -1 or ftime <= last_time ) and 
             ( ftime >= next_target_time ) ): 
            ifilename =  f'{fname}_{length:08}_{ftime:08}' + "." + filetype_ext
            ipathname = stills_dir + ifilename
            frame.to_image().save(ipathname)
            image_list.append(ifilename)
            next_target_time += period
            stills_count += 1

        fcount += 1
    
    print("Extracted", stills_count, "stills out of", fcount, "video frames.") 

    container.close()

    # If required, create image index array file
    if prep_ksl:
        print("Creating stills index...")

        # first, flesh out the list
        image_array = []
        for iname in image_list:
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
        array_pathname = proj_dir + "img_arr_init.js"
        with open(array_pathname, "w") as array_file:
            array_file.write(image_array_j)

        print("Stills index created at " + array_pathname + ".")


    print("Done.")



# %%
def main(): 

    app_desc = """getstills.py
    Extracts still images from a video file.
    Note:  All times are expressed in milliseconds.
    """

    parser = argparse.ArgumentParser(
        prog='python getstills.py',
        description=app_desc,
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument("video_path", metavar="FILE",
        help="Path and filename for the video file")
    parser.add_argument("-p", "--period", type=int, default=1000,
        help="Extract stills every PERIOD ms. (To extract every frame, use a value of 0.)")
    parser.add_argument("-s", "--start", type=int, default=0,
        help="Begin extracting at START ms in the video.")
    parser.add_argument("-e", "--end", type=int, default=-1,
        help="Stop extracting at END ms in video. (Use value of -1 to go to the end of the media.)")
    parser.add_argument("-m", "--max", type=int, default=-1,
        help="Stop extracting after MAX stills have been saved. Use value of -1 for unliminted.")
    parser.add_argument("-b", "--hard_break", action="store_true",
        help="Break (instead of looping through all frames) when END time or MAX stills is reached.")
    parser.add_argument("-t", "--type", default="jpg", choices=["jpg", "png"],
        help="Filename extension for desired output image file type.")
    parser.add_argument("-k", "--ksl", action="store_true",
        help="Create directories and a KeystrokeLabeler index of extracted stills")

    args = parser.parse_args() 

    if not os.path.exists(args.video_path):
        print("Error:  Invalid file path.")
        print("Run with '-h' for help.")
        sys.exit(1)

    if not ( args.period == -1 or (args.period >= 0 and args.period <= 86400000) ) :
        print("Error:  Please enter a sensible value for the period in milliseconds.")
        sys.exit(1)

    #print(args) #DEBUG

    extract(args.video_path, args.period, args.start, args.end, 
            args.max, args.hard_break, args.type, args.ksl)
# %%
    

if __name__ == "__main__":
    main()

