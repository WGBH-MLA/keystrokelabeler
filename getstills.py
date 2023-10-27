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
import av
import json

# %%

def extract(video_path, period, first_time, last_time, max_stills):
    """Performs extraction of stills from the video and creates an index of 
    extracted image files in a JSON array.  

    Filenames have timestamps of, expressed in milliseconds, for each still.

    Caveat:  Calculation of timestamps assumes that the video has constant framerate.
    """
    
    # %% 
    """Variable assignments for testing/debugging
    video_path = "../ksl_data/test_videos/cpb-aacip-b45eb62bd60.mp4" #DEBUG
    period = 2000 #DEBUG
    first_time = 0 #DEBUG
    last_time = -1 #DEBUG
    max_stills = -1
    """

    # Create directory for the project based on the filename of the media
    vfilename = os.path.basename(video_path)
    fname, ext = os.path.splitext(vfilename)
    basename = "stills_" + fname + "_" + str(period) + "ms"
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

    print("Extracting stills from", video_path, "every", period, "ms...") 

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

        ftime = int((fcount/fps) * 1000)
        #ftime = int(frame.time * 1000)   # Probably more accurate with variable FPS
        
        # print("fcount:", fcount, "; ftime:", ftime) #DEBUG

        # break the loop if we've exceeded the limits
        if ( ( max_stills > -1 and stills_count >= max_stills ) or
             ( last_time > -1 and ftime > last_time ) ):
            break
        
        # Grab the first still after the target time index
        # (assuming the limits have not been exceeded.)
        if ( ( max_stills == -1 or stills_count < max_stills ) and
             ( last_time == -1 or ftime <= last_time ) and 
             ( ftime >= next_target_time ) ): 
            ifilename =  f'{fname}_{length:08}_{ftime:08}.jpg'
            ipathname = stills_dir + ifilename
            frame.to_image().save(ipathname)
            image_list.append(ifilename)
            next_target_time += period
            stills_count += 1

        fcount += 1
    
    print("Extracted", stills_count, "stills out of", fcount, "video frames.") 

    container.close()

    # Create image index array file
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

    # add bits to make it valid Javascript
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

    usage = """Usage: python getstills.py <filename> [period in milliseconds]
    If no period is specified, the default is 1000 ms.
    To extract every frame, set a period of 0 ms."
    """

    if len(sys.argv) < 2 or len(sys.argv) > 3 :
        print("Incorrect number of arguments provided.")
        print(usage)
        sys.exit(1)

    video_path = sys.argv[1]
    if not os.path.exists(video_path):
        print("Error:  Invalid file path.")
        print(usage)
        sys.exit(1)

    if len(sys.argv) == 3 :
        try: 
            period = int(sys.argv[2])
        except ValueError:
            print("Error:  The second argument must be an integer.")
            print(usage)
        
        if not ( period >= 0 and period <= 86400000 ) :
            print("Error:  Please enter a sensible value for the period in milliseconds.")
            print(usage)
            sys.exit(1)
    else :
        period = 1000
    
    # In future development, these could be user-supplied
    first_time = 0
    last_time = -1
    max_stills = -1

    extract(video_path, period, first_time, last_time, max_stills)
# %%
    

if __name__ == "__main__":
    main()

