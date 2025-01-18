import {
  GET_PENDING_CORPORATE_SUCCESS,
  GET_PENDING_CORPORATE_FAIL,
  GET_APPROVED_CORPORATE_SUCCESS,
  GET_APPROVED_CORPORATE_FAIL,
  GET_UNAPPROVED_CORPORATE_SUCCESS,
  GET_UNAPPROVED_CORPORATE_FAIL,
  APPROVE_UNAPPROVE_CORPORATE_SUCCESS,
  APPROVE_UNAPPROVE_CORPORATE_FAIL,

  GET_PENDING_LABS_SUCCESS,
  GET_PENDING_LABS_FAIL,
  GET_APPROVED_LABS_SUCCESS,
  GET_APPROVED_LABS_FAIL,
  GET_UNAPPROVED_LABS_SUCCESS,
  GET_UNAPPROVED_LABS_FAIL,
  APPROVE_UNAPPROVE_LAB_SUCCESS,
  APPROVE_UNAPPROVE_LAB_FAIL,
  GET_PENDING_B2B_CLIENTS_SUCCESS,
  GET_PENDING_B2B_CLIENTS_FAIL,
  GET_APPROVED_B2B_CLIENTS_SUCCESS,
  GET_APPROVED_B2B_CLIENTS_FAIL,
  GET_UNAPPROVED_B2B_CLIENTS_SUCCESS,
  GET_UNAPPROVED_B2B_CLIENTS_FAIL,
  APPROVE_UNAPPROVE_B2B_CLIENT_SUCCESS,
  APPROVE_UNAPPROVE_B2B_CLIENT_FAIL,
  GET_PENDING_DONORS_SUCCESS,
  GET_PENDING_DONORS_FAIL,
  GET_APPROVED_DONORS_SUCCESS,
  GET_APPROVED_DONORS_FAIL,
  GET_UNAPPROVED_DONORS_SUCCESS,
  GET_UNAPPROVED_DONORS_FAIL,
  APPROVE_UNAPPROVE_DONOR_SUCCESS,
  APPROVE_UNAPPROVE_DONOR_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  pendingCorporate: [],
  approvedCorporate: [],
  UnapprovedCorporate: [],

  pendingLabs: [],
  approvedLabs: [],
  unapprovedLabs: [],
  pendingB2BClients: [],
  approvedB2BClients: [],
  unapprovedB2BClients: [],
  pendingDonors: [],
  approvedDonors: [],
  unapprovedDonors: [],
  success: [],
  error: {},
};

const registrationAdmin = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_PENDING_CORPORATE_SUCCESS:
      return {
        ...state,
        pendingCorporate: action.payload.data,
      };

    case GET_PENDING_CORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_APPROVED_CORPORATE_SUCCESS:
      return {
        ...state,
        approvedCorporate: action.payload.data,
      };

    case GET_APPROVED_CORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_UNAPPROVED_CORPORATE_SUCCESS:
      return {
        ...state,
        UnapprovedCorporate: action.payload.data,
      };

    case GET_UNAPPROVED_CORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case APPROVE_UNAPPROVE_CORPORATE_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case APPROVE_UNAPPROVE_CORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PENDING_LABS_SUCCESS:
      return {
        ...state,
        pendingLabs: action.payload.data,
      };

    case GET_PENDING_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_APPROVED_LABS_SUCCESS:
      return {
        ...state,
        approvedLabs: action.payload.data,
      };

    case GET_APPROVED_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNAPPROVED_LABS_SUCCESS:
      return {
        ...state,
        unapprovedLabs: action.payload.data,
      };

    case GET_UNAPPROVED_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case APPROVE_UNAPPROVE_LAB_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case APPROVE_UNAPPROVE_LAB_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PENDING_B2B_CLIENTS_SUCCESS:
      return {
        ...state,
        pendingB2BClients: action.payload.data,
      };

    case GET_PENDING_B2B_CLIENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_APPROVED_B2B_CLIENTS_SUCCESS:
      return {
        ...state,
        approvedB2BClients: action.payload.data,
      };

    case GET_APPROVED_B2B_CLIENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNAPPROVED_B2B_CLIENTS_SUCCESS:
      return {
        ...state,
        unapprovedB2BClients: action.payload.data,
      };

    case GET_UNAPPROVED_B2B_CLIENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case APPROVE_UNAPPROVE_B2B_CLIENT_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case APPROVE_UNAPPROVE_B2B_CLIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PENDING_DONORS_SUCCESS:
      return {
        ...state,
        pendingDonors: action.payload.data,
      };

    case GET_PENDING_DONORS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_APPROVED_DONORS_SUCCESS:
      return {
        ...state,
        approvedDonors: action.payload.data,
      };

    case GET_APPROVED_DONORS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNAPPROVED_DONORS_SUCCESS:
      return {
        ...state,
        unapprovedDonors: action.payload.data,
      };

    case GET_UNAPPROVED_DONORS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case APPROVE_UNAPPROVE_DONOR_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case APPROVE_UNAPPROVE_DONOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default registrationAdmin;
