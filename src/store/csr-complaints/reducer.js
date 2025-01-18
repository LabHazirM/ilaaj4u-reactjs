import {
  GET_CSR_COMPLAINTS_SUCCESS,
  GET_CSR_COMPLAINTS_FAIL,
  UPDATE_CSR_COMPLAINTS_SUCCESS,
  UPDATE_CSR_COMPLAINTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  csrComplaints: [],
};

const csrcomplaints = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CSR_COMPLAINTS_SUCCESS:
      // console.log("Reducer Dataaaaaaaaaaaa:", action.payload);
      return {
        ...state,
        csrComplaints: action.payload,
      };

    case GET_CSR_COMPLAINTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_CSR_COMPLAINTS_SUCCESS:
    return {
      ...state,
      csrComplaints: state.csrComplaints.map(csrComplaint =>
        csrComplaint.id.toString() === action.payload.id.toString()
          ? { csrComplaint, ...action.payload }
          : csrComplaint
      ),
    };

    case UPDATE_CSR_COMPLAINTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

  
    default:
      return state;
  }
};
export default csrcomplaints;
