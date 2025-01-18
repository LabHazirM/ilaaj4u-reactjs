import {
  GET_LABS_MOF_SUCCESS,
  GET_LABS_MOF_FAIL,
  GET_LABS_C_SUCCESS,
  GET_LABS_C_FAIL,
  GET_LIST_DONATIONAPPOINTMENT_SUCCESS,
  GET_LIST_DONATIONAPPOINTMENT_FAIL,
  GET_LIST_CLABS_SUCCESS,
  GET_LIST_CLABS_FAIL,
  GET_LIST_INVOICE_SUCCESS,
  GET_LIST_INVOICE_FAIL,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  GET_BANK_ACCOUNTS_SUCCESS,
  GET_BANK_ACCOUNTS_FAIL,
  GET_B2B_CLIENTS_SUCCESS,
  GET_B2B_CLIENTS_FAIL,
  GET_OUT_PAYMENT_SUCCESS,
  GET_OUT_PAYMENT_FAIL,
  ADD_OUT_PAYMENT_SUCCESS,
  ADD_OUT_PAYMENT_FAIL,
  ADD_CORPORATE_PAYMENT_SUCCESS,
  ADD_CORPORATE_PAYMENT_FAIL,
  ADD_INVOICE_ADJUSTMENT_SUCCESS,
  ADD_INVOICE_ADJUSTMENT_FAIL,
  GET_STAFF_PROFILE_SUCCESS,
  GET_STAFF_PROFILE_FAIL,
  GET_CORPORATE_PROFILE_SUCCESS,
  GET_CORPORATE_PROFILE_FAIL
} from "./actionTypes";

const INIT_STATE = {
  listCLabs: [],
  corporateProfiles: [],
  staffProfiles: [],
  outPayments: [],
  b2bClients: [],
  outPayment: [],
  bankAccounts: [],
  banks: [],
  labsMof: [],
  listDonation: [],
  listInvoice: [],
  error: {},
};

const outPayments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CORPORATE_PROFILE_SUCCESS:
      return {
        ...state,
        corporateProfiles: action.payload.data,
      };

    case GET_CORPORATE_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_STAFF_PROFILE_SUCCESS:
      return {
        ...state,
        staffProfiles: action.payload.data,
      };

    case GET_STAFF_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_BANK_ACCOUNTS_SUCCESS:
      return {
        ...state,
        bankAccounts: action.payload.data,
      };

    case GET_BANK_ACCOUNTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_BANKS_SUCCESS:
      return {
        ...state,
        banks: action.payload.data,
      };

    case GET_BANKS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LABS_MOF_SUCCESS:
      return {
        ...state,
        labsMof: action.payload.data,
      };

    case GET_LABS_MOF_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LIST_DONATIONAPPOINTMENT_SUCCESS:
      return {
        ...state,
        listDonation: action.payload.data,
      };

    case GET_LIST_DONATIONAPPOINTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LIST_CLABS_SUCCESS:
      return {
        ...state,
        listCLabs: action.payload.data,
      };

    case GET_LIST_CLABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LABS_C_SUCCESS:
      return {
        ...state,
        labsMof: action.payload.data,
      };

    case GET_LABS_C_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LIST_INVOICE_SUCCESS:
      return {
        ...state,
        listInvoice: action.payload.data,
      };

    case GET_LIST_INVOICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_B2B_CLIENTS_SUCCESS:
        return {
          ...state,
          b2bClients: action.payload.data,
        };
  
      case GET_B2B_CLIENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_OUT_PAYMENT_SUCCESS:
      return {
        ...state,
        outPayments: action.payload.data,
      };

    case GET_OUT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };                

    case ADD_OUT_PAYMENT_SUCCESS:
      return {
        ...state,
        outPayments: [...state.outPayments, action.payload.data],
      };

    case ADD_OUT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_CORPORATE_PAYMENT_SUCCESS:
      return {
        ...state,
        outPayments: [...state.outPayments, action.payload.data],
      };

    case ADD_CORPORATE_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_INVOICE_ADJUSTMENT_SUCCESS:
      return {
        ...state,
        outPayments: [...state.outPayments, action.payload.data],
      };

    case ADD_INVOICE_ADJUSTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default outPayments;
