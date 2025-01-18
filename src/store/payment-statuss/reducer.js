import {
  GET_PAYMENT_STATUSS_SUCCESS,
  GET_PAYMENT_STATUSS_FAIL,
  GET_PAYMENTOUT_STATUSS_SUCCESS,
  GET_PAYMENTOUT_STATUSS_FAIL,
  GET_DEPOSIT_STATUSS_SUCCESS,
  GET_DEPOSIT_STATUSS_FAIL,
  GET_CREATEDOUT_STATUSS_SUCCESS,
  GET_CREATEDOUT_STATUSS_FAIL,
  GET_CCREATEDOUT_STATUSS_SUCCESS,
  GET_CREATEDOUTDETAIL_STATUSS_SUCCESS,
  GET_CREATEDOUTDETAIL_STATUSS_FAIL,
  GET_CCREATEDOUT_STATUSS_FAIL,
  GET_CLEAR_STATUSS_SUCCESS,
  GET_CLEAR_STATUSS_FAIL,
  GET_PAYMENTOUT_CLEAR_STATUSS_SUCCESS,
  GET_PAYMENTOUT_CLEAR_STATUSS_FAIL,
  GET_BOUNCEDIN_STATUSS_SUCCESS,
  GET_BOUNCEDIN_STATUSS_FAIL,
  GET_BOUNCED_STATUSS_SUCCESS,
  GET_BOUNCED_STATUSS_FAIL,
  UPDATE_PAYMENT_STATUS_SUCCESS,
  UPDATE_PAYMENT_STATUS_FAIL,
  UPDATE_PAYMENTIN_STATUS_SUCCESS,
  UPDATE_PAYMENTIN_STATUS_FAIL,
  UPDATE_PAYMENTOUT_STATUS_SUCCESS,
  UPDATE_PAYMENTOUT_STATUS_FAIL,
  UPDATE_PAYMENTOUTCREATED_STATUS_SUCCESS,
  UPDATE_PAYMENTOUTCREATED_STATUS_FAIL,
  UPDATE_PAYMENTOUTCCREATED_STATUS_SUCCESS,
  UPDATE_PAYMENTOUTCCREATED_STATUS_FAIL,
  UPDATE_PAYMENTINBOUNCED_STATUS_SUCCESS,
  UPDATE_PAYMENTINBOUNCED_STATUS_FAIL,
  // ADD_OUT_PAYMENT_SUCCESS,
  // ADD_OUT_PAYMENT_FAIL,
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  GET_DONORS_SUCCESS,
  GET_DONORS_FAIL,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  GET_BANK_ACCOUNTS_SUCCESS,
  GET_BANK_ACCOUNTS_FAIL,
  DELETE_PAYMENTOUT_SUCCESS,
  DELETE_PAYMENTOUT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  paymentStatuss: [],
  paymentBouncedStatuss: [],
  paymentBouncedInStatuss: [],
  corporatePaymentStatuss: [],
  // outPayment: [],
  paymentCreatedStatuss: [],
  paymentOutCreatedStatuss: [],
  paymentOutStatuss: [],
  corporatepaymentOutStatuss:[],
  paymentInStatuss: [],
  bankAccounts: [],
  paymentInBouncedStatuss: [],
  banks: [],
  labs: [],
  donors: {},
  paymentout: [],
  error: {},
};

