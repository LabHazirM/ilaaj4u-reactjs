import {
  GET_PENDING_COMPLAINTS_SUCCESS,
  GET_PENDING_COMPLAINTS_FAIL,
  GET_PENDING_COMPLAINTS_LABHAZIR_SUCCESS,
  GET_PENDING_COMPLAINTS_LABHAZIR_FAIL,
  GET_INPROCESS_COMPLAINTS_SUCCESS,
  GET_INPROCESS_COMPLAINTS_FAIL,
  GET_INPROCESS_COMPLAINTS_LABHAZIR_SUCCESS,
  GET_INPROCESS_COMPLAINTS_LABHAZIR_FAIL,
  GET_RESOLVED_COMPLAINTS_SUCCESS,
  GET_RESOLVED_COMPLAINTS_FAIL,
  GET_RESOLVED_COMPLAINTS_LABHAZIR_SUCCESS,
  GET_RESOLVED_COMPLAINTS_LABHAZIR_FAIL,
  ASSIGN_COMPLAINT_SUCCESS,
  ASSIGN_COMPLAINT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  pendingComplaints: [],
  pendingComplaintsLabhazir:[],
  inProcessComplaints: [],
  inProcessComplaintsLabhazir:[],
  resolvedComplaints: [],
  resolvedComplaintsLabhazir:[],
  success: [],
  error: {},
};

const csrAdmin = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PENDING_COMPLAINTS_SUCCESS:
      return {
        ...state,
        pendingComplaints: action.payload.data,
      };

    case GET_PENDING_COMPLAINTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_PENDING_COMPLAINTS_LABHAZIR_SUCCESS:
        return {
          ...state,
          pendingComplaintsLabhazir: action.payload.data,
        };
  
      case GET_PENDING_COMPLAINTS_LABHAZIR_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_INPROCESS_COMPLAINTS_SUCCESS:
      return {
        ...state,
        inProcessComplaints: action.payload.data,
      };

    case GET_INPROCESS_COMPLAINTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_INPROCESS_COMPLAINTS_LABHAZIR_SUCCESS:
        return {
          ...state,
          inProcessComplaintsLabhazir: action.payload.data,
        };
  
      case GET_INPROCESS_COMPLAINTS_LABHAZIR_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_RESOLVED_COMPLAINTS_SUCCESS:
      return {
        ...state,
        resolvedComplaints: action.payload.data,
      };

    case GET_RESOLVED_COMPLAINTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_RESOLVED_COMPLAINTS_LABHAZIR_SUCCESS:
      return {
        ...state,
        resolvedComplaintsLabhazir: action.payload.data,
      };

    case GET_RESOLVED_COMPLAINTS_LABHAZIR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ASSIGN_COMPLAINT_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case ASSIGN_COMPLAINT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default csrAdmin;
