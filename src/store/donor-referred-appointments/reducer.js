import {
  GET_DONOR_REFERRED_APPOINTMENTS_LIST_SUCCESS,
  GET_DONOR_REFERRED_APPOINTMENTS_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  donorReferredAppointmentsList: [],
  error: {},
};

const donorReferredAppointments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DONOR_REFERRED_APPOINTMENTS_LIST_SUCCESS:
      return {
        ...state,
        donorReferredAppointmentsList: action.payload.data,
      };

    case GET_DONOR_REFERRED_APPOINTMENTS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default donorReferredAppointments;
