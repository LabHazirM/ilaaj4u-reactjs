import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_SAMPLE_COLLECTORS,
  ADD_NEW_SAMPLE_COLLECTOR,
  DELETE_SAMPLE_COLLECTOR,
  UPDATE_SAMPLE_COLLECTOR,
} from "./actionTypes";

import {
  getSampleCollectorsSuccess,
  getSampleCollectorsFail,
  addSampleCollectorFail,
  addSampleCollectorSuccess,
  updateSampleCollectorSuccess,
  updateSampleCollectorFail,
  deleteSampleCollectorSuccess,
  deleteSampleCollectorFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getSampleCollectors,
  addNewSampleCollector,
  updateSampleCollector,
  deleteSampleCollector,
} from "../../helpers/django_api_helper";

function* fetchSampleCollectors(object) {
  try {
    const response = yield call(getSampleCollectors, object.payload);
    yield put(getSampleCollectorsSuccess(response));
  } catch (error) {
    yield put(getSampleCollectorsFail(error));
  }
}

function* onAddNewSampleCollector(object) {
  try {
    const response = yield call(
      addNewSampleCollector,
      object.payload.sampleCollector,
      object.payload.id
    );
    yield put(addSampleCollectorSuccess(response));
  } catch (error) {
    yield put(addSampleCollectorFail(error));
  }
}

function* onUpdateSampleCollector({ payload: sampleCollector }) {
  try {
    const response = yield call(updateSampleCollector, sampleCollector);
    yield put(updateSampleCollectorSuccess(response));
  } catch (error) {
    yield put(updateSampleCollectorFail(error));
  }
}

function* onDeleteSampleCollector({ payload: sampleCollector }) {
  try {
    const response = yield call(deleteSampleCollector, sampleCollector);
    yield put(deleteSampleCollectorSuccess(response));
  } catch (error) {
    yield put(deleteSampleCollectorFail(error));
  }
}

function* sampleCollectorsSaga() {
  yield takeEvery(GET_SAMPLE_COLLECTORS, fetchSampleCollectors);
  yield takeEvery(ADD_NEW_SAMPLE_COLLECTOR, onAddNewSampleCollector);
  yield takeEvery(UPDATE_SAMPLE_COLLECTOR, onUpdateSampleCollector);
  yield takeEvery(DELETE_SAMPLE_COLLECTOR, onDeleteSampleCollector);
}

export default sampleCollectorsSaga;
