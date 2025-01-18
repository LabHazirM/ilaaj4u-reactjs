import {
  GET_LABCORPORATE_SUCCESS,
  GET_LABCORPORATE_FAIL,
  GET_ALABCORPORATE_SUCCESS,
  GET_ALABCORPORATE_FAIL,
  GET_ACORPORATE_SUCCESS,
  GET_ACORPORATE_FAIL,
  GET_RFEECORPORATE_SUCCESS,
  GET_RFEECORPORATE_FAIL,
  GET_EMPLOYEECORPORATE_SUCCESS,
  GET_EMPLOYEECORPORATE_FAIL,
  GET_LABSCORPORATE_SUCCESS,
  GET_LABSCORPORATE_FAIL,
  ADD_CEMPLOYEE_DATA_SUCCESS,
  ADD_CEMPLOYEE_DATA_FAIL,
  ADD_CEMPLOYEE_FILE_SUCCESS,
  ADD_CEMPLOYEE_FILE_FAIL,
  UPDATE_CEMPLOYEE_SUCCESS,
  UPDATE_CEMPLOYEE_FAIL,
  DELETE_CEDATA_SUCCESS,
  DELETE_CEDATA_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  cemployeeDatas: [],
  cemployee: [],
  cemployees: [],
  error: {},
};

const cemployeeDatas = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LABCORPORATE_SUCCESS:
      return {
        ...state,
        cemployeeDatas: action.payload.data,
      };

    case GET_LABCORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_ALABCORPORATE_SUCCESS:
      return {
        ...state,
        cemployeeDatas: action.payload.data,
      };

    case GET_ALABCORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_ACORPORATE_SUCCESS:
      return {
        ...state,
        cemployeeDatas: action.payload.data,
      };

    case GET_ACORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_RFEECORPORATE_SUCCESS:
      return {
        ...state,
        cemployeeDatas: action.payload.data,
      };

    case GET_RFEECORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_EMPLOYEECORPORATE_SUCCESS:
      return {
        ...state,
        cemployeeDatas: action.payload.data,
      };

    case GET_EMPLOYEECORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LABSCORPORATE_SUCCESS:
      return {
        ...state,
        cemployeeDatas: action.payload.data,
      };

    case GET_LABSCORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CEMPLOYEE_DATA_SUCCESS:
      return {
        ...state,
        cemployeeDatas: [...state.cemployeeDatas, action.payload.data],
      };

    case ADD_CEMPLOYEE_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CEMPLOYEE_FILE_SUCCESS:
      return {
        ...state,
        cemployeeDatas: [...state.cemployeeDatas, action.payload.data],
      };

    case ADD_CEMPLOYEE_FILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    case UPDATE_CEMPLOYEE_SUCCESS:
      return {
        ...state,
        cemployees: state.cemployees.map(cemployee =>
          cemployee.id.toString() === action.payload.id.toString()
            ? { cemployee, ...action.payload }
            : cemployee
        ),
      };

    case UPDATE_CEMPLOYEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_CEDATA_SUCCESS:
      return {
        ...state,
        cemployees: state.cemployees.filter(
          cemployee =>
            cemployee.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_CEDATA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default cemployeeDatas;
