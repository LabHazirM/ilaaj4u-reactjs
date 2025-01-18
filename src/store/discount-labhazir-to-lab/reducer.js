import {
  GET_DISCOUNT_LABHAZIRTOLABS_SUCCESS,
  GET_DISCOUNT_LABHAZIRTOLABS_FAIL,
  UPDATE_DISCOUNT_LABHAZIRTOLAB_SUCCESS,
  UPDATE_DISCOUNT_LABHAZIRTOLAB_FAIL,
  UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB_SUCCESS,
  UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  discountLabHazirToLabs: [],
  error: {},
};

const discountLabHazirToLabs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DISCOUNT_LABHAZIRTOLABS_SUCCESS:
      return {
        ...state,
        discountLabHazirToLabs: action.payload.data,
      };

    case GET_DISCOUNT_LABHAZIRTOLABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DISCOUNT_LABHAZIRTOLAB_SUCCESS:
      return {
        ...state,
        discountLabHazirToLabs: state.discountLabHazirToLabs.map(discountLabHazirToLab =>
          discountLabHazirToLab.id.toString() === action.payload.id.toString()
            ? { discountLabHazirToLab, ...action.payload }
            : discountLabHazirToLab
        ),
      };

    case UPDATE_DISCOUNT_LABHAZIRTOLAB_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB_SUCCESS:
      return {
        ...state,
        discountLabHazirToLabs: state.discountLabHazirToLabs.map(discountAllLabHazir =>
          discountAllLabHazir.id.toString() === action.payload.id.toString()
            ? { discountAllLabHazir, ...action.payload }
            : discountAllLabHazir
        ),
      };

    case UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default discountLabHazirToLabs;
