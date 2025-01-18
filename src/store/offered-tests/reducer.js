import {
  GET_UNITS_SUCCESS,
  GET_UNITS_FAIL,
  GET_TESTS_SUCCESS,
  GET_TESTS_FAIL,
  GET_OFFERED_TESTS_SUCCESS,
  GET_OFFERED_TESTS_FAIL,
  GET_CORPORATE_TESTS_SUCCESS,
  GET_CORPORATE_TESTS_FAIL,
  GET_OFFEREDTEST_REFERRELFEE_SUCCESS,
  GET_OFFEREDTEST_REFERRELFEE_FAIL,
  GET_COFFEREDTEST_REFERRELFEE_SUCCESS,
  GET_COFFEREDTEST_REFERRELFEE_FAIL,
  GET_COFFEREDPROFILE_REFERRELFEE_SUCCESS,
  GET_COFFEREDPROFILE_REFERRELFEE_FAIL,
  GET_COFFEREDPACKAGE_REFERRELFEE_SUCCESS,
  GET_COFFEREDPACKAGE_REFERRELFEE_FAIL,
  GET_COFFEREDRADIOLOGY_REFERRELFEE_SUCCESS,
  GET_COFFEREDRADIOLOGY_REFERRELFEE_FAIL,
  GET_OFFEREDPROFILE_REFERRELFEE_SUCCESS,
  GET_OFFEREDPROFILE_REFERRELFEE_FAIL,
  GET_OFFEREDPACKAGE_REFERRELFEE_SUCCESS,
  GET_OFFEREDPACKAGE_REFERRELFEE_FAIL,
  GET_OFFEREDRADIOLOGY_REFERRELFEE_SUCCESS,
  GET_OFFEREDRADIOLOGY_REFERRELFEE_FAIL,
  GET_LAB_PROFILE_SUCCESS,
  GET_LAB_PROFILE_FAIL,
  ADD_OFFERED_TEST_SUCCESS,
  ADD_OFFERED_TEST_FAIL,
  ADD_CORPORATE_TEST_SUCCESS,
  ADD_CORPORATE_FAIL,
  ADD_CORPORATE_SUCCESS,
  ADD_CORPORATE_TEST_FAIL,
  ADD_OFFERED_MAINTEST_SUCCESS,
  ADD_OFFERED_MAINTEST_FAIL,
  UPDATE_OFFERED_TEST_SUCCESS,
  UPDATE_OFFERED_TEST_FAIL,
  UPDATE_CORPORATE_TEST_SUCCESS,
  UPDATE_CORPORATE_TEST_FAIL,
  UPDATE_CORPORATE_STATUS_SUCCESS,
  UPDATE_CORPORATE_STATUS_FAIL,
  UPDATE_ACORPORATE_STATUS_SUCCESS,
  UPDATE_ACORPORATE_STATUS_FAIL,
  DELETE_OFFERED_TEST_SUCCESS,
  DELETE_OFFERED_TEST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  units: [],
  tests: [],
  labProfiles: [],
  offeredTests: [],
  error: {},
};

const tests = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_UNITS_SUCCESS:
      return {
        ...state,
        units: action.payload.data,
      };

    case GET_UNITS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TESTS_SUCCESS:
      return {
        ...state,
        tests: action.payload.data,
      };

    case GET_TESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_OFFERED_TESTS_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_OFFERED_TESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_CORPORATE_TESTS_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_CORPORATE_TESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LAB_PROFILE_SUCCESS:
      return {
        ...state,
        labProfiles: action.payload.data,
      };

    case GET_LAB_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_OFFEREDTEST_REFERRELFEE_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_OFFEREDTEST_REFERRELFEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_COFFEREDTEST_REFERRELFEE_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_COFFEREDTEST_REFERRELFEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_COFFEREDPROFILE_REFERRELFEE_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_COFFEREDPROFILE_REFERRELFEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_COFFEREDPACKAGE_REFERRELFEE_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_COFFEREDPACKAGE_REFERRELFEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_COFFEREDRADIOLOGY_REFERRELFEE_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_COFFEREDRADIOLOGY_REFERRELFEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_OFFEREDPROFILE_REFERRELFEE_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_OFFEREDPROFILE_REFERRELFEE_FAIL:
      return {
        ...state,
        error: action.payload,
      }; 
    case GET_OFFEREDPACKAGE_REFERRELFEE_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_OFFEREDPACKAGE_REFERRELFEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };  
    case GET_OFFEREDRADIOLOGY_REFERRELFEE_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_OFFEREDRADIOLOGY_REFERRELFEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_OFFERED_TEST_SUCCESS:
      return {
        ...state,
        offeredTests: [...state.offeredTests, action.payload],
      };

    case ADD_OFFERED_TEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_CORPORATE_TEST_SUCCESS:
      return {
        ...state,
        offeredTests: [...state.offeredTests, action.payload],
      };

    case ADD_CORPORATE_TEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_CORPORATE_SUCCESS:
      return {
        ...state,
        offeredTests: [...state.offeredTests, action.payload],
      };

    case ADD_CORPORATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_OFFERED_MAINTEST_SUCCESS:
      return {
        ...state,
        offeredTests: [...state.offeredTests, action.payload],
      };

    case ADD_OFFERED_MAINTEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_OFFERED_TEST_SUCCESS:
      return {
        ...state,
        offeredTests: state.offeredTests.map(offeredTest =>
          offeredTest.id.toString() === action.payload.id.toString()
            ? { offeredTest, ...action.payload }
            : offeredTest
        ),
      };

    case UPDATE_OFFERED_TEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_CORPORATE_TEST_SUCCESS:
      return {
        ...state,
        offeredTests: state.offeredTests.map(offeredTest =>
          offeredTest.id.toString() === action.payload.id.toString()
            ? { offeredTest, ...action.payload }
            : offeredTest
        ),
      };

    case UPDATE_CORPORATE_TEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_CORPORATE_STATUS_SUCCESS:
      return {
        ...state,
        offeredTests: state.offeredTests.map(offeredTest =>
          offeredTest.id.toString() === action.payload.id.toString()
            ? { offeredTest, ...action.payload }
            : offeredTest
        ),
      };

    case UPDATE_CORPORATE_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ACORPORATE_STATUS_SUCCESS:
      return {
        ...state,
        offeredTests: state.offeredTests.map(offeredTest =>
          offeredTest.id.toString() === action.payload.id.toString()
            ? { offeredTest, ...action.payload }
            : offeredTest
        ),
      };

    case UPDATE_ACORPORATE_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_OFFERED_TEST_SUCCESS:
      return {
        ...state,
        offeredTests: state.offeredTests.filter(
          offeredTest =>
            offeredTest.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_OFFERED_TEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default tests;
