import {
  // GET_CLEARED_LABS_SUCCESS,
  // GET_CLEARED_LABS_FAIL,
  // GET_APPROVED_LABS_SUCCESS,
  // GET_APPROVED_LABS_FAIL,
  // GET_UNAPPROVED_LABS_SUCCESS,
  // GET_UNAPPROVED_LABS_FAIL,
  // APPROVE_UNAPPROVE_LAB_SUCCESS,
  // APPROVE_UNAPPROVE_LAB_FAIL,
  GET_CLEARED_IN_PAYMENTS_SUCCESS,
  GET_CLEARED_IN_PAYMENTS_FAIL,
  GET_APPROVED_IN_PAYMENTS_SUCCESS,
  GET_APPROVED_IN_PAYMENTS_FAIL,
  GET_UNAPPROVED_IN_PAYMENTS_SUCCESS,
  GET_UNAPPROVED_IN_PAYMENTS_FAIL,
  UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT_SUCCESS,
  UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT_FAIL,
  GET_ALL_LABS_LIST_SUCCESS,
  GET_ALL_LABS_LIST_FAIL,
  GET_ALL_DONATION_APPOINTMENTS_SUCCESS,
  GET_ALL_DONATION_APPOINTMENTS_FAIL,
  // GET_CLEARED_DONORS_SUCCESS,
  // GET_CLEARED_DONORS_FAIL,
  // GET_APPROVED_DONORS_SUCCESS,
  // GET_APPROVED_DONORS_FAIL,
  // GET_UNAPPROVED_DONORS_SUCCESS,
  // GET_UNAPPROVED_DONORS_FAIL,
  // APPROVE_UNAPPROVE_DONOR_SUCCESS,
  // APPROVE_UNAPPROVE_DONOR_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  // clearedLabs: [],
  // approvedLabs: [],
  // unapprovedLabs: [],
  clearedInPayments: [],
  approvedInPayments: [],
  unapprovedInPayments: [],
  allLabsList: [],
  allDonationAppointment: [],
  // clearedDonors: [],
  // approvedDonors: [],
  // unapprovedDonors: [],
  success: [],
  error: {},
};

const financeAdmin = (state = INIT_STATE, action) => {
  switch (action.type) {
    // case GET_CLEARED_LABS_SUCCESS:
    //   return {
    //     ...state,
    //     clearedLabs: action.payload.data,
    //   };

    // case GET_CLEARED_LABS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    // case GET_APPROVED_LABS_SUCCESS:
    //   return {
    //     ...state,
    //     approvedLabs: action.payload.data,
    //   };

    // case GET_APPROVED_LABS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    // case GET_UNAPPROVED_LABS_SUCCESS:
    //   return {
    //     ...state,
    //     unapprovedLabs: action.payload.data,
    //   };

    // case GET_UNAPPROVED_LABS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    // case APPROVE_UNAPPROVE_LAB_SUCCESS:
    //   return {
    //     ...state,
    //     success: [...state.success, action.payload],
    //   };

    // case APPROVE_UNAPPROVE_LAB_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    case GET_ALL_DONATION_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        allDonationAppointment: action.payload.data,
      };

    case GET_ALL_DONATION_APPOINTMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ALL_LABS_LIST_SUCCESS:
      return {
        ...state,
        allLabsList: action.payload.data,
      };

    case GET_ALL_LABS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CLEARED_IN_PAYMENTS_SUCCESS:
      return {
        ...state,
        clearedInPayments: action.payload.data,
      };

    case GET_CLEARED_IN_PAYMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_APPROVED_IN_PAYMENTS_SUCCESS:
      return {
        ...state,
        approvedInPayments: action.payload.data,
      };

    case GET_APPROVED_IN_PAYMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNAPPROVED_IN_PAYMENTS_SUCCESS:
      return {
        ...state,
        unapprovedInPayments: action.payload.data,
      };

    case GET_UNAPPROVED_IN_PAYMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // case GET_CLEARED_DONORS_SUCCESS:
    //   return {
    //     ...state,
    //     clearedDonors: action.payload.data,
    //   };

    // case GET_CLEARED_DONORS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    // case GET_APPROVED_DONORS_SUCCESS:
    //   return {
    //     ...state,
    //     approvedDonors: action.payload.data,
    //   };

    // case GET_APPROVED_DONORS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    // case GET_UNAPPROVED_DONORS_SUCCESS:
    //   return {
    //     ...state,
    //     unapprovedDonors: action.payload.data,
    //   };

    // case GET_UNAPPROVED_DONORS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    // case APPROVE_UNAPPROVE_DONOR_SUCCESS:
    //   return {
    //     ...state,
    //     success: [...state.success, action.payload],
    //   };

    // case APPROVE_UNAPPROVE_DONOR_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    default:
      return state;
  }
};

export default financeAdmin;
