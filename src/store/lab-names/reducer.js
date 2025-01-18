import {
  GET_LAB_NAMES_LIST_SUCCESS,
  GET_LAB_NAMES_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  labNamesList: [],
  error: {},
};

const labNamesList = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LAB_NAMES_LIST_SUCCESS:
      return {
        ...state,
        labNamesList: action.payload.data,
      };

    case GET_LAB_NAMES_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};


export default labNamesList;
