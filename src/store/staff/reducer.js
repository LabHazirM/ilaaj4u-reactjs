import {
  GET_CSR_LIST_SUCCESS,
  GET_CSR_LIST_FAIL,
  GET_MARKETERS_LIST_SUCCESS,
  GET_MARKETERS_LIST_FAIL,
  GET_AUDITOR_LIST_SUCCESS,
  GET_AUDITOR_LIST_FAIL,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  GET_FINANCE_OFFICER_LIST_SUCCESS,
  GET_FINANCE_OFFICER_LIST_FAIL,
  ADD_STAFF,
  ADD_STAFF_SUCCESS,
  ADD_STAFF_FAIL,
  UPDATE_STAFF_SUCCESS,
  UPDATE_STAFF_FAIL,
  DELETE_STAFF_SUCCESS,
  DELETE_STAFF_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  staff: [],
  csrList: [],
  marketersList: [],
  auditorList: [],
  territoriesList: [],
  financeOfficerList: [],
  error: {},
  addStaffError: null,
  addStaffSuccess: null,
  loading: false,
  message: null,
};

const staff = (state = INIT_STATE, action) => {
  switch (action.type) {
     // territories
     case GET_TERRITORIES_LIST_SUCCESS:
      return {
        ...state,
        territoriesList: action.payload.data,
      };

    case GET_TERRITORIES_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_CSR_LIST_SUCCESS:
      return {
        ...state,
        csrList: action.payload.data,
      };

    case GET_CSR_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_MARKETERS_LIST_SUCCESS:
        return {
          ...state,
          marketersList: action.payload.data,
        };
  
      case GET_MARKETERS_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    case GET_AUDITOR_LIST_SUCCESS:
      return {
        ...state,
        auditorList: action.payload.data,
      };

    case GET_AUDITOR_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FINANCE_OFFICER_LIST_SUCCESS:
      return {
        ...state,
        financeOfficerList: action.payload.data,
      };

    case GET_FINANCE_OFFICER_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case ADD_STAFF:
        return {
          ...state,
          staff: null,
          loading: true,
          addStaffError: null,
          addStaffSuccess: null,
        };
    case ADD_STAFF_SUCCESS:
      return {
        ...state,
        loading: false,
        staff: action.payload,
        addStaffError: null,
        addStaffSuccess: action.payload.staff
      };
      case ADD_STAFF_FAIL:
        return {
          ...state,
          staff: null,
          loading: false,
          addStaffError: action.payload.staff,
          addStaffSuccess: null,
        };
    case UPDATE_STAFF_SUCCESS:
      return {
        ...state,
        staff: state.staff.map(person =>
          person.id.toString() === action.payload.id.toString()
            ? { person, ...action.payload }
            : person
        ),
      };

    case UPDATE_STAFF_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_STAFF_SUCCESS:
      return {
        ...state,
        staff: state.staff.filter(
          person => person.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_STAFF_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default staff;
