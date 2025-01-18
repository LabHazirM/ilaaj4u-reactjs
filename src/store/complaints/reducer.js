import {
  ADD_COMPLAINT_SUCCESS,
  ADD_COMPLAINT_FAIL,
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  GET_HANDLED_COMPLAINTS_SUCCESS,
  GET_HANDLED_COMPLAINTS_FAIL,
  GET_UNHANDLED_COMPLAINTS_SUCCESS,
  GET_UNHANDLED_COMPLAINTS_FAIL,
  UPDATE_UNHANDLED_COMPLAINTS_SUCCESS,
  UPDATE_UNHANDLED_COMPLAINTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  complaint: [],
  labs:[],
  handledComplaints: [],
  unhandledComplaints: [],
  error: {},
};

const complaints = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_COMPLAINT_SUCCESS:
      return {
        ...state,
        complaint: [...state.complaint, action.payload],
      };

    case ADD_COMPLAINT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
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

    case GET_HANDLED_COMPLAINTS_SUCCESS:
      return {
        ...state,
        handledComplaints: action.payload,
      };

    case GET_HANDLED_COMPLAINTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNHANDLED_COMPLAINTS_SUCCESS:
      console.log("action.payload: ", action.payload);
      return {
        ...state,
        unhandledComplaints: action.payload,
      };

    case GET_UNHANDLED_COMPLAINTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_UNHANDLED_COMPLAINTS_SUCCESS:
      return {
        ...state,
        sucess: state.sucess.map(sucess =>
          sucess.id.toString() === action.payload.id.toString()
            ? { sucess, ...action.payload }
            : sucess
        ),
      };

    case UPDATE_UNHANDLED_COMPLAINTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default complaints;
