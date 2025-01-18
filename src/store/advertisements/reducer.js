import {
  GET_ADVERTISEMENTS_SUCCESS,
  GET_ADVERTISEMENTS_FAIL,
  ADD_ADVERTISEMENT_SUCCESS,
  ADD_ADVERTISEMENT_FAIL,
  UPDATE_ADVERTISEMENT_SUCCESS,
  UPDATE_ADVERTISEMENT_FAIL,
  DELETE_ADVERTISEMENT_SUCCESS,
  DELETE_ADVERTISEMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  advertisements: [],
  error: {},
};

const advertisements = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ADVERTISEMENTS_SUCCESS:
      return {
        ...state,
        advertisements: action.payload.data,
      };

    case GET_ADVERTISEMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        advertisements: [...state.advertisements, action.payload],
      };

    case ADD_ADVERTISEMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        advertisements: state.advertisements.map(advertisement =>
          advertisement.id.toString() === action.payload.id.toString()
            ? { advertisement, ...action.payload }
            : advertisement
        ),
      };

    case UPDATE_ADVERTISEMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ADVERTISEMENT_SUCCESS:
      return {
        ...state,
        advertisements: state.advertisements.filter(
          advertisement =>
            advertisement.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_ADVERTISEMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default advertisements;
