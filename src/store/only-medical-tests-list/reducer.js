import {
  GET_ONLY_MEDICAL_LIST_SUCCESS,
  GET_ONLY_MEDICAL_LIST_FAIL,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  onlyMedicalTestList: [],
  territoriesList: [],
  error: {},
};

const onlyMedicalTestList = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ONLY_MEDICAL_LIST_SUCCESS:
      return {
        ...state,
        onlyMedicalTestList: action.payload.data,
      };

    case GET_ONLY_MEDICAL_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

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

    default:
      return state;
  }
};


export default onlyMedicalTestList;
