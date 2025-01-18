import {
  GET_NEARBY_LABS,
  GET_NEARBY_LABS_FAIL,
  GET_NEARBY_LABS_SUCCESS,
  GET_CORPORATE_LABS,
  GET_CORPORATE_LABS_FAIL,
  GET_CORPORATE_LABS_SUCCESS,
  GET_REGION_WISE_ADVERTISEMENT,
  GET_REGION_WISE_ADVERTISEMENT_FAIL,
  GET_REGION_WISE_ADVERTISEMENT_SUCCESS,
  GET_ADV_LIVE,
  GET_ADV_LIVE_FAIL,
  GET_ADV_LIVE_SUCCESS,
  GET_PATIENT_PROFILE,
  GET_PATIENT_PROFILE_FAIL,
  GET_PATIENT_PROFILE_SUCCESS,
} from "./actionTypes";


export const getPatientProfile = id => ({
  type: GET_PATIENT_PROFILE,
  payload: id,
});

export const getPatientProfileSuccess = patientProfile => (
  console.log("actions",patientProfile),
  {
  type: GET_PATIENT_PROFILE_SUCCESS,
  payload: patientProfile,
});

export const getPatientProfileFail = error => ({
  type: GET_PATIENT_PROFILE_FAIL,
  payload: error,
});
export const getNearbyLabs = locationDetails => ({
  type: GET_NEARBY_LABS,
  payload: { locationDetails },
});

export const getNearbyLabsSuccess = nearbyLabs => ({
  type: GET_NEARBY_LABS_SUCCESS,
  payload: nearbyLabs,
});

export const getNearbyLabsFail = error => ({
  type: GET_NEARBY_LABS_FAIL,
  payload: error,
});
export const getCorporateLabs = locationDetails => ({
  type: GET_CORPORATE_LABS,
  payload: { locationDetails },
});

export const getCorporateLabsSuccess = corporateLab => ({
  type: GET_CORPORATE_LABS_SUCCESS,
  payload: corporateLab,
});

export const getCorporateLabsFail = error => ({
  type: GET_CORPORATE_LABS_FAIL,
  payload: error,
});

export const getRegionWiseAdvertisement = locationDetails => ({
  type: GET_REGION_WISE_ADVERTISEMENT,
  payload: { locationDetails },
});

export const getRegionWiseAdvertisementSuccess = regionWiseAdvertisement => ({
  type: GET_REGION_WISE_ADVERTISEMENT_SUCCESS,
  payload: regionWiseAdvertisement,
});

export const getRegionWiseAdvertisementFail = error => ({
  type: GET_REGION_WISE_ADVERTISEMENT_FAIL,
  payload: error,
});


export const getAdvLive = locationDetails => ({
  type: GET_ADV_LIVE,
  payload: { locationDetails },
});

export const getAdvLiveSuccess = advLives => ({
  type: GET_ADV_LIVE_SUCCESS,
  payload: advLives,
});

export const getAdvLiveFail = error => ({
  type: GET_ADV_LIVE_FAIL,
  payload: error,
});

