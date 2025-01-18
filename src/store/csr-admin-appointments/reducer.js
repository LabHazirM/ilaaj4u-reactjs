import {
  GET_CSR_APPOINTMENTS_SUCCESS,
  GET_CSR_APPOINTMENTS_FAIL,
  UPDATE_CSR_APPOINTMENTS_SUCCESS,
  UPDATE_CSR_APPOINTMENTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  csrAppointments: [],
};

const csrappointments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CSR_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        csrAppointments: action.payload,
      };

    case GET_CSR_APPOINTMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_CSR_APPOINTMENTS_SUCCESS:
    return {
      ...state,
      csrAppointments: state.csrAppointments.map(csrComplaint =>
        csrComplaint.id.toString() === action.payload.id.toString()
          ? { csrComplaint, ...action.payload }
          : csrComplaint
      ),
    };

    case UPDATE_CSR_APPOINTMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

  
    default:
      return state;
  }
};
export default csrappointments;
