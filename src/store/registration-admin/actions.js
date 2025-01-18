import {
  GET_PENDING_CORPORATE,
  GET_PENDING_CORPORATE_SUCCESS,
  GET_PENDING_CORPORATE_FAIL,
  GET_APPROVED_CORPORATE,
  GET_APPROVED_CORPORATE_SUCCESS,
  GET_APPROVED_CORPORATE_FAIL,
  GET_UNAPPROVED_CORPORATE,
  GET_UNAPPROVED_CORPORATE_SUCCESS,
  GET_UNAPPROVED_CORPORATE_FAIL,
  APPROVE_UNAPPROVE_CORPORATE,
  APPROVE_UNAPPROVE_CORPORATE_SUCCESS,
  APPROVE_UNAPPROVE_CORPORATE_FAIL,

  GET_PENDING_LABS,
  GET_PENDING_LABS_SUCCESS,
  GET_PENDING_LABS_FAIL,
  GET_APPROVED_LABS,
  GET_APPROVED_LABS_SUCCESS,
  GET_APPROVED_LABS_FAIL,
  GET_UNAPPROVED_LABS,
  GET_UNAPPROVED_LABS_SUCCESS,
  GET_UNAPPROVED_LABS_FAIL,
  APPROVE_UNAPPROVE_LAB,
  APPROVE_UNAPPROVE_LAB_SUCCESS,
  APPROVE_UNAPPROVE_LAB_FAIL,
  GET_PENDING_B2B_CLIENTS,
  GET_PENDING_B2B_CLIENTS_SUCCESS,
  GET_PENDING_B2B_CLIENTS_FAIL,
  GET_APPROVED_B2B_CLIENTS,
  GET_APPROVED_B2B_CLIENTS_SUCCESS,
  GET_APPROVED_B2B_CLIENTS_FAIL,
  GET_UNAPPROVED_B2B_CLIENTS,
  GET_UNAPPROVED_B2B_CLIENTS_SUCCESS,
  GET_UNAPPROVED_B2B_CLIENTS_FAIL,
  APPROVE_UNAPPROVE_B2B_CLIENT,
  APPROVE_UNAPPROVE_B2B_CLIENT_SUCCESS,
  APPROVE_UNAPPROVE_B2B_CLIENT_FAIL,
  GET_PENDING_DONORS,
  GET_PENDING_DONORS_SUCCESS,
  GET_PENDING_DONORS_FAIL,
  GET_APPROVED_DONORS,
  GET_APPROVED_DONORS_SUCCESS,
  GET_APPROVED_DONORS_FAIL,
  GET_UNAPPROVED_DONORS,
  GET_UNAPPROVED_DONORS_SUCCESS,
  GET_UNAPPROVED_DONORS_FAIL,
  APPROVE_UNAPPROVE_DONOR,
  APPROVE_UNAPPROVE_DONOR_SUCCESS,
  APPROVE_UNAPPROVE_DONOR_FAIL,
} from "./actionTypes";

export const getApprovedCorporate = () => ({
  type: GET_APPROVED_CORPORATE,
  payload: {},
});

export const getApprovedCorporateSuccess = approvedCorporate => ({
  type: GET_APPROVED_CORPORATE_SUCCESS,
  payload: approvedCorporate,
});

export const getApprovedCorporateFail = error => ({
  type: GET_APPROVED_CORPORATE_FAIL,
  payload: error,
});
export const getUnapprovedCorporate = () => ({
  type: GET_UNAPPROVED_CORPORATE,
  payload: {},
});

export const getUnapprovedCorporateSuccess = UnapprovedCorporate => ({
  type: GET_UNAPPROVED_CORPORATE_SUCCESS,
  payload: UnapprovedCorporate,
});

export const getUnapprovedCorporateFail = error => ({
  type: GET_UNAPPROVED_CORPORATE_FAIL,
  payload: error,
});
export const getPendingCorporate = () => ({
  type: GET_PENDING_CORPORATE,
  payload: {},
});

export const getPendingCorporateSuccess = pendingCorporate => ({
  type: GET_PENDING_CORPORATE_SUCCESS,
  payload: pendingCorporate,
});

export const getPendingCorporateFail = error => ({
  type: GET_PENDING_CORPORATE_FAIL,
  payload: error,
});

export const approveUnapproveCorporate = data => ({
  type: APPROVE_UNAPPROVE_CORPORATE,
  payload: { data },
});

export const approveUnapproveCorporateSuccess = success => ({
  type: APPROVE_UNAPPROVE_CORPORATE_SUCCESS,
  payload: success,
});

export const approveUnapproveCorporateFail = error => ({
  type: APPROVE_UNAPPROVE_CORPORATE_FAIL,
  payload: error,
});

// -------------------- LAB ACTIONS --------------------
export const getPendingLabs = () => ({
  type: GET_PENDING_LABS,
  payload: {},
});

export const getPendingLabsSuccess = pendingLabs => ({
  type: GET_PENDING_LABS_SUCCESS,
  payload: pendingLabs,
});

