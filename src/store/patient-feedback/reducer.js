import {
  ADD_PATIENT_FEEDBACK_SUCCESS,
  ADD_PATIENT_FEEDBACK_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  patientFeedback: [],
  error: {},
};

const patientFeedback = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_PATIENT_FEEDBACK_SUCCESS:
      return {
        ...state,
        patientFeedback: [...state.patientFeedback, action.payload],
      };

    case ADD_PATIENT_FEEDBACK_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default patientFeedback;
