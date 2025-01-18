import {
  GET_ADVERTISEMENT_PRICE_LISTS_SUCCESS,
  GET_ADVERTISEMENT_PRICE_LISTS_FAIL,
  ADD_ADVERTISEMENT_PRICE_LIST_SUCCESS,
  ADD_ADVERTISEMENT_PRICE_LIST_FAIL,
  UPDATE_ADVERTISEMENT_PRICE_LIST_SUCCESS,
  UPDATE_ADVERTISEMENT_PRICE_LIST_FAIL,
  DELETE_ADVERTISEMENT_PRICE_LIST_SUCCESS,
  DELETE_ADVERTISEMENT_PRICE_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  advertisementPriceLists: [],
  error: {},
};

const advertisementPriceLists = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ADVERTISEMENT_PRICE_LISTS_SUCCESS:
      return {
        ...state,
        advertisementPriceLists: action.payload.data,
      };

    case GET_ADVERTISEMENT_PRICE_LISTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ADVERTISEMENT_PRICE_LIST_SUCCESS:
      return {
        ...state,
        advertisementPriceLists: [...state.advertisementPriceLists, action.payload],
      };

    case ADD_ADVERTISEMENT_PRICE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ADVERTISEMENT_PRICE_LIST_SUCCESS:
      return {
        ...state,
        advertisementPriceLists: state.advertisementPriceLists.map(advertisementPriceList =>
          advertisementPriceList.id.toString() === action.payload.id.toString()
            ? { advertisementPriceList, ...action.payload }
            : advertisementPriceList
        ),
      };

    case UPDATE_ADVERTISEMENT_PRICE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ADVERTISEMENT_PRICE_LIST_SUCCESS:
      return {
        ...state,
        advertisementPriceLists: state.advertisementPriceLists.filter(
          advertisementPriceList =>
            advertisementPriceList.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_ADVERTISEMENT_PRICE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default advertisementPriceLists;
