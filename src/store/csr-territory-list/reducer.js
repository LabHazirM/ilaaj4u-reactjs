import {
  GET_CSR_CENTRAL_TERRITORY_LIST_SUCCESS,
  GET_CSR_CENTRAL_TERRITORY_LIST_FAIL,
  GET_CSR_SOUTH_TERRITORY_LIST_SUCCESS,
  GET_CSR_SOUTH_TERRITORY_LIST_FAIL,
  GET_CSR_NORTH_TERRITORY_LIST_SUCCESS,
  GET_CSR_NORTH_TERRITORY_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  csrCentralTerritoryList: [],
  csrSouthTerritoryList: [],
  csrNorthTerritoryList: [],
  error: {},
};

const csrTerritoryList = (state = INIT_STATE, action) => {
  switch (action.type) {
    // central
    case GET_CSR_CENTRAL_TERRITORY_LIST_SUCCESS:
      return {
        ...state,
        csrCentralTerritoryList: action.payload.data,
      };

    case GET_CSR_CENTRAL_TERRITORY_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
   // South
      case GET_CSR_SOUTH_TERRITORY_LIST_SUCCESS:
        return {
          ...state,
          csrSouthTerritoryList: action.payload.data,
        };
  
      case GET_CSR_SOUTH_TERRITORY_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      // North
        case GET_CSR_NORTH_TERRITORY_LIST_SUCCESS:
          return {
            ...state,
            csrNorthTerritoryList: action.payload.data,
          };
    
        case GET_CSR_NORTH_TERRITORY_LIST_FAIL:
          return {
            ...state,
            error: action.payload,
          };
      
    default:
      return state;
  }
};

export default csrTerritoryList;
