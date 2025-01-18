import {
  GET_TESTS,
  GET_TESTS_FAIL,
  GET_TESTS_SUCCESS,
  GET_UNITS,
  GET_UNITS_FAIL,
  GET_UNITS_SUCCESS,
  GET_OFFERED_TESTS,
  GET_OFFERED_TESTS_FAIL,
  GET_OFFERED_TESTS_SUCCESS,
  GET_CORPORATE_TESTS,
  GET_CORPORATE_TESTS_FAIL,
  GET_CORPORATE_TESTS_SUCCESS,
  GET_OFFEREDTEST_REFERRELFEE,
  GET_OFFEREDTEST_REFERRELFEE_FAIL,
  GET_OFFEREDTEST_REFERRELFEE_SUCCESS,
  GET_COFFEREDTEST_REFERRELFEE,
  GET_COFFEREDTEST_REFERRELFEE_FAIL,
  GET_COFFEREDTEST_REFERRELFEE_SUCCESS,
  GET_COFFEREDPROFILE_REFERRELFEE,
  GET_COFFEREDPROFILE_REFERRELFEE_FAIL,
  GET_COFFEREDPROFILE_REFERRELFEE_SUCCESS,
  GET_COFFEREDPACKAGE_REFERRELFEE,
  GET_COFFEREDPACKAGE_REFERRELFEE_FAIL,
  GET_COFFEREDPACKAGE_REFERRELFEE_SUCCESS,
  GET_COFFEREDRADIOLOGY_REFERRELFEE,
  GET_COFFEREDRADIOLOGY_REFERRELFEE_FAIL,
  GET_COFFEREDRADIOLOGY_REFERRELFEE_SUCCESS,
  GET_OFFEREDPROFILE_REFERRELFEE,
  GET_OFFEREDPROFILE_REFERRELFEE_FAIL,
  GET_OFFEREDPROFILE_REFERRELFEE_SUCCESS,
  GET_OFFEREDPACKAGE_REFERRELFEE,
  GET_OFFEREDPACKAGE_REFERRELFEE_FAIL,
  GET_OFFEREDPACKAGE_REFERRELFEE_SUCCESS,
  GET_OFFEREDRADIOLOGY_REFERRELFEE,
  GET_OFFEREDRADIOLOGY_REFERRELFEE_FAIL,
  GET_OFFEREDRADIOLOGY_REFERRELFEE_SUCCESS,
  GET_LAB_PROFILE,
  GET_LAB_PROFILE_FAIL,
  GET_LAB_PROFILE_SUCCESS,
  ADD_NEW_OFFERED_TEST,
  ADD_OFFERED_TEST_SUCCESS,
  ADD_OFFERED_TEST_FAIL,
  ADD_NEW_CORPORATE_TEST,
  ADD_CORPORATE_TEST_SUCCESS,
  ADD_CORPORATE_TEST_FAIL,
  ADD_NEW_CORPORATE,
  ADD_CORPORATE_SUCCESS,
  ADD_CORPORATE_FAIL,
  ADD_NEW_OFFERED_MAINTEST,
  ADD_OFFERED_MAINTEST_SUCCESS,
  ADD_OFFERED_MAINTEST_FAIL,
  UPDATE_OFFERED_TEST,
  UPDATE_OFFERED_TEST_SUCCESS,
  UPDATE_OFFERED_TEST_FAIL,
  UPDATE_CORPORATE_TEST,
  UPDATE_CORPORATE_TEST_SUCCESS,
  UPDATE_CORPORATE_TEST_FAIL,
  UPDATE_CORPORATE_STATUS,
  UPDATE_CORPORATE_STATUS_SUCCESS,
  UPDATE_CORPORATE_STATUS_FAIL,
  UPDATE_ACORPORATE_STATUS,
  UPDATE_ACORPORATE_STATUS_SUCCESS,
  UPDATE_ACORPORATE_STATUS_FAIL,
  DELETE_OFFERED_TEST,
  DELETE_OFFERED_TEST_SUCCESS,
  DELETE_OFFERED_TEST_FAIL,
} from "./actionTypes";

// ----------- Test list APIs actions -----------------
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
export const getTests = () => ({
  type: GET_TESTS,
});

export const getTestsSuccess = tests => ({
  type: GET_TESTS_SUCCESS,
  payload: tests,
});

export const getTestsFail = error => ({
  type: GET_TESTS_FAIL,
  payload: error,
});

// ----------- Unit list APIs actions -----------------
export const getUnits = () => ({
  type: GET_UNITS,
});

