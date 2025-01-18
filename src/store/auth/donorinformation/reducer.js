import {
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  ADD_DONOR_INFORMATION,
  ADD_DONOR_INFORMATION_SUCCESSFUL,
  ADD_DONOR_INFORMATION_FAILED,
} from "./actionTypes"

const initialState = {
  territoriesList: [],
  addDonorError: null,
  message: null,
  loading: false,
}

const donorInformation = (state = initialState, action) => {
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

    case ADD_DONOR_INFORMATION:
      state = {
        ...state,
        donor: null,
        loading: true,
        addDonorError: null,
      }
      break
    case ADD_DONOR_INFORMATION_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        donor: action.payload,
        addDonorError: null,
      }
      break
    case ADD_DONOR_INFORMATION_FAILED:
      state = {
        ...state,
        donor: null,
        loading: false,
        addDonorError: action.payload.donor
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default donorInformation
