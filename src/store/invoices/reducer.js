import {
  GET_INVOICE_DETAIL_SUCCESS,
  GET_INVOICE_DETAIL_FAIL,
   ///////////
  GET_TESTS_IN_APPOINTMENTS_SUCCESS,
  GET_TESTS_IN_APPOINTMENTS_FAIL,
  DELETE_TESTS_IN_APPOINTMENTS_SUCCESS,
  DELETE_TESTS_IN_APPOINTMENTS_FAIL,
  GET_ADVINVOICE_DETAIL_SUCCESS,
  GET_ADVINVOICE_DETAIL_FAIL,
  UPDATE_PAYMENT_INFO_SUCCESS,
  UPDATE_PAYMENT_INFO_FAIL,

} from "./actionTypes";

const INIT_STATE = {
  invoiceDetail: {},
  testsinappointments:[],
  cemployees: [],
  advinvoiceDetail: {},
  paymentDetail: {},
  error: {},
};

const invoices = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INVOICE_DETAIL_SUCCESS:
      return {
        ...state,
        invoiceDetail: action.payload.data,
      };

    case GET_INVOICE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };


    ////////////

    case DELETE_TESTS_IN_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        cemployees: state.cemployees.filter(
          cemployee =>
            cemployee.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_TESTS_IN_APPOINTMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TESTS_IN_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        testsinappointments: action.payload.data,
      };

    case GET_TESTS_IN_APPOINTMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      ///////////
    case GET_ADVINVOICE_DETAIL_SUCCESS:
      return {
        ...state,
        advinvoiceDetail: action.payload.data,
      };

    case GET_ADVINVOICE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };


    case UPDATE_PAYMENT_INFO_SUCCESS:
      return {
        ...state,
        paymentDetail: action.payload.data,
      };

    case UPDATE_PAYMENT_INFO_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default invoices;
