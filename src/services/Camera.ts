import * as tf from '@tensorflow/tfjs';

export default class Camera {
    element: HTMLVideoElement;
    width: number;
    height: number;

    constructor(videoElement: HTMLVideoElement, width: number, height: number) {
        this.element = videoElement;
        this.width = width;
        this.height = height;
    }

    capture() {
        // tf.tidy method cleans up all the intermediate tensors (multi-dimension arrays)
        // that are not returned in this function.
        // This helps to avoid memory leaks.
        return tf.tidy(() => {
            // Reads the image as a Tensor from the webcam <video> element.
            const webcamImage = tf.browser.fromPixels(this.element);

            // The web camera captures images as they appear in reality.
            // This means that to match the captured image with our original dataset, we need to mirror the image.
            const reversedImage = webcamImage.reverse(1);

            // Crops an image tensor so we get a square image with no white space.
            const croppedImage = this.cropImage(reversedImage);

            // Expand the outer most dimension so we have a batch size of 1.
            const batchedImage = croppedImage.expandDims(0);

            // Normalize the image between -1 and 1.
            // The image comes in between 0-255, so we divide by 127 and subtract 1.
            return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
        });
    }

    cropImage(img: tf.Tensor3D) {
        const size = Math.min(img.shape[0], img.shape[1]);
        const centerHeight = img.shape[0] / 2;
        const beginHeight = centerHeight - size / 2;
        const centerWidth = img.shape[1] / 2;
        const beginWidth = centerWidth - size / 2;
        return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
    }

    // Adjusts the video size so we can make a centered square crop without including whitespace.
    adjustVideoSize(width: number, height: number) {
        const aspectRatio = width / height;
        if (width >= height) {
            this.element.width = aspectRatio * this.element.height;
        } else if (width < height) {
            this.element.height = this.element.width / aspectRatio;
        }
    }

    async setup(): Promise<void> {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
        }

        this.element.srcObject = await navigator.mediaDevices.getUserMedia({
            video: { width: this.width, height: this.height },
            audio: false,
        });

        return new Promise<void>((resolve) => {
            this.element.addEventListener('loadeddata', () => {
                this.adjustVideoSize(this.element.videoWidth, this.element.videoHeight);
                resolve();
            });
        });
    }
}
