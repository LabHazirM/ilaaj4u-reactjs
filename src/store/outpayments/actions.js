import {
  GET_LABS_MOF,
  GET_LABS_MOF_SUCCESS,
  GET_LABS_MOF_FAIL,
  GET_LABS_C,
  GET_LABS_C_SUCCESS,
  GET_LABS_C_FAIL,
  GET_LIST_DONATIONAPPOINTMENT,
  GET_LIST_DONATIONAPPOINTMENT_SUCCESS,
  GET_LIST_DONATIONAPPOINTMENT_FAIL,
  GET_LIST_CLABS,
  GET_LIST_CLABS_SUCCESS,
  GET_LIST_CLABS_FAIL,
  GET_LIST_INVOICE,
  GET_LIST_INVOICE_SUCCESS,
  GET_LIST_INVOICE_FAIL,
  GET_B2B_CLIENTS,
  GET_B2B_CLIENTS_SUCCESS,
  GET_B2B_CLIENTS_FAIL,
  GET_OUT_PAYMENT,
  GET_OUT_PAYMENT_SUCCESS,
  GET_OUT_PAYMENT_FAIL,
  GET_BANKS,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  GET_BANK_ACCOUNTS,
  GET_BANK_ACCOUNTS_FAIL,
  GET_BANK_ACCOUNTS_SUCCESS,
  ADD_NEW_OUT_PAYMENT,
  ADD_OUT_PAYMENT_SUCCESS,
  ADD_OUT_PAYMENT_FAIL,
  ADD_NEW_CORPORATE_PAYMENT,
  ADD_CORPORATE_PAYMENT_SUCCESS,
  ADD_CORPORATE_PAYMENT_FAIL,
  ADD_NEW_INVOICE_ADJUSTMENT,
  ADD_INVOICE_ADJUSTMENT_SUCCESS,
  ADD_INVOICE_ADJUSTMENT_FAIL,
  GET_STAFF_PROFILE,
  GET_STAFF_PROFILE_FAIL,
  GET_STAFF_PROFILE_SUCCESS,
  GET_CORPORATE_PROFILE,
  GET_CORPORATE_PROFILE_FAIL,
  GET_CORPORATE_PROFILE_SUCCESS,
} from "./actionTypes";

// ----------- Corporate profile APIs actions -----------------
export const getCorporateProfileforpayment = id => ({
  type: GET_CORPORATE_PROFILE,
  payload: id,
});

export const getCorporateProfileforpaymentSuccess = corporateProfiles => ({
  type: GET_CORPORATE_PROFILE_SUCCESS,
  payload: corporateProfiles,
});

export const getCorporateProfileforpaymentFail = error => ({
  type: GET_CORPORATE_PROFILE_FAIL,
  payload: error,
});

export const getStaffProfile = id => ({
  type: GET_STAFF_PROFILE,
  payload: id,
});

export const getStaffProfileSuccess = staffProfiles => (
  console.log("actions staff profile",staffProfiles),
  {
  type: GET_STAFF_PROFILE_SUCCESS,
  payload: staffProfiles,
});

export const getStaffProfileFail = error => ({
  type: GET_STAFF_PROFILE_FAIL,
  payload: error,
});

export const getBankAccounts = () => ({
  type: GET_BANK_ACCOUNTS,
});

export const getBankAccountsSuccess = bankAccounts => ({
  type: GET_BANK_ACCOUNTS_SUCCESS,
  payload: bankAccounts,
});

export const getBankAccountsFail = error => ({
  type: GET_BANK_ACCOUNTS_FAIL,
  payload: error,
});
export const getBanks = () => ({
  type: GET_BANKS,
});

export const getBanksSuccess = banks => ({
  type: GET_BANKS_SUCCESS,
  payload: banks,
});

export const getBanksFail = error => ({
  type: GET_BANKS_FAIL,
  payload: error,
});
export const getB2bClients = () => ({
  type: GET_B2B_CLIENTS,
  payload: {},
});

export const getB2bClientsSuccess =
  b2bClients => ({
    type: GET_B2B_CLIENTS_SUCCESS,
    payload: b2bClients,
  });

