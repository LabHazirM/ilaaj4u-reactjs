import {
  GET_REFERREL_FEES_SUCCESS,
  GET_REFERREL_FEES_FAIL,
  GET_PUT_REFERREL_FEES_SUCCESS,
  GET_PUT_REFERREL_FEES_FAIL,
  UPDATE_REFERREL_FEE_SUCCESS,
  UPDATE_REFERREL_FEE_FAIL,
  UPDATE_REFERREL_ALL_FEE_SUCCESS,
  UPDATE_REFERREL_ALL_FEE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  referrelFeeLabs: [],
  error: {},
};

const referrelFeeLabs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REFERREL_FEES_SUCCESS:
      return {
        ...state,
        referrelFeeLabs: action.payload.data,
      };

    case GET_REFERREL_FEES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    case GET_PUT_REFERREL_FEES_SUCCESS:
      return {
        ...state,
        referrelFeeLabs: action.payload.data,
      };

    case GET_PUT_REFERREL_FEES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_REFERREL_FEE_SUCCESS:
      return {
        ...state,
        referrelFeeLabs: state.referrelFeeLabs.map(referrelFeeLab =>
          referrelFeeLab.id.toString() === action.payload.id.toString()
            ? { referrelFeeLab, ...action.payload }
            : referrelFeeLab
        ),
      };

    case UPDATE_REFERREL_FEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };


    case UPDATE_REFERREL_ALL_FEE_SUCCESS:
      return {
        ...state,
        referrelFeeLabs: state.referrelFeeLabs.map(referrelAllFee =>
          referrelAllFee.id.toString() === action.payload.id.toString()
            ? { referrelAllFee, ...action.payload }
              : referrelAllFee
        ),
      };

    case UPDATE_REFERREL_ALL_FEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      // case UPDATE_ALL_LAB_SHARE_SUCCESS:
      //   return {
      //     ...state,
      //     labShare: action.payload.data,
      //   };
  
      // case UPDATE_ALL_LAB_SHARE_FAIL:
      //   return {
      //     ...state,
      //     error: action.payload,
      //   };

    default:
      return state;
  }
};

export default referrelFeeLabs;
