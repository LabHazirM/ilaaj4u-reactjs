import {
  GET_LABS_LIST_SUCCESS,
  GET_LABS_LIST_FAIL,
  GET_LABS_AUDIT_LIST_SUCCESS,
  GET_LABS_AUDIT_LIST_FAIL,
  GET_DONORS_LIST_SUCCESS,
  GET_DONORS_LIST_FAIL,
  GET_DONORSA_SUCCESS,
  GET_DONORSA_FAIL,
  GET_LC_LIST_SUCCESS,
  GET_LC_LIST_FAIL,
  GET_CORPORATE_LIST_SUCCESS,
  GET_CORPORATE_LIST_FAIL,
  GET_LABS_ALL_AUDIT_LIST_SUCCESS,
  GET_LABS_ALL_AUDIT_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  labsList: [],
  donors: [],
  error: {},
  labaudit:[]
};

const labs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LABS_LIST_SUCCESS:
      return {
        ...state,
        labsList: action.payload.data,
      };

    case GET_LABS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LABS_AUDIT_LIST_SUCCESS:
      return {
        ...state,
        labsList: action.payload.data,
      };

    case GET_LABS_AUDIT_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LABS_ALL_AUDIT_LIST_SUCCESS:
      return {
        ...state,
        labaudit: action.payload.data,
      };

    case GET_LABS_ALL_AUDIT_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DONORS_LIST_SUCCESS:
      return {
        ...state,
        labsList: action.payload.data,
      };

    case GET_DONORS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_CORPORATE_LIST_SUCCESS:
      return {
        ...state,
        labsList: action.payload.data,
      };

    case GET_CORPORATE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      ///////////////
      case GET_LC_LIST_SUCCESS:
      return {
        ...state,
        labsList: action.payload.data,
      };

    case GET_LC_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      /////////////
    case GET_DONORSA_SUCCESS:
      return {
        ...state,
        labsList: action.payload.data,
      };
  
    case GET_DONORSA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default labs;
