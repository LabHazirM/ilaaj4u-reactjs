import allDonationAppointments from "pages/FinanceAdmin/all-donation-appointments";
import {
  // GET_CLEARED_LABS,
  // GET_CLEARED_LABS_SUCCESS,
  // GET_CLEARED_LABS_FAIL,
  // GET_APPROVED_LABS,
  // GET_APPROVED_LABS_SUCCESS,
  // GET_APPROVED_LABS_FAIL,
  // GET_UNAPPROVED_LABS,
  // GET_UNAPPROVED_LABS_SUCCESS,
  // GET_UNAPPROVED_LABS_FAIL,
  // APPROVE_UNAPPROVE_LAB,
  // APPROVE_UNAPPROVE_LAB_SUCCESS,
  // APPROVE_UNAPPROVE_LAB_FAIL,
  GET_CLEARED_IN_PAYMENTS,
  GET_CLEARED_IN_PAYMENTS_SUCCESS,
  GET_CLEARED_IN_PAYMENTS_FAIL,
  GET_APPROVED_IN_PAYMENTS,
  GET_APPROVED_IN_PAYMENTS_SUCCESS,
  GET_APPROVED_IN_PAYMENTS_FAIL,
  GET_UNAPPROVED_IN_PAYMENTS,
  GET_UNAPPROVED_IN_PAYMENTS_SUCCESS,
  GET_UNAPPROVED_IN_PAYMENTS_FAIL,
  UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT,
  UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT_SUCCESS,
  UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT_FAIL,
  GET_ALL_LABS_LIST,
  GET_ALL_LABS_LIST_SUCCESS,
  GET_ALL_LABS_LIST_FAIL,
  GET_ALL_DONATION_APPOINTMENTS,
  GET_ALL_DONATION_APPOINTMENTS_SUCCESS,
  GET_ALL_DONATION_APPOINTMENTS_FAIL,
  // GET_CLEARED_DONORS,
  // GET_CLEARED_DONORS_SUCCESS,
  // GET_CLEARED_DONORS_FAIL,
  // GET_APPROVED_DONORS,
  // GET_APPROVED_DONORS_SUCCESS,
  // GET_APPROVED_DONORS_FAIL,
  // GET_UNAPPROVED_DONORS,
  // GET_UNAPPROVED_DONORS_SUCCESS,
  // GET_UNAPPROVED_DONORS_FAIL,
  // APPROVE_UNAPPROVE_DONOR,
  // APPROVE_UNAPPROVE_DONOR_SUCCESS,
  // APPROVE_UNAPPROVE_DONOR_FAIL,
} from "./actionTypes";

// -------------------- LAB ACTIONS --------------------
// export const getClearedLabs = () => ({
//   type: GET_CLEARED_LABS,
//   payload: {},
// });

// export const getClearedLabsSuccess = clearedLabs => ({
//   type: GET_CLEARED_LABS_SUCCESS,
//   payload: clearedLabs,
// });

// export const getClearedLabsFail = error => ({
//   type: GET_CLEARED_LABS_FAIL,
//   payload: error,
// });

// export const getApprovedLabs = () => ({
//   type: GET_APPROVED_LABS,
//   payload: {},
// });

// export const getApprovedLabsSuccess = approvedLabs => ({
//   type: GET_APPROVED_LABS_SUCCESS,
//   payload: approvedLabs,
// });

// export const getApprovedLabsFail = error => ({
//   type: GET_APPROVED_LABS_FAIL,
//   payload: error,
// });

// export const getUnapprovedLabs = () => ({
//   type: GET_UNAPPROVED_LABS,
//   payload: {},
// });

// export const getUnapprovedLabsSuccess = unapprovedLabs => ({
//   type: GET_UNAPPROVED_LABS_SUCCESS,
//   payload: unapprovedLabs,
// });

// export const getUnapprovedLabsFail = error => ({
//   type: GET_UNAPPROVED_LABS_FAIL,
//   payload: error,
// });

// export const approveUnapproveLab = data => ({
//   type: APPROVE_UNAPPROVE_LAB,
//   payload: { data },
// });

// export const approveUnapproveLabSuccess = success => ({
//   type: APPROVE_UNAPPROVE_LAB_SUCCESS,
//   payload: success,
// });

// export const approveUnapproveLabFail = error => ({
//   type: APPROVE_UNAPPROVE_LAB_FAIL,
//   payload: error,
// });
// -------------------- LABS LIST ACTIONS --------------------
export const getAllLabsList = () => ({
  type: GET_ALL_LABS_LIST,
  payload: {},
});

