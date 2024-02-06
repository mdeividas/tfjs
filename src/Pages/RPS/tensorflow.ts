import * as tf from '@tensorflow/tfjs';

export const loadModel = async () => {
    const url = '/models/rps/model.json';

    return tf.loadLayersModel(url);
};
