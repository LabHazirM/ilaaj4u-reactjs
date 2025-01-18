import {
  GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED_SUCCESS,
  GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED_FAIL,
  GET_LAB_ADVERTISEMENT_REQUESTS_SUCCESS,
  GET_LAB_ADVERTISEMENT_REQUESTS_FAIL,
  UPDATE_LAB_ADVERTISEMENT_REQUEST_SUCCESS,
  UPDATE_LAB_ADVERTISEMENT_REQUEST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  labAdvertisementRequests: [],
  error: {},
};

const labAdvertisementRequests = (state = INIT_STATE, action) => {
  switch (action.type) {
    
    case GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED_SUCCESS:
      return {
        ...state,
        labAdvertisementRequests: action.payload.data,
      };

    case GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_LAB_ADVERTISEMENT_REQUESTS_SUCCESS:
      return {
        ...state,
        labAdvertisementRequests: action.payload.data,
      };

    case GET_LAB_ADVERTISEMENT_REQUESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_LAB_ADVERTISEMENT_REQUEST_SUCCESS:
      return {
        ...state,
        labAdvertisementRequests: state.labAdvertisementRequests.map(labAdvertisementRequest =>
          labAdvertisementRequest.id.toString() === action.payload.id.toString()
            ? { labAdvertisementRequest, ...action.payload }
            : labAdvertisementRequest
        ),
      };

    case UPDATE_LAB_ADVERTISEMENT_REQUEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default labAdvertisementRequests;
