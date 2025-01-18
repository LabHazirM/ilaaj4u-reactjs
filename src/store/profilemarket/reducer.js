import {
  GET_NEARBY_PROFILES_FAIL,
  GET_NEARBY_PROFILES_SUCCESS,
  GET_PROFILES_FAIL,
  GET_PROFILES_SUCCESS,
  GET_TESTSS_FAIL,
  GET_TESTSS_SUCCESS,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  nearbyProfiles: [],
  Profiles:[],
  Testss:[],
  territoriesList: [],
  error: {},
};

const ProfileMarket = (state = INIT_STATE, action) => {
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
    case GET_NEARBY_PROFILES_SUCCESS:
      return {
        ...state,
        nearbyProfiles: action.payload.data,
      };

    case GET_NEARBY_PROFILES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_PROFILES_SUCCESS:
      return {
        ...state,
        Profiles: action.payload.data,
      };

    case GET_PROFILES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TESTSS_SUCCESS:
      return {
        ...state,
        Testss: action.payload.data,
      };

    case GET_TESTSS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ProfileMarket;
