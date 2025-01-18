import {
  GET_ADV_INVOICE_SUCCESS,
  GET_ADV_INVOICE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  advinvoice: [],
  error: {},
};

const advinvoice = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ADV_INVOICE_SUCCESS:
      return {
        ...state,
        advinvoice: action.payload.data,
      };

    case GET_ADV_INVOICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default advinvoice;
