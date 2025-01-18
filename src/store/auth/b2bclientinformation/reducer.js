import {
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  ADD_B2BCLIENT_INFORMATION,
  ADD_B2BCLIENT_INFORMATION_SUCCESSFUL,
  ADD_B2BCLIENT_INFORMATION_FAILED,
} from "./actionTypes"

const initialState = {
  addB2bClientError: null,
  territoriesList: [],
  message: null,
  loading: false,
}

const b2bclientInformation = (state = initialState, action) => {
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
    case ADD_B2BCLIENT_INFORMATION:
      state = {
        ...state,
        b2bclient: null,
        loading: true,
        addB2bClientError: null,
      }
      break
    case ADD_B2BCLIENT_INFORMATION_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        b2bclient: action.payload,
        addB2bClientError: null,
      }
      break
    case ADD_B2BCLIENT_INFORMATION_FAILED:
      state = {
        ...state,
        b2bclient: null,
        loading: false,
        addB2bClientError: action.payload.b2bclient
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default b2bclientInformation
