import {
  GET_PATHOLOGISTS_SUCCESS,
  GET_PATHOLOGISTS_FAIL,
  ADD_PATHOLOGIST_SUCCESS,
  ADD_PATHOLOGIST_FAIL,
  UPDATE_PATHOLOGIST_SUCCESS,
  UPDATE_PATHOLOGIST_FAIL,
  DELETE_PATHOLOGIST_SUCCESS,
  DELETE_PATHOLOGIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  pathologists: [],
  error: {},
};

const pathologists = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PATHOLOGISTS_SUCCESS:
      return {
        ...state,
        pathologists: action.payload.data,
      };

    case GET_PATHOLOGISTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_PATHOLOGIST_SUCCESS:
      return {
        ...state,
        pathologists: [...state.pathologists, action.payload],
      };

    case ADD_PATHOLOGIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PATHOLOGIST_SUCCESS:
      return {
        ...state,
        pathologists: state.pathologists.map(pathologist =>
          pathologist.id.toString() === action.payload.id.toString()
            ? { pathologist, ...action.payload }
            : pathologist
        ),
      };

    case UPDATE_PATHOLOGIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PATHOLOGIST_SUCCESS:
      return {
        ...state,
        pathologists: state.pathologists.filter(
          pathologist =>
            pathologist.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_PATHOLOGIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default pathologists;
