import {
  GET_CORPORATE_PROFILE_SUCCESS,
  GET_CORPORATE_PROFILE_FAIL,
  UPDATE_CORPORATE_PROFILE_SUCCESS,
  UPDATE_CORPORATE_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  CorporateProfile: [],
  error: "",
  success: "",
};

const corporateProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CORPORATE_PROFILE_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_CORPORATE_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CORPORATE_PROFILE_SUCCESS:
      console.log('Updating corporate profile:', action.payload);
      return {
        ...state,
        CorporateProfile: state.CorporateProfile.map(CorporateProfile =>
          CorporateProfile.id.toString() === action.payload.id.toString()
            ? { CorporateProfile, ...action.payload }
            : CorporateProfile
        ),
      };

    case UPDATE_CORPORATE_PROFILE_FAIL:
      console.log('Updating corporate profile:', action.payload);
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default corporateProfile;
