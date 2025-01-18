import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED,

  GET_LAB_ADVERTISEMENT_REQUESTS,

  UPDATE_LAB_ADVERTISEMENT_REQUEST,
} from "./actionTypes";

import {

  getLabAdvertisementRequestsAcceptedSuccess,
  getLabAdvertisementRequestsAcceptedFail, 
  getLabAdvertisementRequestsSuccess,
  getLabAdvertisementRequestsFail, 
  updateLabAdvertisementRequestSuccess,
  updateLabAdvertisementRequestFail,

} from "./actions";

//Include Both Helper File with needed methods
import {
  // getAdvertisementPriceLists,
  getLabAdvertisementRequestsAccepted,
  getLabAdvertisementRequests,
  updateLabAdvertisementRequest,
} from "../../helpers/django_api_helper";

function* fetchLabAdvertisementRequests(object) {
  try {
    const response = yield call(getLabAdvertisementRequests, object.payload);    
    yield put(getLabAdvertisementRequestsSuccess(response));
  } catch (error) {
    yield put(getLabAdvertisementRequestsFail(error));
  }
}

function* fetchLabAdvertisementRequestsAccepted(object) {
  try {
    const response = yield call(getLabAdvertisementRequestsAccepted, object.payload);
    console.log ("labAdvertisementRequest Accepted saga: ", response);
    
    yield put(getLabAdvertisementRequestsAcceptedSuccess(response));
  } catch (error) {
    yield put(getLabAdvertisementRequestsAcceptedFail(error));
  }
}

function* onUpdateLabAdvertisementRequest({ payload: labAdvertisementRequest }) {
  try {
    const response = yield call(updateLabAdvertisementRequest, labAdvertisementRequest);
    console.log ("labAdvertisementRequest Accepted update saga: ", response);
    yield put(updateLabAdvertisementRequestSuccess(response));
  } catch (error) {
    yield put(updateLabAdvertisementRequestFail(error));
  }
}


function* labAdvertisementRequestsSaga() {
  yield takeEvery(GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED, fetchLabAdvertisementRequestsAccepted);
  yield takeEvery(GET_LAB_ADVERTISEMENT_REQUESTS, fetchLabAdvertisementRequests);
  yield takeEvery(UPDATE_LAB_ADVERTISEMENT_REQUEST, onUpdateLabAdvertisementRequest);
}

export default labAdvertisementRequestsSaga;