export const getUnitsSuccess = units => ({
  type: GET_UNITS_SUCCESS,
  payload: units,
});

export const getUnitsFail = error => ({
  type: GET_UNITS_FAIL,
  payload: error,
});

// ----------- Offered test list APIs actions -----------------
export const getOfferedTests = id => ({
  type: GET_OFFERED_TESTS,
  payload: id,
});

export const getOfferedTestsSuccess = offeredTests => ({
  type: GET_OFFERED_TESTS_SUCCESS,
  payload: offeredTests,
});

export const getOfferedTestsFail = error => ({
  type: GET_OFFERED_TESTS_FAIL,
  payload: error,
});

export const getCorporateTests = id => ({
  type: GET_CORPORATE_TESTS,
  payload: id,
});

export const getCorporateTestsSuccess = offeredTests => ({
  type: GET_CORPORATE_TESTS_SUCCESS,
  payload: offeredTests,
});

export const getCorporateTestsFail = error => ({
  type: GET_CORPORATE_TESTS_FAIL,
  payload: error,
});

export const getOfferedTestsReferrel = id => ({
  type: GET_OFFEREDTEST_REFERRELFEE,
  payload: id,
});

export const getOfferedTestsReferrelSuccess = offeredTests => ({
  type: GET_OFFEREDTEST_REFERRELFEE_SUCCESS,
  payload: offeredTests,
});

export const getOfferedTestsReferrelFail = error => ({
  type: GET_OFFEREDTEST_REFERRELFEE_FAIL,
  payload: error,
});

export const getCOfferedTestsReferrel = id => ({
  type: GET_COFFEREDTEST_REFERRELFEE,
  payload: id,
});

export const getCOfferedTestsReferrelSuccess = offeredTests => ({
  type: GET_COFFEREDTEST_REFERRELFEE_SUCCESS,
  payload: offeredTests,
});

export const getCOfferedTestsReferrelFail = error => ({
  type: GET_COFFEREDTEST_REFERRELFEE_FAIL,
  payload: error,
});

export const getCOfferedProfilesReferrel = id => ({
  type: GET_COFFEREDPROFILE_REFERRELFEE,
  payload: id,
});

export const getCOfferedProfilesReferrelSuccess = offeredTests => ({
  type: GET_COFFEREDPROFILE_REFERRELFEE_SUCCESS,
  payload: offeredTests,
});

export const getCOfferedProfilesReferrelFail = error => ({
  type: GET_COFFEREDPROFILE_REFERRELFEE_FAIL,
  payload: error,
});
export const getCOfferedPackagesReferrel = id => ({
  type: GET_COFFEREDPACKAGE_REFERRELFEE,
  payload: id,
});

export const getCOfferedPackagesReferrelSuccess = offeredTests => ({
  type: GET_COFFEREDPACKAGE_REFERRELFEE_SUCCESS,
  payload: offeredTests,
});

export const getCOfferedPackagesReferrelFail = error => ({
  type: GET_COFFEREDPACKAGE_REFERRELFEE_FAIL,
  payload: error,
});
export const getCOfferedRadiologysReferrel = id => ({
  type: GET_COFFEREDRADIOLOGY_REFERRELFEE,
  payload: id,
});

export const getCOfferedRadiologysReferrelSuccess = offeredTests => ({
  type: GET_COFFEREDRADIOLOGY_REFERRELFEE_SUCCESS,
  payload: offeredTests,
});

export const getCOfferedRadiologysReferrelFail = error => ({
  type: GET_COFFEREDRADIOLOGY_REFERRELFEE_FAIL,
  payload: error,
});

export const getOfferedProfilesReferrel = id => ({
  type: GET_OFFEREDPROFILE_REFERRELFEE,
  payload: id,
});

export const getOfferedProfilesReferrelSuccess = offeredTests => ({
  type: GET_OFFEREDPROFILE_REFERRELFEE_SUCCESS,
  payload: offeredTests,
});

export const getOfferedProfilesReferrelFail = error => ({
  type: GET_OFFEREDPROFILE_REFERRELFEE_FAIL,
  payload: error,
});
export const getOfferedPackagesReferrel = id => ({
  type: GET_OFFEREDPACKAGE_REFERRELFEE,
  payload: id,
});

export const getOfferedPackagesReferrelSuccess = offeredTests => ({
  type: GET_OFFEREDPACKAGE_REFERRELFEE_SUCCESS,
  payload: offeredTests,
});

