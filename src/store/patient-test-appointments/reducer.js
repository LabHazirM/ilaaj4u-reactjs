import {
  GET_PATIENT_TEST_APPOINTMENTS_LIST_SUCCESS,
  GET_PATIENT_TEST_APPOINTMENTS_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  patientTestAppointmentsList: [],
  error: {},
};

const patientTestAppointments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PATIENT_TEST_APPOINTMENTS_LIST_SUCCESS:
      return {
        ...state,
        patientTestAppointmentsList: action.payload.data,
      };

    case GET_PATIENT_TEST_APPOINTMENTS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default patientTestAppointments;
