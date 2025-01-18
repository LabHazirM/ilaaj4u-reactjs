import {
  GET_SAMPLE_COLLECTORS_SUCCESS,
  GET_SAMPLE_COLLECTORS_FAIL,
  ADD_SAMPLE_COLLECTOR_SUCCESS,
  ADD_SAMPLE_COLLECTOR_FAIL,
  UPDATE_SAMPLE_COLLECTOR_SUCCESS,
  UPDATE_SAMPLE_COLLECTOR_FAIL,
  DELETE_SAMPLE_COLLECTOR_SUCCESS,
  DELETE_SAMPLE_COLLECTOR_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  sampleCollectors: [],
  error: {},
};

const sampleCollectors = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SAMPLE_COLLECTORS_SUCCESS:
      return {
        ...state,
        sampleCollectors: action.payload.data,
      };

    case GET_SAMPLE_COLLECTORS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_SAMPLE_COLLECTOR_SUCCESS:
      return {
        ...state,
        sampleCollectors: [...state.sampleCollectors, action.payload],
      };

    case ADD_SAMPLE_COLLECTOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_SAMPLE_COLLECTOR_SUCCESS:
      return {
        ...state,
        sampleCollectors: state.sampleCollectors.map(sampleCollector =>
          sampleCollector.id.toString() === action.payload.id.toString()
            ? { sampleCollector, ...action.payload }
            : sampleCollector
        ),
      };

    case UPDATE_SAMPLE_COLLECTOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_SAMPLE_COLLECTOR_SUCCESS:
      return {
        ...state,
        sampleCollectors: state.sampleCollectors.filter(
          sampleCollector =>
            sampleCollector.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_SAMPLE_COLLECTOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default sampleCollectors;
