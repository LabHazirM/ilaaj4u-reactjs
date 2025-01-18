import {
  GET_SAMPLE_COLLECTION_IN_PROCESS_LIST_SUCCESS,
  GET_SAMPLE_COLLECTION_IN_PROCESS_LIST_FAIL,
  GET_SAMPLE_COLLECTION_COMPLETED_LIST_SUCCESS,
  GET_SAMPLE_COLLECTION_COMPLETED_LIST_FAIL,
  UPDATE_SAMPLE_COLLECTION_STATUS_SUCCESS,
  UPDATE_SAMPLE_COLLECTION_STATUS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  sampleCollectorDatasInProcessList: [],
  sampleCollectorDatasCompletedList: [],
  error: {},
};

const sampleCollectorDatas = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SAMPLE_COLLECTION_IN_PROCESS_LIST_SUCCESS:
      return {
        ...state,
        sampleCollectorDatasInProcessList: action.payload.data,
      };

    case GET_SAMPLE_COLLECTION_IN_PROCESS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_SAMPLE_COLLECTION_COMPLETED_LIST_SUCCESS:
      return {
        ...state,
        sampleCollectorDatasCompletedList: action.payload.data,
      };

    case GET_SAMPLE_COLLECTION_COMPLETED_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_SAMPLE_COLLECTION_STATUS_SUCCESS:
      return {
        ...state,
        sampleCollectorDatas: state.sampleCollectorDatas.map(
          sampleCollectorData =>
            sampleCollectorData.id.toString() === action.payload.id.toString()
              ? { sampleCollectorData, ...action.payload }
              : sampleCollectorData
        ),
      };

    case UPDATE_SAMPLE_COLLECTION_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default sampleCollectorDatas;
