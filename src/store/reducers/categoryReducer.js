const INITIAL_STATE = {
  categories: [],
};

export default function categoryReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ACTION_GET_CATEGORIES":
      return functionGetCategories(state, action);
    default:
      return state;
  }
}

const functionGetCategories = (state, { categories }) => {
  return {
    ...state,
    categories,
  };
};
