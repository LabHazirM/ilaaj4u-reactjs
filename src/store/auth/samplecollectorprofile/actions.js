import {
  GET_SAMPLE_COLLECTOR_PROFILE,
  GET_SAMPLE_COLLECTOR_PROFILE_FAIL,
  GET_SAMPLE_COLLECTOR_PROFILE_SUCCESS,
  UPDATE_SAMPLE_COLLECTOR_PROFILE,
  UPDATE_SAMPLE_COLLECTOR_PROFILE_SUCCESS,
  UPDATE_SAMPLE_COLLECTOR_PROFILE_FAIL,
} from "./actionTypes";

// ----------- SampleCollector profile APIs actions -----------------
export const getSampleCollectorProfile = id => ({
  type: GET_SAMPLE_COLLECTOR_PROFILE,
  payload: id,
});

export const getSampleCollectorProfileSuccess = sampleCollectorProfile => (
  console.log("actions lab profile",sampleCollectorProfile),
  {
  type: GET_SAMPLE_COLLECTOR_PROFILE_SUCCESS,
  payload: sampleCollectorProfile,
});

export const getSampleCollectorProfileFail = error => ({
  type: GET_SAMPLE_COLLECTOR_PROFILE_FAIL,
  payload: error,
});

export const updateSampleCollectorProfile = (sampleCollectorProfile, id) => ({
  type: UPDATE_SAMPLE_COLLECTOR_PROFILE,
  payload: { sampleCollectorProfile, id },
});

export const updateSampleCollectorProfileSuccess = sampleCollectorProfile => ({
  type: UPDATE_SAMPLE_COLLECTOR_PROFILE_SUCCESS,
  payload: sampleCollectorProfile,
});

export const updateSampleCollectorProfileFail = error => ({
  type: UPDATE_SAMPLE_COLLECTOR_PROFILE_FAIL,
  payload: error,
});
