import {
  GET_ADVERTISEMENT_LIVES_SUCCESS,
  GET_ADVERTISEMENT_LIVES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  advertisementLives: [],
  error: {},
};

const advertisementLives = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ADVERTISEMENT_LIVES_SUCCESS:
      return {
        ...state,
        advertisementLives: action.payload.data,
      };

    case GET_ADVERTISEMENT_LIVES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default advertisementLives;
