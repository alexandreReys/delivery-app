const INITIAL_STATE = {
  orders: [],
  order: null
};

export default function orderReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ACTION_SET_ORDERS":
      return actionSetOrders(state, action);
    case "ACTION_SET_ORDER":
      return actionSetOrder(state, action);
    case "ACTION_CLEAR_ORDERS":
      return actionClearOrders();
    default:
      return state;
  }
}

const actionSetOrders = (state, { orders }) => {
  return {
    ...state,
    orders,
  };
};

const actionSetOrder = (state, { order }) => {
  return {
    ...state,
    order,
  };
};

const actionClearOrders = (state) => {
  return {
    ...INITIAL_STATE,
  };
};
