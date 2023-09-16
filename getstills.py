"""
getstills.py

# Overview

Creates periodic stills from a video file, with filenames including 
millisecond timestamps.

# Usage

$ python getstills.py <filename> [period]

The period is expressed in milliseconds.

# Output

The application creates a directory based on the filename of the media file, 
and adds the stillto that directory.

Filenames include the base filename (without the extension) of the media file, the 
timestamp (expressed in milliseconds), and the total length of the video, in milliseconds. 


"""

# %%
import sys
import os
import av

# %%

def extract(video_path, period, first_time, last_time, max_stills):
    """Performs extraction of stills from the video"""

    # %% 
    """Variable assignments for testing/debugging
    video_path = "./test_videos/cpb-aacip-b45eb62bd60.mp4" #DEBUG
    period = 2000 #DEBUG
    first_time = 0 #DEBUG
    #first_time = 34000
    last_time = -1 #DEBUG
    #last_time = 48000
    max_stills = -1
    #max_stills = 9999 #DEBUG
    """

    filename = os.path.basename(video_path)
    name, ext = os.path.splitext(filename)
    stills_dir = "./stills_" + name + "/"

    # Create directory for the still based on the filename of the media
    if not os.path.exists(stills_dir):
        print("Creating directory:", stills_dir)
        os.mkdir(stills_dir)
    else:
        print("Warning: Stills directory exists.  Existing stills may be overwritten.")

    print("Extracting stills from", video_path, "every", period, "ms...") 

    # initialize counters for iteration
    stills_count = 0
    fcount = 0
    next_target_time = first_time

    # open the video stream
    container = av.open(video_path)
    video_stream = next((s for s in container.streams if s.type == 'video'), None)
    if video_stream is None:
        raise Exception("No video stream found in {}".format(filename) ) 

    # get technical stats on the video stream
    fps = video_stream.average_rate.numerator / video_stream.average_rate.denominator
    length = int((video_stream.frames / fps) * 1000)

    # going to loop through every frame in the video stream, starting at the beginning 
    for frame in container.decode(video=0):
        ftime = int((fcount/fps) * 1000)

        # print("fcount:", fcount, "; ftime:", ftime) #DEBUG

        # break the loop if we've exceeded the limits
        if ( ( max_stills > -1 and stills_count >= max_stills ) or
             ( last_time > -1 and ftime > last_time ) ):
            break
        
        # Grab the first still after the target time index
        # (assuming the limits have not been exceeded.)
        if (( max_stills == -1 or stills_count < max_stills ) and
            ( last_time == -1 or ftime <= last_time ) and 
            ftime >= next_target_time ): 
            frame.to_image().save(f'{stills_dir}{name}_{ftime:08}_{length:08}.jpg')
            next_target_time += period
            stills_count += 1

        fcount += 1
    
    print("Extracted", stills_count, "stills out of", fcount, "frames.") 

    container.close()


# %%
def main(): 

    usage = """Usage: python getstills.py <filename> [period in milliseconds]
    If no period is specified, the default is 1000 ms."
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
        
        if not ( period > 0 and period <= 86400000 ) :
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