const paymentStatuss = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BANK_ACCOUNTS_SUCCESS:
      return {
        ...state,
        bankAccounts: action.payload.data,
      };

    case GET_BANK_ACCOUNTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_BANKS_SUCCESS:
      return {
        ...state,
        banks: action.payload.data,
      };

    case GET_BANKS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_LABS_SUCCESS:
        return {
          ...state,
          labs: action.payload.data,
        };
  
      case GET_LABS_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case GET_DONORS_SUCCESS:
          return {
            ...state,
            donors: action.payload.data,
          };
    
        case GET_DONORS_FAIL:
          return {
            ...state,
            error: action.payload,
          };
    case GET_PAYMENT_STATUSS_SUCCESS:
      return {
        ...state,
        paymentStatuss: action.payload.data,
      };

    case GET_PAYMENT_STATUSS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PAYMENTOUT_STATUSS_SUCCESS:
      return {
        ...state,
        paymentOutStatuss: action.payload.data,
      };

    case GET_PAYMENTOUT_STATUSS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DEPOSIT_STATUSS_SUCCESS:
        return {
          ...state,
          paymentStatuss: action.payload.data,
        };
  
    case GET_DEPOSIT_STATUSS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_CREATEDOUT_STATUSS_SUCCESS:
    
        return {
          ...state,
          paymentCreatedStatuss: action.payload.data,
        };
    
    case GET_CREATEDOUT_STATUSS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_CREATEDOUTDETAIL_STATUSS_SUCCESS:
    
        return {
          ...state,
          paymentCreatedStatuss: action.payload.data,
        };
    
    case GET_CREATEDOUTDETAIL_STATUSS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_CCREATEDOUT_STATUSS_SUCCESS:
      console.log('Action payload in reducer:',action.payload);
        return {
          ...state,
          paymentStatuss: action.payload.data,
        };
    
    case GET_CCREATEDOUT_STATUSS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_PAYMENTOUT_CLEAR_STATUSS_SUCCESS:
        return {
          ...state,
          paymentStatuss: action.payload.data,
        };
  
    case GET_PAYMENTOUT_CLEAR_STATUSS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_CLEAR_STATUSS_SUCCESS:
        return {
          ...state,
          paymentStatuss: action.payload.data,
        };
  
    case GET_CLEAR_STATUSS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_BOUNCED_STATUSS_SUCCESS:
        return {
          ...state,
          paymentBouncedStatuss: action.payload.data,
        };
  
    case GET_BOUNCED_STATUSS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    
      case GET_BOUNCEDIN_STATUSS_SUCCESS:
        return {
          ...state,
          paymentBouncedInStatuss: action.payload.data,
        };
    
      case GET_BOUNCEDIN_STATUSS_FAIL:
          return {
            ...state,
            error: action.payload,
          };

    case UPDATE_PAYMENT_STATUS_SUCCESS:
      return {
        ...state,
        paymentStatuss: state.paymentStatuss.map(paymentStatus =>
          paymentStatus.id.toString() === action.payload.id.toString()
            ? { paymentStatus, ...action.payload }
            : paymentStatus
        ),
      };

    case UPDATE_PAYMENT_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_PAYMENTOUT_STATUS_SUCCESS:
      return {
        ...state,
        paymentOutStatuss: state.paymentOutStatuss.map(paymentOutStatus =>
          paymentOutStatus.id.toString() === action.payload.id.toString()
            ? { paymentOutStatus, ...action.payload }
            : paymentOutStatus
        ),
      };

    case UPDATE_PAYMENTOUT_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PAYMENTIN_STATUS_SUCCESS:
      return {
        ...state,
        paymentInStatuss: state.paymentInStatuss.map(paymentInStatus =>
          paymentInStatus.id.toString() === action.payload.id.toString()
            ? { paymentInStatus, ...action.payload }
            : paymentInStatus
        ),
      };

    case UPDATE_PAYMENTIN_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PAYMENTOUTCREATED_STATUS_SUCCESS:
      return {
        ...state,
        paymentOutCreatedStatus: state.paymentInStatuss.map(paymentOutCreatedStatus =>
          paymentOutCreatedStatus.id.toString() === action.payload.id.toString()
            ? { paymentOutCreatedStatus, ...action.payload }
            : paymentOutCreatedStatus
        ),
      };

    case UPDATE_PAYMENTOUTCREATED_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PAYMENTOUTCCREATED_STATUS_SUCCESS:
      return {
        ...state,
        paymentOutCreatedStatus: state.paymentInStatuss.map(paymentOutCreatedStatus =>
          paymentOutCreatedStatus.id.toString() === action.payload.id.toString()
            ? { paymentOutCreatedStatus, ...action.payload }
            : paymentOutCreatedStatus
        ),
      };

    case UPDATE_PAYMENTOUTCCREATED_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };  
  
    case UPDATE_PAYMENTINBOUNCED_STATUS_SUCCESS:
      return {
        ...state,
        paymentInBouncedStatuss: state.paymentInBouncedStatuss.map(paymentInBouncedStatus =>
          paymentInBouncedStatus.id.toString() === action.payload.id.toString()
            ? { paymentInBouncedStatus, ...action.payload }
            : paymentInBouncedStatus
        ),
      };

    case UPDATE_PAYMENTINBOUNCED_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      // case ADD_OUT_PAYMENT_SUCCESS:
      //   return {
      //     ...state,
      //     outPayments: [...state.outPayments, action.payload.data],
      //   };
  
      // case ADD_OUT_PAYMENT_FAIL:
      //   return {
      //     ...state,
      //     error: action.payload,
      //   };

        case DELETE_PAYMENTOUT_SUCCESS:
      return {
        ...state,
        paymentouts: state.paymentouts.filter(
          paymentout =>
            paymentout.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_PAYMENTOUT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

  
    default:
      return state;
  }
};

export default paymentStatuss;
