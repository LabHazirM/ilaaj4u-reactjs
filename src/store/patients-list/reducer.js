import {
  GET_PATIENTS_LIST_SUCCESS,
  GET_PATIENTS_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  patientsList: [],
  error: {},
};

const patients = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PATIENTS_LIST_SUCCESS:
      return {
        ...state,
        patientsList: action.payload.data,
      };

    case GET_PATIENTS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default patients;
