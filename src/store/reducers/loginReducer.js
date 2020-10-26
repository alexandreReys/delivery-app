const INITIAL_STATE = {
  loggedUser: "",
};

export default function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ACTION_LOGIN":
      return handleLogin(state, action);
    case "ACTION_LOGOUT":
      return { ...state, loggedUser: "" };
    default:
      return state;
  }
}

const handleLogin = (state, { user }) => {
  return {
    ...state,
    loggedUser: user,
  };
};
