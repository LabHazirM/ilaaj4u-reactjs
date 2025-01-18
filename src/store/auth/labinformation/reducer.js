import {
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  GET_MAIN_LABS_SUCCESS,
  GET_MAIN_LABS_FAIL,
  ADD_LAB_INFORMATION,
  ADD_LAB_INFORMATION_SUCCESSFUL,
  ADD_LAB_INFORMATION_FAILED,
} from "./actionTypes";

const initialState = {
  labs: [],
  territoriesList: [],
  addLabError: null,
  message: null,
  loading: false,
};

const labInformation = (state = initialState, action) => {
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
    // lab information
    case GET_MAIN_LABS_SUCCESS:
      return {
        ...state,
        labs: action.payload.data,
      };

    case GET_MAIN_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_LAB_INFORMATION:
      state = {
        ...state,
        lab: null,
        loading: true,
        addLabError: null,
      };
      break;
    case ADD_LAB_INFORMATION_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        lab: action.payload,
        addLabError: null,
      };
      break;
    case ADD_LAB_INFORMATION_FAILED:
      state = {
        ...state,
        lab: null,
        loading: false,
        addLabError: action.payload.lab,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default labInformation;