export const getB2bClientsFail = error => ({
  type: GET_B2B_CLIENTS_FAIL,
  payload: error,
});
export const getLabsMof = () => ({
  type: GET_LABS_MOF,
});

export const getLabsMofSuccess = labsMof => ({
  type: GET_LABS_MOF_SUCCESS,
  payload: labsMof,
});

export const getLabsMofFail = error => ({
  type: GET_LABS_MOF_FAIL,
  payload: error,
});

export const getLabsc = id => ({
  type: GET_LABS_C,
  payload: id,
});

export const getLabscSuccess = labsMof => ({
  type: GET_LABS_C_SUCCESS,
  payload: labsMof,
});

export const getLabscFail = error => ({
  type: GET_LABS_C_FAIL,
  payload: error,
});

export const getListDonationAppointment = () => ({
  type: GET_LIST_DONATIONAPPOINTMENT,
});

export const getListDonationAppointmentSuccess = listDonation => ({
  type: GET_LIST_DONATIONAPPOINTMENT_SUCCESS,
  payload: listDonation,
});

export const getListDonationAppointmentFail = error => ({
  type: GET_LIST_DONATIONAPPOINTMENT_FAIL,
  payload: error,
});

export const getListCLabs = () => ({
  type: GET_LIST_CLABS,
});

export const getListCLabsSuccess = listCLabs => ({
  type: GET_LIST_CLABS_SUCCESS,
  payload: listCLabs,
});

export const getListCLabsFail = error => ({
  type: GET_LIST_CLABS_FAIL,
  payload: error,
});

export const getListInvoice = () => ({
  type: GET_LIST_INVOICE,
});

export const getListInvoiceSuccess = listInvoice => ({
  type: GET_LIST_INVOICE_SUCCESS,
  payload: listInvoice,
});

export const getListInvoiceFail = error => ({
  type: GET_LIST_INVOICE_FAIL,
  payload: error,
});

export const getOutPayment = id => ({
  type: GET_OUT_PAYMENT,
  payload: id,
});

export const getOutPaymentSuccess = outPayments => ({
  type: GET_OUT_PAYMENT_SUCCESS,
  payload: outPayments,
});

export const getOutPaymentFail = error => ({
  type: GET_OUT_PAYMENT_FAIL,
  payload: error,
});
// export const getOutPayment = id => ({
//   type: GET_OUT_PAYMENT,
//   payload: id,
// });

// export const getOutPaymentSuccess = outPayments => ({
//   type: GET_OUT_PAYMENT_SUCCESS,
//   payload: outPayments,
// });

// export const getOutPaymentFail = error => ({
//   type: GET_OUT_PAYMENT_FAIL,
//   payload: error,
// });

export const addNewOutPayment = (outPayment, id) => ({
  type: ADD_NEW_OUT_PAYMENT,
  payload: { outPayment, id },
});

export const addOutPaymentSuccess = outPayment => ({
  type: ADD_OUT_PAYMENT_SUCCESS,
  payload: outPayment,
});

export const addOutPaymentFail = error => ({
  type: ADD_OUT_PAYMENT_FAIL,
  payload: error,
});
export const addNewCorporatePayment = (outPayment, id) => ({
  type: ADD_NEW_CORPORATE_PAYMENT,
  payload: { outPayment, id },
});

export const addCorporatePaymentSuccess = outPayment => (
  console.log("actions add corporate payment status",outPayment),
{
  
  type: ADD_CORPORATE_PAYMENT_SUCCESS,
  payload: outPayment,
});

export const addCorporatePaymentFail = error => ({
  type: ADD_CORPORATE_PAYMENT_FAIL,
  payload: error,
});
export const addNewInvoiceAdjustment = (outPayment, id) => ({
  type: ADD_NEW_INVOICE_ADJUSTMENT,
  payload: { outPayment, id },
});

export const addInvoiceAdjustmentSuccess = outPayment => ({
  type: ADD_INVOICE_ADJUSTMENT_SUCCESS,
  payload: outPayment,
});

export const addInvoiceAdjustmentFail = error => ({
  type: ADD_INVOICE_ADJUSTMENT_FAIL,
  payload: error,
});