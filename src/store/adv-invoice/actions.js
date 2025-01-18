import {
  GET_ADV_INVOICE,
  GET_ADV_INVOICE_FAIL,
  GET_ADV_INVOICE_SUCCESS,
} from "./actionTypes";

// ----------- Pathologist list APIs actions -----------------
export const getAdvInvoice = id => ({
  type: GET_ADV_INVOICE,
  payload: id,
});

export const getAdvInvoiceSuccess = advinvoice => ({
  type: GET_ADV_INVOICE_SUCCESS,
  payload: advinvoice,
});

export const getAdvInvoiceFail = error => ({
  type: GET_ADV_INVOICE_FAIL,
  payload: error,
});



