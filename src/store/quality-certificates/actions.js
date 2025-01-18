import {
  GET_QUALITY_CERTIFICATES,
  GET_QUALITY_CERTIFICATES_FAIL,
  GET_QUALITY_CERTIFICATES_SUCCESS,
  ADD_NEW_QUALITY_CERTIFICATE,
  ADD_QUALITY_CERTIFICATE_SUCCESS,
  ADD_QUALITY_CERTIFICATE_FAIL,
  UPDATE_QUALITY_CERTIFICATE,
  UPDATE_QUALITY_CERTIFICATE_SUCCESS,
  UPDATE_QUALITY_CERTIFICATE_FAIL,
  DELETE_QUALITY_CERTIFICATE,
  DELETE_QUALITY_CERTIFICATE_SUCCESS,
  DELETE_QUALITY_CERTIFICATE_FAIL,
  ADD_NEW_COLLECTIONPOINT_QUALITY,
  ADD_COLLECTIONPOINT_QUALITY_SUCCESS,
  ADD_COLLECTIONPOINT_QUALITY_FAIL,
  GET_LAB_PROFILE,
  GET_LAB_PROFILE_FAIL,
  GET_LAB_PROFILE_SUCCESS,
} from "./actionTypes";

export const getLabProfile = id => ({
  type: GET_LAB_PROFILE,
  payload: id,
});

export const getLabProfileSuccess = labProfiles => (
  console.log("actions",labProfiles),
  {
  type: GET_LAB_PROFILE_SUCCESS,
  payload: labProfiles,
});

export const getLabProfileFail = error => ({
  type: GET_LAB_PROFILE_FAIL,
  payload: error,
});

export const addNewCollectionPointQuality = (qualityCertificate, id) => ({
  type: ADD_NEW_COLLECTIONPOINT_QUALITY,
  payload: { qualityCertificate, id },
});

export const addCollectionPointQualitySuccess = qualityCertificate => ({
  type: ADD_COLLECTIONPOINT_QUALITY_SUCCESS,
  payload: qualityCertificate,
});

export const addCollectionPointQualityFail = error => ({
  type: ADD_COLLECTIONPOINT_QUALITY_FAIL,
  payload: error,
});


export const getQualityCertificates = id => ({
  type: GET_QUALITY_CERTIFICATES,
  payload: id,
});

export const getQualityCertificatesSuccess = qualityCertificates => ({
  type: GET_QUALITY_CERTIFICATES_SUCCESS,
  payload: qualityCertificates,
});

export const getQualityCertificatesFail = error => ({
  type: GET_QUALITY_CERTIFICATES_FAIL,
  payload: error,
});

export const addNewQualityCertificate = (qualityCertificate, id) => ({
  type: ADD_NEW_QUALITY_CERTIFICATE,
  payload: { qualityCertificate, id },
});

export const addQualityCertificateSuccess = qualityCertificate => ({
  type: ADD_QUALITY_CERTIFICATE_SUCCESS,
  payload: qualityCertificate,
});

export const addQualityCertificateFail = error => ({
  type: ADD_QUALITY_CERTIFICATE_FAIL,
  payload: error,
});

export const updateQualityCertificate = qualityCertificate => ({
  type: UPDATE_QUALITY_CERTIFICATE,
  payload: qualityCertificate,
});

export const updateQualityCertificateSuccess = qualityCertificate => ({
  type: UPDATE_QUALITY_CERTIFICATE_SUCCESS,
  payload: qualityCertificate,
});

export const updateQualityCertificateFail = error => ({
  type: UPDATE_QUALITY_CERTIFICATE_FAIL,
  payload: error,
});

export const deleteQualityCertificate = qualityCertificate => ({
  type: DELETE_QUALITY_CERTIFICATE,
  payload: qualityCertificate,
});

export const deleteQualityCertificateSuccess = qualityCertificate => ({
  type: DELETE_QUALITY_CERTIFICATE_SUCCESS,
  payload: qualityCertificate,
});

export const deleteQualityCertificateFail = error => ({
  type: DELETE_QUALITY_CERTIFICATE_FAIL,
  payload: error,
});
