import {
  GET_PENDING_AUDITS_SUCCESS,
  GET_PENDING_AUDITS_FAIL,
  GET_INPROCESS_AUDITS_SUCCESS,
  GET_INPROCESS_AUDITS_FAIL,
  GET_PASSED_AUDITS_SUCCESS,
  GET_PASSED_AUDITS_FAIL,
  GET_FAILED_AUDITS_SUCCESS,
  GET_FAILED_AUDITS_FAIL,
  ASSIGN_AUDIT_SUCCESS,
  ASSIGN_AUDIT_FAIL,
  ADD_LABS_AUDIT_SUCCESS,
  ADD_LABS_AUDIT_FAIL
} from "./actionTypes";

const INIT_STATE = {
  pendingAudits: [],
  inProcessAudits: [],
  passedAudits: [],
  failedAudits: [],
  success: [],
  error: {},
};

const auditorAdmin = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PENDING_AUDITS_SUCCESS:
      return {
        ...state,
        pendingAudits: action.payload.data,
      };

    case GET_PENDING_AUDITS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_INPROCESS_AUDITS_SUCCESS:
      return {
        ...state,
        inProcessAudits: action.payload.data,
      };

    case GET_INPROCESS_AUDITS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PASSED_AUDITS_SUCCESS:
      return {
        ...state,
        passedAudits: action.payload.data,
      };

    case GET_PASSED_AUDITS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_FAILED_AUDITS_SUCCESS:
      return {
        ...state,
        failedAudits: action.payload.data,
      };

    case GET_FAILED_AUDITS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ASSIGN_AUDIT_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case ASSIGN_AUDIT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_LABS_AUDIT_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case ADD_LABS_AUDIT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default auditorAdmin;