export const getAllLabsListSuccess = allLabsList => ({
  type: GET_ALL_LABS_LIST_SUCCESS,
  payload: allLabsList,
});

export const getAllLabsListFail = error => ({
  type: GET_ALL_LABS_LIST_FAIL,
  payload: error,
});

//.................... Donation Appointment List .............
export const getAllDonationAppointments = id => ({
  type: GET_ALL_DONATION_APPOINTMENTS,
  payload: id,
});

export const getAllDonationAppointmentsSuccess = allDonationAppointment => ({
  type: GET_ALL_DONATION_APPOINTMENTS_SUCCESS,
  payload: allDonationAppointment,
});

export const getAllDonationAppointmentsFail = error => ({
  type: GET_ALL_DONATION_APPOINTMENTS_FAIL,
  payload: error,
});

// -------------------- B2B ACTIONS --------------------
export const getClearedInPayments = id => ({
  type: GET_CLEARED_IN_PAYMENTS,
  payload: id,
});

export const getClearedInPaymentsSuccess = clearedInPayments => ({
  type: GET_CLEARED_IN_PAYMENTS_SUCCESS,
  payload: clearedInPayments,
});

export const getClearedInPaymentsFail = error => ({
  type: GET_CLEARED_IN_PAYMENTS_FAIL,
  payload: error,
});

export const getApprovedInPayments = id => ({
  type: GET_APPROVED_IN_PAYMENTS,
  payload: id,
});

export const getApprovedInPaymentsSuccess = approvedInPayments => ({
  type: GET_APPROVED_IN_PAYMENTS_SUCCESS,
  payload: approvedInPayments,
});

export const getApprovedInPaymentsFail = error => ({
  type: GET_APPROVED_IN_PAYMENTS_FAIL,
  payload: error,
});

export const getUnapprovedInPayments = id => ({
  type: GET_UNAPPROVED_IN_PAYMENTS,
  payload: id,
});

export const getUnapprovedInPaymentsSuccess = unapprovedInPayments => ({
  type: GET_UNAPPROVED_IN_PAYMENTS_SUCCESS,
  payload: unapprovedInPayments,
});

export const getUnapprovedInPaymentsFail = error => ({
  type: GET_UNAPPROVED_IN_PAYMENTS_FAIL,
  payload: error,
});

export const updateApproveUnapproveInPayment = data => ({
  type: UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT,
  payload: data,
});

export const updateApproveUnapproveInPaymentSuccess = data => ({
  type: UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT_SUCCESS,
  payload: data,
});

export const updateApproveUnapproveInPaymentFail = error => ({
  type: UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT_FAIL,
  payload: error,
});

// -------------------- DONOR ACTIONS --------------------
// export const getClearedDonors = () => ({
//   type: GET_CLEARED_DONORS,
//   payload: {},
// });

// export const getClearedDonorsSuccess = clearedDonors => ({
//   type: GET_CLEARED_DONORS_SUCCESS,
//   payload: clearedDonors,
// });

// export const getClearedDonorsFail = error => ({
//   type: GET_CLEARED_DONORS_FAIL,
//   payload: error,
// });

// export const getApprovedDonors = () => ({
//   type: GET_APPROVED_DONORS,
//   payload: {},
// });

// export const getApprovedDonorsSuccess = approvedDonors => ({
//   type: GET_APPROVED_DONORS_SUCCESS,
//   payload: approvedDonors,
// });

// export const getApprovedDonorsFail = error => ({
//   type: GET_APPROVED_DONORS_FAIL,
//   payload: error,
// });

// export const getUnapprovedDonors = () => ({
//   type: GET_UNAPPROVED_DONORS,
//   payload: {},
// });

// export const getUnapprovedDonorsSuccess = unapprovedDonors => ({
//   type: GET_UNAPPROVED_DONORS_SUCCESS,
//   payload: unapprovedDonors,
// });

// export const getUnapprovedDonorsFail = error => ({
//   type: GET_UNAPPROVED_DONORS_FAIL,
//   payload: error,
// });

// export const approveUnapproveDonor = data => ({
//   type: APPROVE_UNAPPROVE_DONOR,
//   payload: { data },
// });

// export const approveUnapproveDonorSuccess = success => ({
//   type: APPROVE_UNAPPROVE_DONOR_SUCCESS,
//   payload: success,
// });

// export const approveUnapproveDonorFail = error => ({
//   type: APPROVE_UNAPPROVE_DONOR_FAIL,
//   payload: error,
// });
