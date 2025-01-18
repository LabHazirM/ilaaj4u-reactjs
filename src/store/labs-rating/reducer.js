import {
  GET_LABS_RATING_SUCCESS,
  GET_LABS_RATING_FAIL,

} from "./actionTypes";

const INIT_STATE = {
  labsRating: [],
  error: {},
};

const labsRating = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LABS_RATING_SUCCESS:
      return {
        ...state,
        labsRating: action.payload,
      };

    case GET_LABS_RATING_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default labsRating;
