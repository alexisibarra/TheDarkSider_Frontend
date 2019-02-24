import UserAPI from "../../API/UserAPI";
import { update as updateAuth } from "../AuthReducer/AuthReducer";
// Constants
export const ACTIONS = {
  UPDATE: "signup/UPDATE",
  CLEAR: "signup/CLEAR"
};

// Actions
export const update = payload => ({
  type: ACTIONS.UPDATE,
  payload
});

export const clear = _ => ({
  type: ACTIONS.CLEAR
});

const validateEmail = email =>
  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) || email.lentgh === 0;

const validatePassword = password => password.length < 8;

export const validateFields = _ => (dispatch, getState) => {
  const { password, email } = getState().signup;
  const newErrors = {};
  let disableSubmit = false;

  if (validateEmail(email)) {
    newErrors.email = "Invalid email";
    disableSubmit = true;
  }

  if (validatePassword(password)) {
    disableSubmit = true;
    newErrors.password = "Password must be at least 8 characters";
  }

  dispatch(update({ errors: newErrors, disableSubmit: disableSubmit }));
};

export const signup = _ => (dispatch, getState) => {
  const {
    signup: { email, password, errors }
  } = getState();

  return UserAPI.create({ user: { email, password } })
    .then(_ => dispatch(clear()))
    .catch(error => {
      dispatch(
        update({ errors: { ...errors, form: error.response.data.error } })
      );
    });
};

const initialState = {
  email: "",
  password: "",
  errors: {},
  active: { email: false, password: false },
  disableSubmit: true
};

const SignUpReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case ACTIONS.CLEAR: {
      return {
        ...initialState
      };
    }
    case ACTIONS.UPDATE: {
      return {
        ...state,
        ...payload
      };
    }
    default: {
      return state;
    }
  }
};

export default SignUpReducer;
