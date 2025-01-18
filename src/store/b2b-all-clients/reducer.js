import {
  GET_B2B_ALL_CLIENTS_LIST_SUCCESS,
  GET_B2B_ALL_CLIENTS_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  b2bAllClientsList: [],
  error: {},
};

const b2bAllClients = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_B2B_ALL_CLIENTS_LIST_SUCCESS:
      return {
        ...state,
        b2bAllClientsList: action.payload.data,
      };

    case GET_B2B_ALL_CLIENTS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default b2bAllClients;
