import {
  GET_NEARBY_RADIOLOGY_FAIL,
  GET_NEARBY_RADIOLOGY_SUCCESS,
  GET_RADIOLOGY_FAIL,
  GET_RADIOLOGY_SUCCESS,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  nearbyRadiology: [],
  territoriesList: [],
  Radiology:[],
  error: {},
};

const RadiologyMarket = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TERRITORIES_LIST_SUCCESS:
      return {
        ...state,
        territoriesList: action.payload.data,
      };

    case GET_TERRITORIES_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_NEARBY_RADIOLOGY_SUCCESS:
      return {
        ...state,
        nearbyRadiology: action.payload.data,
      };

    case GET_NEARBY_RADIOLOGY_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_RADIOLOGY_SUCCESS:
        return {
          ...state,
          Radiology: action.payload.data,
        };
  
      case GET_RADIOLOGY_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    default:
      return state;
  }
};

export default RadiologyMarket;
