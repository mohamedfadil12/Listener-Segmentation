import modelParamsData from "../data/model_params.json";
import { ListenerInputs, ListenerSegment, ModelParams, PredictionResult } from "../types";

const modelParams: ModelParams = modelParamsData as unknown as ModelParams;

/**
 * Pure function to predict the listener segment from 4 behavioral input features.
 * 
 * Step 1: Scale raw inputs via StandardScaler: z_i = (x_i - mean_i) / scale_i
 * Step 2: Calculate Euclidean distance to all 3 cluster centroids in normalized 4D space
 * Step 3: Select centroid with argmin(distance) and map to segment name
 */
export function predict(inputs: ListenerInputs): PredictionResult {
  const { listeningHours, songsPerDay, skipRate, playlistCount } = inputs;
  const rawValues: [number, number, number, number] = [
    listeningHours,
    songsPerDay,
    skipRate,
    playlistCount
  ];

  // 1. StandardScaler Transformation
  const scaledInputs: [number, number, number, number] = [
    (rawValues[0] - modelParams.mean[0]) / modelParams.scale[0],
    (rawValues[1] - modelParams.mean[1]) / modelParams.scale[1],
    (rawValues[2] - modelParams.mean[2]) / modelParams.scale[2],
    (rawValues[3] - modelParams.mean[3]) / modelParams.scale[3]
  ];

  // 2. Compute Euclidean distance to each cluster center
  const distances: [number, number, number] = [0, 0, 0];
  let minDistance = Infinity;
  let bestClusterIndex = 0;

  for (let c = 0; c < modelParams.centers.length; c++) {
    const center = modelParams.centers[c];
    let sumSquaredDiff = 0;
    for (let i = 0; i < 4; i++) {
      const diff = scaledInputs[i] - center[i];
      sumSquaredDiff += diff * diff;
    }
    const distance = Math.sqrt(sumSquaredDiff);
    distances[c] = distance;

    if (distance < minDistance) {
      minDistance = distance;
      bestClusterIndex = c;
    }
  }

  // 3. Compute soft confidence via inverted distance softmax
  const inverseDistances = distances.map((d) => 1 / (d + 0.0001));
  const sumInv = inverseDistances.reduce((a, b) => a + b, 0);
  const confidence = Math.round((inverseDistances[bestClusterIndex] / sumInv) * 100);

  // 4. Calculate unscaled centers in original metric units for reference
  const unscaledCenters: [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
  ] = modelParams.centers.map((c) => [
    Math.round((c[0] * modelParams.scale[0] + modelParams.mean[0]) * 10) / 10,
    Math.round((c[1] * modelParams.scale[1] + modelParams.mean[1]) * 10) / 10,
    Math.round((c[2] * modelParams.scale[2] + modelParams.mean[2]) * 10) / 10,
    Math.round((c[3] * modelParams.scale[3] + modelParams.mean[3]) * 10) / 10
  ]) as [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
  ];

  const segmentName = (modelParams.labelOrder[bestClusterIndex.toString()] || "Casual Listener") as ListenerSegment;

  return {
    clusterIndex: bestClusterIndex,
    segmentName,
    distances,
    scaledInputs,
    confidence,
    unscaledCenters
  };
}

export { modelParams };
