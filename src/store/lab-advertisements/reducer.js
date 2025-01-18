import {
  // GET_ADVERTISEMENT_PRICE_LISTS_SUCCESS,
  // GET_ADVERTISEMENT_PRICE_LISTS_FAIL,
  GET_LAB_ADVERTISEMENTS_SUCCESS,
  GET_LAB_ADVERTISEMENTS_FAIL,
  ADD_LAB_ADVERTISEMENT_SUCCESS,
  ADD_LAB_ADVERTISEMENT_FAIL,
  UPDATE_LAB_ADVERTISEMENT_SUCCESS,
  UPDATE_LAB_ADVERTISEMENT_FAIL,
  DELETE_LAB_ADVERTISEMENT_SUCCESS,
  DELETE_LAB_ADVERTISEMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  labAdvertisements: [],
  error: {},
};

const labAdvertisements = (state = INIT_STATE, action) => {
  switch (action.type) {
    
    // case GET_ADVERTISEMENT_PRICE_LISTS_SUCCESS:
    //   return {
    //     ...state,
    //     labAdvertisements: action.payload.data,
    //   };

    // case GET_ADVERTISEMENT_PRICE_LISTS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };
    case GET_LAB_ADVERTISEMENTS_SUCCESS:
      return {
        ...state,
        labAdvertisements: action.payload.data,
      };

    case GET_LAB_ADVERTISEMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_LAB_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        labAdvertisements: [...state.labAdvertisements, action.payload],
      };

    case ADD_LAB_ADVERTISEMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_LAB_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        labAdvertisements: state.labAdvertisements.map(labAdvertisement =>
          labAdvertisement.id.toString() === action.payload.id.toString()
            ? { labAdvertisement, ...action.payload }
            : labAdvertisement
        ),
      };

    case UPDATE_LAB_ADVERTISEMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_LAB_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        labAdvertisements: state.labAdvertisements.filter(
          labAdvertisement =>
            labAdvertisement.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_LAB_ADVERTISEMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default labAdvertisements;
