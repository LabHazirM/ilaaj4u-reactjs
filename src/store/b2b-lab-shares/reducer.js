import {
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  GET_B2B_LAB_SHARES_LIST_SUCCESS,
  GET_B2B_LAB_SHARES_LIST_FAIL,
  GET_B2B_SHARES_LAB_LIST_SUCCESS,
  GET_B2B_SHARES_LAB_LIST_FAIL,
  UPDATE_LAB_SHARE_SUCCESS,
  UPDATE_LAB_SHARE_FAIL,
  UPDATE_ALL_LAB_SHARE_SUCCESS,
  UPDATE_ALL_LAB_SHARE_FAIL,
  ADD_LAB_SHARE_SUCCESS,
  ADD_LAB_SHARE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  b2bLabSharesList: [],
  labs: [],
  labShares: [],
  b2bLabShares: {},
  error: {},
};

const b2bLabShares = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LABS_SUCCESS:
      return {
        ...state,
        labs: action.payload.data,
      };

    case GET_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_B2B_LAB_SHARES_LIST_SUCCESS:
      return {
        ...state,
        b2bLabSharesList: action.payload.data,
      };

    case GET_B2B_LAB_SHARES_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_B2B_SHARES_LAB_LIST_SUCCESS:
      return {
        ...state,
        b2bLabSharesList: action.payload.data,
      };

    case GET_B2B_SHARES_LAB_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_LAB_SHARE_SUCCESS:
      return {
        ...state,
        labShare: action.payload.data,
      };

    case UPDATE_LAB_SHARE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_ALL_LAB_SHARE_SUCCESS:
      return {
        ...state,
        labShare: action.payload.data,
      };

    case UPDATE_ALL_LAB_SHARE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_LAB_SHARE_SUCCESS:
      return {
        ...state,
        b2bLabShares: [...state.b2bLabShares, action.payload],
      };

    case ADD_LAB_SHARE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default b2bLabShares;
