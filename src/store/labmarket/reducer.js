import {
  GET_NEARBY_LABS_FAIL,
  GET_NEARBY_LABS_SUCCESS,
  GET_CORPORATE_LABS_FAIL,
  GET_CORPORATE_LABS_SUCCESS,
  GET_REGION_WISE_ADVERTISEMENT_FAIL,
  GET_REGION_WISE_ADVERTISEMENT_SUCCESS,
  GET_ADV_LIVE_FAIL,
  GET_ADV_LIVE_SUCCESS,
  GET_PATIENT_PROFILE_FAIL,
  GET_PATIENT_PROFILE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  regionWiseAdvertisement:[],
  nearbyLabs: [],
  corporateLab: [],
  advLives: [],
  patientProfile: [],
  error: {},
};

const labMarket = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NEARBY_LABS_SUCCESS:
      return {
        ...state,
        nearbyLabs: action.payload.data,
      };

    case GET_NEARBY_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_CORPORATE_LABS_SUCCESS:
        return {
          ...state,
          corporateLab: action.payload.data,
        };
  
      case GET_CORPORATE_LABS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_PATIENT_PROFILE_SUCCESS:
        return {
          ...state,
          patientProfile: action.payload.data,
        };
  
      case GET_PATIENT_PROFILE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    case GET_REGION_WISE_ADVERTISEMENT_SUCCESS:
        return {
          ...state,
          regionWiseAdvertisement: action.payload.data,
        };
  
    case GET_REGION_WISE_ADVERTISEMENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    case GET_ADV_LIVE_SUCCESS:
        return {
          ...state,
          advLives: action.payload.data,
        };
  
      case GET_ADV_LIVE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    default:
      return state;
  }
};

export default labMarket;
