import {
  GET_NOTES_SUCCESS,
  GET_NOTES_FAIL,
  ADD_NOTE_SUCCESS,
  ADD_NOTE_FAIL,
  GET_NOTES_COMPLAINT_SUCCESS,
  GET_NOTES_COMPLAINT_FAIL,
  ADD_NOTE_COMPLAINT_SUCCESS,
  ADD_NOTE_COMPLAINT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  notes: [],
  error: {},
};

const notes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NOTES_SUCCESS:
      return {
        ...state,
        notes: action.payload.data,
      };

    case GET_NOTES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_NOTE_SUCCESS:
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };

    case ADD_NOTE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_NOTES_COMPLAINT_SUCCESS:
        return {
          ...state,
          notes: action.payload.data,
        };
  
      case GET_NOTES_COMPLAINT_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_NOTE_COMPLAINT_SUCCESS:
        return {
          ...state,
          notes: [...state.notes, action.payload],
        };
  
      case ADD_NOTE_COMPLAINT_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    

    default:
      return state;
  }
};

export default notes;
