import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_NOTES,
  ADD_NEW_NOTE,
  GET_NOTES_COMPLAINT,
  ADD_NEW_NOTE_COMPLAINT,
} from "./actionTypes";

import {
  getNotesSuccess,
  getNotesFail,
  addNoteFail,
  addNoteSuccess,
  getNotesComplaintSuccess,
  getNotesComplaintFail,
  addNoteComplaintFail,
  addNoteComplaintSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getNotes,
  addNewNote,
  getNotesComplaint,
  addNewNoteComplaint,
} from "../../helpers/django_api_helper";

function* fetchNotesComplaint(object) {
  try {
    const response = yield call(getNotesComplaint, object.payload);
    yield put(getNotesComplaintSuccess(response));
  } catch (error) {
    yield put(getNotesComplaintFail(error));
  }
}

function* onAddNewNoteComplaint(object) {
  try {
    const response = yield call(
      addNewNoteComplaint,
      object.payload.note,
      object.payload.id
    );
    yield put(addNoteComplaintSuccess(response));
  } catch (error) {
    yield put(addNoteComplaintFail(error));
  }
}
function* fetchNotes(object) {
  try {
    const response = yield call(getNotes, object.payload);
    yield put(getNotesSuccess(response));
  } catch (error) {
    yield put(getNotesFail(error));
  }
}

function* onAddNewNote(object) {
  try {
    const response = yield call(
      addNewNote,
      object.payload.note,
      object.payload.id
    );
    yield put(addNoteSuccess(response));
  } catch (error) {
    yield put(addNoteFail(error));
  }
}

function* notesSaga() {
  yield takeEvery(GET_NOTES, fetchNotes);
  yield takeEvery(ADD_NEW_NOTE, onAddNewNote);
  yield takeEvery(GET_NOTES_COMPLAINT, fetchNotesComplaint);
  yield takeEvery(ADD_NEW_NOTE_COMPLAINT, onAddNewNoteComplaint);
}

export default notesSaga;