export const getPendingLabsFail = error => ({
  type: GET_PENDING_LABS_FAIL,
  payload: error,
});

export const getApprovedLabs = () => ({
  type: GET_APPROVED_LABS,
  payload: {},
});

export const getApprovedLabsSuccess = approvedLabs => ({
  type: GET_APPROVED_LABS_SUCCESS,
  payload: approvedLabs,
});

export const getApprovedLabsFail = error => ({
  type: GET_APPROVED_LABS_FAIL,
  payload: error,
});

export const getUnapprovedLabs = () => ({
  type: GET_UNAPPROVED_LABS,
  payload: {},
});

export const getUnapprovedLabsSuccess = unapprovedLabs => ({
  type: GET_UNAPPROVED_LABS_SUCCESS,
  payload: unapprovedLabs,
});

export const getUnapprovedLabsFail = error => ({
  type: GET_UNAPPROVED_LABS_FAIL,
  payload: error,
});

export const approveUnapproveLab = data => ({
  type: APPROVE_UNAPPROVE_LAB,
  payload: { data },
});

export const approveUnapproveLabSuccess = success => ({
  type: APPROVE_UNAPPROVE_LAB_SUCCESS,
  payload: success,
});

export const approveUnapproveLabFail = error => ({
  type: APPROVE_UNAPPROVE_LAB_FAIL,
  payload: error,
});

// -------------------- B2B ACTIONS --------------------
export const getPendingB2BClients = () => ({
  type: GET_PENDING_B2B_CLIENTS,
  payload: {},
});

export const getPendingB2BClientsSuccess = pendingB2BClients => ({
  type: GET_PENDING_B2B_CLIENTS_SUCCESS,
  payload: pendingB2BClients,
});

export const getPendingB2BClientsFail = error => ({
  type: GET_PENDING_B2B_CLIENTS_FAIL,
  payload: error,
});

export const getApprovedB2BClients = () => ({
  type: GET_APPROVED_B2B_CLIENTS,
  payload: {},
});

export const getApprovedB2BClientsSuccess = approvedB2BClients => ({
  type: GET_APPROVED_B2B_CLIENTS_SUCCESS,
  payload: approvedB2BClients,
});

export const getApprovedB2BClientsFail = error => ({
  type: GET_APPROVED_B2B_CLIENTS_FAIL,
  payload: error,
});

export const getUnapprovedB2BClients = () => ({
  type: GET_UNAPPROVED_B2B_CLIENTS,
  payload: {},
});

export const getUnapprovedB2BClientsSuccess = unapprovedB2BClients => ({
  type: GET_UNAPPROVED_B2B_CLIENTS_SUCCESS,
  payload: unapprovedB2BClients,
});

export const getUnapprovedB2BClientsFail = error => ({
  type: GET_UNAPPROVED_B2B_CLIENTS_FAIL,
  payload: error,
});

export const approveUnapproveB2BClient = data => ({
  type: APPROVE_UNAPPROVE_B2B_CLIENT,
  payload: { data },
});

export const approveUnapproveB2BClientSuccess = success => ({
  type: APPROVE_UNAPPROVE_B2B_CLIENT_SUCCESS,
  payload: success,
});

export const approveUnapproveB2BClientFail = error => ({
  type: APPROVE_UNAPPROVE_B2B_CLIENT_FAIL,
  payload: error,
});

// -------------------- DONOR ACTIONS --------------------
export const getPendingDonors = () => ({
  type: GET_PENDING_DONORS,
  payload: {},
});

export const getPendingDonorsSuccess = pendingDonors => ({
  type: GET_PENDING_DONORS_SUCCESS,
  payload: pendingDonors,
});

export const getPendingDonorsFail = error => ({
  type: GET_PENDING_DONORS_FAIL,
  payload: error,
});

export const getApprovedDonors = () => ({
  type: GET_APPROVED_DONORS,
  payload: {},
});

export const getApprovedDonorsSuccess = approvedDonors => ({
  type: GET_APPROVED_DONORS_SUCCESS,
  payload: approvedDonors,
});

export const getApprovedDonorsFail = error => ({
  type: GET_APPROVED_DONORS_FAIL,
  payload: error,
});

export const getUnapprovedDonors = () => ({
  type: GET_UNAPPROVED_DONORS,
  payload: {},
});

export const getUnapprovedDonorsSuccess = unapprovedDonors => ({
  type: GET_UNAPPROVED_DONORS_SUCCESS,
  payload: unapprovedDonors,
});

export const getUnapprovedDonorsFail = error => ({
  type: GET_UNAPPROVED_DONORS_FAIL,
  payload: error,
});

export const approveUnapproveDonor = data => ({
  type: APPROVE_UNAPPROVE_DONOR,
  payload: { data },
});

export const approveUnapproveDonorSuccess = success => ({
  type: APPROVE_UNAPPROVE_DONOR_SUCCESS,
  payload: success,
});

export const approveUnapproveDonorFail = error => ({
  type: APPROVE_UNAPPROVE_DONOR_FAIL,
  payload: error,
});
