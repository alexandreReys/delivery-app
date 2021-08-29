const INITIAL_STATE = {
  loggedUser: "",
  token: "",
};

export default function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ACTION_LOGIN":
      return handleLogin(state, action);
    case "ACTION_LOGOUT":
      return { ...state, loggedUser: "", token: "" };
    default:
      return state;
  }
}

const handleLogin = (state, { authData }) => {
  return {
    ...state,
    loggedUser: authData.userName,
    token: authData.token,
    // token: authData.user,
  };
};
