import {
  GET_MSGS_SUCCESS,
  GET_MSGS_FAIL,
  ADD_MSG_SUCCESS,
  ADD_MSG_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  msgs: [],
  error: {},
};

const msgs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MSGS_SUCCESS:
      return {
        ...state,
        msgs: action.payload.data,
      };

    case GET_MSGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_MSG_SUCCESS:
      return {
        ...state,
        msgs: [...state.msgs, action.payload],
      };

    case ADD_MSG_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    

    default:
      return state;
  }
};

export default msgs;
