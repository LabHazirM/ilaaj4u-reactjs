import {
  GET_AUDITOR_CENTRAL_TERRITORY_LIST_SUCCESS,
  GET_AUDITOR_CENTRAL_TERRITORY_LIST_FAIL,
  GET_AUDITOR_SOUTH_TERRITORY_LIST_SUCCESS,
  GET_AUDITOR_SOUTH_TERRITORY_LIST_FAIL,
  GET_AUDITOR_NORTH_TERRITORY_LIST_SUCCESS,
  GET_AUDITOR_NORTH_TERRITORY_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  auditorCentralTerritoryList: [],
  auditorSouthTerritoryList: [],
  auditorNorthTerritoryList: [],
  error: {},
};

const auditorTerritoryList = (state = INIT_STATE, action) => {
  switch (action.type) {
    // central
    case GET_AUDITOR_CENTRAL_TERRITORY_LIST_SUCCESS:
      return {
        ...state,
        auditorCentralTerritoryList: action.payload.data,
      };

    case GET_AUDITOR_CENTRAL_TERRITORY_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
   // South
      case GET_AUDITOR_SOUTH_TERRITORY_LIST_SUCCESS:
        return {
          ...state,
          auditorSouthTerritoryList: action.payload.data,
        };
  
      case GET_AUDITOR_SOUTH_TERRITORY_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      // North
        case GET_AUDITOR_NORTH_TERRITORY_LIST_SUCCESS:
          return {
            ...state,
            auditorNorthTerritoryList: action.payload.data,
          };
    
        case GET_AUDITOR_NORTH_TERRITORY_LIST_FAIL:
          return {
            ...state,
            error: action.payload,
          };
      
    default:
      return state;
  }
};

export default auditorTerritoryList;
