import {
  GET_SAMPLE_COLLECTION_IN_PROCESS_LIST,
  GET_SAMPLE_COLLECTION_IN_PROCESS_LIST_SUCCESS,
  GET_SAMPLE_COLLECTION_IN_PROCESS_LIST_FAIL,
  GET_SAMPLE_COLLECTION_COMPLETED_LIST,
  GET_SAMPLE_COLLECTION_COMPLETED_LIST_SUCCESS,
  GET_SAMPLE_COLLECTION_COMPLETED_LIST_FAIL,
  UPDATE_SAMPLE_COLLECTION_STATUS,
  UPDATE_SAMPLE_COLLECTION_STATUS_SUCCESS,
  UPDATE_SAMPLE_COLLECTION_STATUS_FAIL,
} from "./actionTypes";

export const getSampleCollectionInProcessList = id => ({
  type: GET_SAMPLE_COLLECTION_IN_PROCESS_LIST,
  payload: id,
});

export const getSampleCollectionInProcessListSuccess =
  sampleCollectorDatasInProcessList => ({
    type: GET_SAMPLE_COLLECTION_IN_PROCESS_LIST_SUCCESS,
    payload: sampleCollectorDatasInProcessList,
  });

export const getSampleCollectionInProcessListFail = error => ({
  type: GET_SAMPLE_COLLECTION_IN_PROCESS_LIST_FAIL,
  payload: error,
});

export const getSampleCollectionCompletedList = id => ({
  type: GET_SAMPLE_COLLECTION_COMPLETED_LIST,
  payload: id,
});

export const getSampleCollectionCompletedListSuccess =
  sampleCollectorDatas => ({
    type: GET_SAMPLE_COLLECTION_COMPLETED_LIST_SUCCESS,
    payload: sampleCollectorDatas,
  });

export const getSampleCollectionCompletedListFail = error => ({
  type: GET_SAMPLE_COLLECTION_COMPLETED_LIST_FAIL,
  payload: error,
});

export const updateSampleCollectionStatus = sampleCollectorData => ({
  type: UPDATE_SAMPLE_COLLECTION_STATUS,
  payload: sampleCollectorData,
});

export const updateSampleCollectionStatusSuccess = sampleCollectorData => ({
  type: UPDATE_SAMPLE_COLLECTION_STATUS_SUCCESS,
  payload: sampleCollectorData,
});

export const updateSampleCollectionStatusFail = error => ({
  type: UPDATE_SAMPLE_COLLECTION_STATUS_FAIL,
  payload: error,
});
