import cv2
import sys

TARGET_PATH = sys.argv[1]
NAME = sys.argv[2]
SIZE = int(sys.argv[3])

# initialize the camera
# If you have multiple camera connected with
# current device, assign a value in cam_port
# variable according to that
cam_port = 0
cap = cv2.VideoCapture(cam_port)

count = 0

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()  # 'ret' will be False if the webcam is not working.

    if not ret:
        print("Failed to grab frame")
        break

    # Display the resulting frame
    cv2.imshow('Webcam Live', frame)

    # handle keyboard events
    k = cv2.waitKey(1)
    # Break the loop with 'q'
    if k & 0xFF == ord('q'):
        break
    # Save the frame if space bar is pressed
    elif k & 0xFF == ord(' '):
        # Compute the aspect ratio
        h, w = frame.shape[:2]
        aspect_ratio = w / h

        # Apply aspect ratio for the image
        if w > h:  # If the image is wider than it is tall
            new_h = SIZE
            new_w = round(SIZE * aspect_ratio)
        else:  # If the image is taller than it is wide
            new_w = SIZE
            new_h = round(SIZE / aspect_ratio)

        resized_image = cv2.resize(frame, (new_w, new_h))
        rh, rw = resized_image.shape[:2]

        # Calculate the top-left corner of the crop area
        start_x = rw // 2 - SIZE // 2
        start_y = rh // 2 - SIZE // 2
        cropped_image = resized_image[start_y:start_y + SIZE, start_x:start_x + SIZE]

        file_name = "{src}/{name}_{count}.png".format(src=TARGET_PATH, name=NAME, count=count)
        cv2.imwrite(file_name, cropped_image)

        count += 1

# When everything is done, release the capture
cap.release()
cv2.destroyAllWindows()