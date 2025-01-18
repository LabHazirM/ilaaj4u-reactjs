import {
  GET_B2B_REFERRED_PATIENTS_LIST_SUCCESS,
  GET_B2B_REFERRED_PATIENTS_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  b2bReferredPatientsList: [],
  error: {},
};

const b2bReferredPatients = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_B2B_REFERRED_PATIENTS_LIST_SUCCESS:
      return {
        ...state,
        b2bReferredPatientsList: action.payload.data,
      };

    case GET_B2B_REFERRED_PATIENTS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default b2bReferredPatients;
