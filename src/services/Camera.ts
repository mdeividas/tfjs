import * as tf from "@tensorflow/tfjs";

// Copyright 2019 The TensorFlow Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// =============================================================================

/**
 * A class that wraps webcam video elements to capture Tensor4Ds.
 */

export default class Webcam {
  webcamElement: HTMLVideoElement;
  width: number;
  height: number;

  constructor(webcamElement: HTMLVideoElement, width: number, height: number) {
    this.webcamElement = webcamElement;
    this.width = width;
    this.height = height;
  }

  /**
   * Captures a frame from the webcam and normalizes it between -1 and 1.
   * Returns a batched image (1-element batch) of shape [1, w, h, c].
   */

  capture() {
    return tf.tidy(() => {
      // Reads the image as a Tensor from the webcam <video> element.
      const webcamImage = tf.browser.fromPixels(this.webcamElement);

      const reversedImage = webcamImage.reverse(1);

      // Crop the image so we're using the center square of the rectangular
      // webcam.
      const croppedImage = this.cropImage(reversedImage);

      // Expand the outer most dimension so we have a batch size of 1.
      const batchedImage = croppedImage.expandDims(0);

      // Normalize the image between -1 and 1. The image comes in between 0-255,
      // so we divide by 127 and subtract 1.
      return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    });
  }

  /**
   * Crops an image tensor so we get a square image with no white space.
   * @param {Tensor4D} img An input image Tensor to crop.
   */

  cropImage(img: tf.Tensor3D) {
    const size = Math.min(img.shape[0], img.shape[1]);
    const centerHeight = img.shape[0] / 2;
    const beginHeight = centerHeight - size / 2;
    const centerWidth = img.shape[1] / 2;
    const beginWidth = centerWidth - size / 2;
    return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
  }

  /**
   * Adjusts the video size so we can make a centered square crop without
   * including whitespace.
   * @param {number} width The real width of the video element.
   * @param {number} height The real height of the video element.
   */

  adjustVideoSize(width: number, height: number) {
    const aspectRatio = width / height;
    if (width >= height) {
      this.webcamElement.width = aspectRatio * this.webcamElement.height;
    } else if (width < height) {
      this.webcamElement.height = this.webcamElement.width / aspectRatio;
    }
  }

  async setup(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        "Browser API navigator.mediaDevices.getUserMedia not available",
      );
    }

    this.webcamElement.srcObject = await navigator.mediaDevices.getUserMedia({
      video: { width: this.width, height: this.height },
      audio: false,
    });

    return new Promise<void>((resolve) => {
      this.webcamElement.addEventListener("loadeddata", () => {
        this.adjustVideoSize(
          this.webcamElement.videoWidth,
          this.webcamElement.videoHeight,
        );
        resolve();
      });
    });
  }
}
