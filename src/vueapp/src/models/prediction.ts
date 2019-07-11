export interface IPrediction {
  probability: number;
  tagId: string;
  boundingBox?: {};
  tagName: string;
}
export interface IPredictionResponse {
  id: string;
  project: string;
  iteration: string;
  ceated: Date;
  predictions: IPrediction[];
}

export interface IPredictionContent {
  image: string;
  predictionString: string;
  prediction: IPredictionResponse;
}