export const getOfferedPackagesReferrelFail = error => ({
  type: GET_OFFEREDPACKAGE_REFERRELFEE_FAIL,
  payload: error,
});
export const getOfferedRadiologysReferrel = id => ({
  type: GET_OFFEREDRADIOLOGY_REFERRELFEE,
  payload: id,
});

export const getOfferedRadiologysReferrelSuccess = offeredTests => ({
  type: GET_OFFEREDRADIOLOGY_REFERRELFEE_SUCCESS,
  payload: offeredTests,
});

export const getOfferedRadiologysReferrelFail = error => ({
  type: GET_OFFEREDRADIOLOGY_REFERRELFEE_FAIL,
  payload: error,
});

export const addNewCorporateTest = (offeredTest, id) => ({
  type: ADD_NEW_CORPORATE_TEST,
  payload: { offeredTest, id },
});

export const addCorporateTestSuccess = offeredTest => ({
  type: ADD_CORPORATE_TEST_SUCCESS,
  payload: offeredTest,
});

export const addCorporateTestFail = error => ({
  type: ADD_CORPORATE_TEST_FAIL,
  payload: error,
});

export const addNewCorporate = (offeredTest, id) => ({
  type: ADD_NEW_CORPORATE,
  payload: { offeredTest, id },
});

export const addCorporateSuccess = offeredTest => ({
  type: ADD_CORPORATE_SUCCESS,
  payload: offeredTest,
});

export const addCorporateFail = error => ({
  type: ADD_CORPORATE_FAIL,
  payload: error,
});

export const addNewOfferedTest = (offeredTest, id) => ({
  type: ADD_NEW_OFFERED_TEST,
  payload: { offeredTest, id },
});

export const addOfferedTestSuccess = offeredTest => ({
  type: ADD_OFFERED_TEST_SUCCESS,
  payload: offeredTest,
});

export const addOfferedTestFail = error => ({
  type: ADD_OFFERED_TEST_FAIL,
  payload: error,
});

export const addNewOfferedMainTest = (offeredTest, id) => ({
  type: ADD_NEW_OFFERED_MAINTEST,
  payload: { offeredTest, id },
});

export const addOfferedMainTestSuccess = offeredTest => ({
  type: ADD_OFFERED_MAINTEST_SUCCESS,
  payload: offeredTest,
});

export const addOfferedMainTestFail = error => ({
  type: ADD_OFFERED_MAINTEST_FAIL,
  payload: error,
});

export const updateOfferedTest = offeredTest => ({
  type: UPDATE_OFFERED_TEST,
  payload: offeredTest,
});

export const updateOfferedTestSuccess = offeredTest => ({
  type: UPDATE_OFFERED_TEST_SUCCESS,
  payload: offeredTest,
});

export const updateOfferedTestFail = error => ({
  type: UPDATE_OFFERED_TEST_FAIL,
  payload: error,
});

export const updateCorporateTest = offeredTest => ({
  type: UPDATE_CORPORATE_TEST,
  payload: offeredTest,
});

export const updateCorporateTestSuccess = offeredTest => ({
  type: UPDATE_CORPORATE_TEST_SUCCESS,
  payload: offeredTest,
});

export const updateCorporateTestFail = error => ({
  type: UPDATE_CORPORATE_TEST_FAIL,
  payload: error,
});
export const updateCorporateStatus = offeredTest => ({
  type: UPDATE_CORPORATE_STATUS,
  payload: offeredTest,
});

export const updateCorporateStatusSuccess = offeredTest => ({
  type: UPDATE_CORPORATE_STATUS_SUCCESS,
  payload: offeredTest,
});

export const updateCorporateStatusFail = error => ({
  type: UPDATE_CORPORATE_STATUS_FAIL,
  payload: error,
});

export const updateACorporateStatus = offeredTest => ({
  type: UPDATE_ACORPORATE_STATUS,
  payload: offeredTest,
});

export const updateACorporateStatusSuccess = offeredTest => ({
  type: UPDATE_ACORPORATE_STATUS_SUCCESS,
  payload: offeredTest,
});

export const updateACorporateStatusFail = error => ({
  type: UPDATE_ACORPORATE_STATUS_FAIL,
  payload: error,
});

export const deleteOfferedTest = offeredTest => ({
  type: DELETE_OFFERED_TEST,
  payload: offeredTest,
});

export const deleteOfferedTestSuccess = offeredTest => ({
  type: DELETE_OFFERED_TEST_SUCCESS,
  payload: offeredTest,
});

export const deleteOfferedTestFail = error => ({
  type: DELETE_OFFERED_TEST_FAIL,
  payload: error,
});
