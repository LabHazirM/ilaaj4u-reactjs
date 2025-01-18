import {
  ADD_CORPORATE_INFORMATION,
  ADD_CORPORATE_INFORMATION_SUCCESSFUL,
  ADD_CORPORATE_INFORMATION_FAILED,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
} from "./actionTypes";

const initialState = {
  addCorporateError: null,
  territoriesList: [],
  message: null,
  loading: false,
};

const corporateInformation = (state = initialState, action) => {
  switch (action.type) {
    // territories
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
    case ADD_CORPORATE_INFORMATION:
      state = {
        ...state,
        corporate: null,
        loading: true,
        addCorporateError: null,
      };
      break;
    case ADD_CORPORATE_INFORMATION_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        corporate: action.payload,
        addCorporateError: null,
      };
      break;
    case ADD_CORPORATE_INFORMATION_FAILED:
      state = {
        ...state,
        corporate: null,
        loading: false,
        addCorporateError: action.payload.corporate,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default corporateInformation;
