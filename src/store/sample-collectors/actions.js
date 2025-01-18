import {
  GET_SAMPLE_COLLECTORS,
  GET_SAMPLE_COLLECTORS_FAIL,
  GET_SAMPLE_COLLECTORS_SUCCESS,
  ADD_NEW_SAMPLE_COLLECTOR,
  ADD_SAMPLE_COLLECTOR_SUCCESS,
  ADD_SAMPLE_COLLECTOR_FAIL,
  UPDATE_SAMPLE_COLLECTOR,
  UPDATE_SAMPLE_COLLECTOR_SUCCESS,
  UPDATE_SAMPLE_COLLECTOR_FAIL,
  DELETE_SAMPLE_COLLECTOR,
  DELETE_SAMPLE_COLLECTOR_SUCCESS,
  DELETE_SAMPLE_COLLECTOR_FAIL,
} from "./actionTypes";

// ----------- Sample collector list APIs actions -----------------
export const getSampleCollectors = id => ({
  type: GET_SAMPLE_COLLECTORS,
  payload: id,
});

export const getSampleCollectorsSuccess = sampleCollectors => ({
  type: GET_SAMPLE_COLLECTORS_SUCCESS,
  payload: sampleCollectors,
});

export const getSampleCollectorsFail = error => ({
  type: GET_SAMPLE_COLLECTORS_FAIL,
  payload: error,
});

export const addNewSampleCollector = (sampleCollector, id) => ({
  type: ADD_NEW_SAMPLE_COLLECTOR,
  payload: { sampleCollector, id },
});

export const addSampleCollectorSuccess = sampleCollector => ({
  type: ADD_SAMPLE_COLLECTOR_SUCCESS,
  payload: sampleCollector,
});

export const addSampleCollectorFail = error => ({
  type: ADD_SAMPLE_COLLECTOR_FAIL,
  payload: error,
});

export const updateSampleCollector = sampleCollector => ({
  type: UPDATE_SAMPLE_COLLECTOR,
  payload: sampleCollector,
});

export const updateSampleCollectorSuccess = sampleCollector => ({
  type: UPDATE_SAMPLE_COLLECTOR_SUCCESS,
  payload: sampleCollector,
});

export const updateSampleCollectorFail = error => ({
  type: UPDATE_SAMPLE_COLLECTOR_FAIL,
  payload: error,
});

export const deleteSampleCollector = sampleCollector => ({
  type: DELETE_SAMPLE_COLLECTOR,
  payload: sampleCollector,
});

export const deleteSampleCollectorSuccess = sampleCollector => ({
  type: DELETE_SAMPLE_COLLECTOR_SUCCESS,
  payload: sampleCollector,
});

export const deleteSampleCollectorFail = error => ({
  type: DELETE_SAMPLE_COLLECTOR_FAIL,
  payload: error,
});
