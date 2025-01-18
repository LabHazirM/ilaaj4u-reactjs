import {
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  GET_CORPORATES_LIST_SUCCESS,
  GET_CORPORATES_LIST_FAIL,
  ADD_PATIENT_INFORMATION,
  ADD_PATIENT_INFORMATION_SUCCESSFUL,
  ADD_PATIENT_INFORMATION_FAILED,
} from "./actionTypes"

const initialState = {
  addPatientError: null,
  territoriesList: [],
  corporatesList: [],
  message: null,
  loading: false,
}

const patientInformation = (state = initialState, action) => {
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
    // CORPORATES
    case GET_CORPORATES_LIST_SUCCESS:
      return {
        ...state,
        corporatesList: action.payload.data,
      };

    case GET_CORPORATES_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      
    case ADD_PATIENT_INFORMATION:
      state = {
        ...state,
        patient: null,
        loading: true,
        addPatientError: null,
      }
      break
    case ADD_PATIENT_INFORMATION_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        patient: action.payload,
        addPatientError: null,
      }
      break
    case ADD_PATIENT_INFORMATION_FAILED:
      state = {
        ...state,
        patient: null,
        loading: false,
        addPatientError: action.payload.patient
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default patientInformation
