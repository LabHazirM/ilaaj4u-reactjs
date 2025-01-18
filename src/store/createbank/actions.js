import {
  // GET_CREATE_BANKS,
  // GET_CREATE_BANKS_FAIL,
  // GET_CREATE_BANKS_SUCCESS,
  ADD_NEW_CREATE_BANK,
  ADD_CREATE_BANK_SUCCESS,
  ADD_CREATE_BANK_FAIL,
  GET_BANKS,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  UPDATE_BANK,
  UPDATE_BANK_SUCCESS,
  UPDATE_BANK_FAIL,
} from "./actionTypes";

// export const getCreateBanks = id => ({
//   type: GET_CREATE_BANKS,
//   payload: id,
// });

// export const getCreateBanksSuccess = createBanks => ({
//   type: GET_CREATE_BANKS_SUCCESS,
//   payload: createBanks,
// });

// export const getCreateBanksFail = error => ({
//   type: GET_CREATE_BANKS_FAIL,
//   payload: error,
// });
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

export const addNewCreateBank = (createBank, id) => ({
  type: ADD_NEW_CREATE_BANK,
  payload: { createBank, id },
});

export const addCreateBankSuccess = createBank => ({
  type: ADD_CREATE_BANK_SUCCESS,
  payload: createBank,
});

export const addCreateBankFail = error => ({
  type: ADD_CREATE_BANK_FAIL,
  payload: error,
});
export const updateBank = bank => ({
  type: UPDATE_BANK,
  payload: bank,
});

export const updateBankSuccess = bank => ({
  type: UPDATE_BANK_SUCCESS,
  payload: bank,
});

export const updateBankFail = error => ({
  type: UPDATE_BANK_FAIL,
  payload: error,
});
