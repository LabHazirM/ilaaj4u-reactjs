import {
  GET_NEARBY_PACKAGES_FAIL,
  GET_NEARBY_PACKAGES_SUCCESS,
  GET_PACKAGES_FAIL,
  GET_PACKAGES_SUCCESS,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  nearbyPackages: [],
  Packages:[],
  territoriesList: [],
  error: {},
};

const PackageMarket = (state = INIT_STATE, action) => {
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

    case GET_NEARBY_PACKAGES_SUCCESS:
      return {
        ...state,
        nearbyPackages: action.payload.data,
      };

    case GET_NEARBY_PACKAGES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_PACKAGES_SUCCESS:
        return {
          ...state,
          Packages: action.payload.data,
        };
  
      case GET_PACKAGES_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    default:
      return state;
  }
};

export default PackageMarket;
