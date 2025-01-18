import {
  GET_LABS_LIST,
  GET_LABS_LIST_SUCCESS,
  GET_LABS_LIST_FAIL,
  GET_DONORS_LIST,
  GET_DONORS_LIST_SUCCESS,
  GET_DONORS_LIST_FAIL,
  GET_CORPORATE_LIST,
  GET_CORPORATE_LIST_SUCCESS,
  GET_CORPORATE_LIST_FAIL,
  GET_DONORSA,
  GET_DONORSA_SUCCESS,
  GET_DONORSA_FAIL,
  GET_LC_LIST,
  GET_LC_LIST_SUCCESS,
  GET_LC_LIST_FAIL,
  GET_LABS_AUDIT_LIST,
  GET_LABS_AUDIT_LIST_SUCCESS,
  GET_LABS_AUDIT_LIST_FAIL,
  GET_LABS_ALL_AUDIT_LIST,
  GET_LABS_ALL_AUDIT_LIST_SUCCESS,
  GET_LABS_ALL_AUDIT_LIST_FAIL,
} from "./actionTypes";

export const getLabsList = () => ({
  type: GET_LABS_LIST,
  payload: {},
});

export const getLabsListSuccess =
  labs => ({
    type: GET_LABS_LIST_SUCCESS,
    payload: labs,
  });

export const getLabsListFail = error => ({
  type: GET_LABS_LIST_FAIL,
  payload: error,
});

export const getLabsAuditList = () => ({
  type: GET_LABS_AUDIT_LIST,
  payload: {},
});

export const getLabsAuditListSuccess =
  labs => ({
    type: GET_LABS_AUDIT_LIST_SUCCESS,
    payload: labs,
  });

export const getLabsAuditListFail = error => ({
  type: GET_LABS_AUDIT_LIST_FAIL,
  payload: error,
});

export const getLabsAllAuditList = id => ({
  type: GET_LABS_ALL_AUDIT_LIST,
  payload: id,
});
/// get single lab audits list
export const getLabsAllAuditListSuccess = labaudit => ({
  type:  GET_LABS_ALL_AUDIT_LIST_SUCCESS,
  payload: labaudit,
});

export const getLabsAllAuditListFail = error => ({
  type: GET_LABS_ALL_AUDIT_LIST_FAIL,
  payload: error,
});
export const getDonorsList = () => ({
  type: GET_DONORS_LIST,
  payload: {},
});

export const getDonorsListSuccess =
  donors => ({
    type: GET_DONORS_LIST_SUCCESS,
    payload: donors,
  });

export const getDonorsListFail = error => ({
  type: GET_DONORS_LIST_FAIL,
  payload: error,
});
//////////////////////////////
export const getCorporateList = () => ({
  type: GET_CORPORATE_LIST,
  payload: {},
});

export const getCorporateListSuccess =
  corporate => ({
    type: GET_CORPORATE_LIST_SUCCESS,
    payload: corporate,
  });

export const getCorporateListFail = error => ({
  type: GET_CORPORATE_LIST_FAIL,
  payload: error,
});
/////////////////
export const getLcList = () => ({
  type: GET_LC_LIST,
  payload: {},
});

export const getLcListSuccess =
  donors => ({
    type: GET_LC_LIST_SUCCESS,
    payload: donors,
  });

export const getLcListFail = error => ({
  type: GET_LC_LIST_FAIL,
  payload: error,
});
////////////////////
export const getDonorsA = () => ({
  type: GET_DONORSA,
});

export const getDonorsASuccess = donors => ({
  type: GET_DONORSA_SUCCESS,
  payload: donors,
});

export const getDonorsAFail = error => ({
  type: GET_DONORSA_FAIL,
  payload: error,
});