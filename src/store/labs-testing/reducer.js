import {
  GET_LABS_TESTING_SUCCESS,
  GET_LABS_TESTING_FAIL,

} from "./actionTypes";

const INIT_STATE = {
  labsTesting: [],
  error: {},
};

const labsTesting = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LABS_TESTING_SUCCESS:
      return {
        ...state,
        labsTesting: action.payload,
      };

    case GET_LABS_TESTING_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default labsTesting;
