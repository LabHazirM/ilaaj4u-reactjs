import {
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  ADD_DOCTOR_INFORMATION,
  ADD_DOCTOR_INFORMATION_SUCCESSFUL,
  ADD_DOCTOR_INFORMATION_FAILED,
} from "./actionTypes"

const initialState = {
  doctor: null, 
  addDoctorError: null,
  territoriesList: [],
  message: null,
  loading: false,
}

const doctorInformation = (state = initialState, action) => {
  switch (action.type) {
    // territories
    case GET_TERRITORIES_LIST_SUCCESS:
      return {
        ...state,
        territoriesList: action.payload.data,
      };

    case GET_TERRITORIES_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
// b2b client
    case ADD_DOCTOR_INFORMATION:
      state = {
        ...state,
        doctor: null,
        loading: true,
        addDoctorError: null,
      }
      break
    case ADD_DOCTOR_INFORMATION_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        doctor: action.payload,
        addDoctorError: null,
      }
      break
    case ADD_DOCTOR_INFORMATION_FAILED:
      state = {
        ...state,
        doctor: null,
        loading: false,
        addDoctorError: action.payload.doctor
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default doctorInformation
