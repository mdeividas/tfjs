import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

export const calculateDistance = (x1: number, x2: number, y1: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

export const interpolate = (x: number, xMin: number, xMax: number, yMin: number, yMax: number) =>
    yMin + ((x - xMin) / (xMax - xMin)) * (yMax - yMin);

export const findNearestCentroid = (point: number[], centroids: number[][]) => {
    let nearestCentroidIndex = 0;
    let minDistance = Infinity;

    centroids.forEach((centroid, index) => {
        let distance = 0;
        for (let i = 0; i < centroid.length; i++) {
            distance += Math.pow(centroid[i] - point[i], 2);
        }
        distance = Math.sqrt(distance);

        if (distance < minDistance) {
            minDistance = distance;
            nearestCentroidIndex = index;
        }
    });

    return nearestCentroidIndex;
};

export const KMeansCentroidsSearch = (point: number[]) => {
    const centroids = [
        [60.44377635123625, 51.557028154899726, 44.623663749718425, 39.69141225804538, 38.27270597176409],
        [71.86672601184169, 88.76003536712001, 107.09756812003087, 103.72602043189468, 88.34780049860731],
    ];

    return findNearestCentroid(point, centroids);
};

export const createKeyMap = (handPoseEstimations: handPoseDetection.Keypoint[]) =>
    handPoseEstimations.reduce<Record<string, handPoseDetection.Keypoint>>((acc, item) => {
        acc[item.name!] = item;
        return acc;
    }, {});

export const getHandPoseEstimationsDistances = (data: Record<string, handPoseDetection.Keypoint>) => {
    const wristThumbDistance = calculateDistance(data.wrist.x, data.thumb_tip.x, data.wrist.y, data.thumb_tip.y);
    const wristIndexDistance = calculateDistance(
        data.wrist.x,
        data.index_finger_tip.x,
        data.wrist.y,
        data.index_finger_tip.y
    );
    const wristMiddleDistance = calculateDistance(
        data.wrist.x,
        data.middle_finger_tip.x,
        data.wrist.y,
        data.middle_finger_tip.y
    );
    const wristRingDistance = calculateDistance(
        data.wrist.x,
        data.ring_finger_tip.x,
        data.wrist.y,
        data.ring_finger_tip.y
    );
    const wristPinkyDistance = calculateDistance(
        data.wrist.x,
        data.pinky_finger_tip.x,
        data.wrist.y,
        data.pinky_finger_tip.y
    );

    return [wristThumbDistance, wristIndexDistance, wristMiddleDistance, wristRingDistance, wristPinkyDistance];
};
