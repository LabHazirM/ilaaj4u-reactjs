import {
  GET_ASSIGNED_AUDITS_SUCCESS,
  GET_ASSIGNED_AUDITS_FAIL,
  GET_LAB_AUDITS_SUCCESS,
  GET_LAB_AUDITS_FAIL,
  ADD_AUDIT_SUCCESS,
  ADD_AUDIT_FAIL,
  GET_AUDITORS_COMPLETED_AUDITS_SUCCESS,
  GET_AUDITORS_COMPLETED_AUDITS_FAIL,
  UPDATE_ASSIGNED_AUDITS_SUCCESS,
  UPDATE_ASSIGNED_AUDITS_FAIL,
  UPDATE_AUDITS_STATUS_SUCCESS,
  UPDATE_AUDITS_STATUS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  assignedAudits: [],
  labAudits: [],
  completedAudits: [],
  error: "",
  success: "",
};

const audits = (state = INIT_STATE, action) => {
  switch (action.type) {

    case UPDATE_AUDITS_STATUS_SUCCESS:
      return {
        ...state,
        audit: state.audit.map(audit =>
          audit.id.toString() === action.payload.id.toString()
            ? { audit, ...action.payload }
            : audit
        ),
      };

    case UPDATE_AUDITS_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ASSIGNED_AUDITS_SUCCESS:
      return {
        ...state,
        assignedAudits: action.payload,
      };
    case GET_ASSIGNED_AUDITS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case ADD_AUDIT_SUCCESS:
        return {
          ...state,
          audits: [...state.audits, action.payload],
        };
      case ADD_AUDIT_FAIL:
        return {
          ...state,
          error: action.payload,
        };

      case GET_LAB_AUDITS_SUCCESS:
        return {
          ...state,
          labAudits: action.payload,
        };
  
      case GET_LAB_AUDITS_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    case UPDATE_ASSIGNED_AUDITS_SUCCESS:
      return {
        ...state,
        success: state.success.map(success =>
          success.id.toString() === action.payload.id.toString()
            ? { success, ...action.payload }
            : success
        ),
      };

    case UPDATE_ASSIGNED_AUDITS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_AUDITORS_COMPLETED_AUDITS_SUCCESS:
      return {
        ...state,
        completedAudits: action.payload,
      };

    case GET_AUDITORS_COMPLETED_AUDITS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default audits;
