// Interface for the individual sensor data within a gait entry
export interface SensorData {
  accX: number;
  accY: number;
  accZ: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  id: number;
  type: "upper" | "lower"; // Assuming these are the only two possible values
}

// Interface for a single gait data entry, identified by a unique key
export interface GaitDataEntry {
  cadence: number;
  equilibriumScore: number;
  frequency: number;
  gaitCyclePhaseMean: number;
  posturalSway: number;
  sensors: SensorData[]; // An array of SensorData objects
  stepWidth: number;
  steps: number;
  strideLength: number;
  timestamp: number;
  walkingSpeed: number;
}

// Top-level interface for the entire 'gaitData' node
// The keys are the unique Firebase-generated IDs, and the values are GaitDataEntry objects
export interface GaitData {
  [key: string]: GaitDataEntry;
}

// This is the combined interface for all of the data that would be returned
// from your database root. It is not used in the previous examples, but it is good practice to have it.
export interface FirebaseRoot {
  gaitData: GaitData;
}