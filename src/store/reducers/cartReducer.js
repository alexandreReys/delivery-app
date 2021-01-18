const INITIAL_STATE = {
    item: [],
    addedItems: [], // id, description, quantity, price, image
    quantityOfItems: 0,
    subtotal: 0,
    shipping: 0,
    total: 0,
    paymentType: "",
    changeValue: 0,
    comments: "",
};

/////////////////////////////////////////////////////////////////////
export default function cartReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "ACTION_CART_RESET":
            return actionCartReset(state);

        case "ACTION_SELECT_PRODUCT":
            return actionSelectProduct(state, action);

        case "ACTION_ADD_TO_CART":
            return actionAddToCart(state, action);

        case "ACTION_SUB_FROM_CART":
            return actionSubFromCart(state, action);

        case "ACTION_REMOVE_FROM_CART":
            return actionRemoveFromCart(state, action);

        case "ACTION_SELECT_PAYMENT_TYPE":
            return actionSelectPaymentType(state, action);

        case "ACTION_SET_COMMENTS":
            return actionSetComments(state, action);

        default:
            return state;
    }
}

/////////////////////////////////////////////////////////////////////
const actionCartReset = (state) => {
    return {
        ...state,
        item: [],
        addedItems: [],
        quantityOfItems: 0,
        subtotal: 0,
        shipping: 0,
        total: 0,
        paymentType: "",
        changeValue: 0,
    };
};

const actionSelectProduct = (state, { product }) => {
    return {
        ...state,
        item: product,
    };
};

// itemToAdd = id:  description:  quantity:  price:  image:
const actionAddToCart = (state, { itemToAdd }) => {
    var newState;
    const stateAddedItem = state.addedItems.find((item) => item.id === itemToAdd.id);
    const qtty = !stateAddedItem ? itemToAdd.quantity : itemToAdd.quantity + stateAddedItem.quantity;
    const price = qtty >= 3 ? 2 : itemToAdd.price;
    const itemToAddTotal = price * itemToAdd.quantity;

    if (stateAddedItem) {
        stateAddedItem.quantity += itemToAdd.quantity;
        stateAddedItem.price = price;
        const subt = state.addedItems.reduce( (acc, item) => acc + (item.price * item.quantity), 0);
        newState = {
            ...state,
            shipping: itemToAdd.shippingTax,
            quantityOfItems: state.quantityOfItems + itemToAdd.quantity,
            subtotal: subt,
            total: (subt + itemToAdd.shippingTax),
        };
    } else {
        itemToAdd.price = price;   //  PREÇO PROMOC. POR QTDE
        newState = {
            ...state,
            addedItems: [...state.addedItems, itemToAdd],
            shipping: itemToAdd.shippingTax,
            quantityOfItems: state.quantityOfItems + itemToAdd.quantity,
            subtotal: state.subtotal + itemToAddTotal,
            total: (state.subtotal + itemToAdd.shippingTax) + itemToAddTotal,
        };
    };
    return newState;
};

// itemToSub = id:  quantity:  price:
const actionSubFromCart = (state, { itemToSub }) => {
    const stateAddedItem = state.addedItems.find((item) => item.id === itemToSub.id);
    let itemTotal = itemToSub.price * itemToSub.quantity;

    if (stateAddedItem) {
        if (stateAddedItem.quantity === 1) {
            return { ...state };
        }

        stateAddedItem.quantity -= itemToSub.quantity;
        return {
            ...state,
            shipping: itemToSub.shippingTax,
            quantityOfItems: state.quantityOfItems - itemToSub.quantity,
            subtotal: state.subtotal - itemTotal,
            total: (state.subtotal + state.shipping) - itemTotal,
        };
    }
};

const actionRemoveFromCart = (state, { itemToRemove }) => {
    const removedItem = state.addedItems.find(
        (item) => item.id === itemToRemove.id
    );
    let itemTotal = removedItem.price * removedItem.quantity;

    if (removedItem) {
        return {
            ...state,
            addedItems: state.addedItems.filter(
                (item) => item.id !== itemToRemove.id
            ),
            quantityOfItems: state.quantityOfItems - removedItem.quantity,
            subtotal: state.subtotal - itemTotal,
            total: state.subtotal - itemTotal + state.shipping,
        };
    }
    return { ...state };
};

const actionSelectPaymentType = (state, { paymentTypeData }) => {
    return {
        ...state,
        paymentType: paymentTypeData.paymentType,
        changeValue: paymentTypeData.changeValue,
    };
};

const actionSetComments = (state, { comments }) => {
    return {
        ...state,
        comments,
    };
};
