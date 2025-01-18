import {
  GET_TEST_DESCRIPTIONS_SUCCESS,
  GET_TEST_DESCRIPTIONS_FAIL,

} from "./actionTypes";

const INIT_STATE = {
  testDescriptions: [],
  testDescription: [],
  error: {},
};

const testDescriptions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TEST_DESCRIPTIONS_SUCCESS:
      return {
        ...state,
        testDescriptions: action.payload.data,
      };

    case GET_TEST_DESCRIPTIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default testDescriptions;
