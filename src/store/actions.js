export function actionAdminModuleActivate() {
  return { type: "ACTION_ADMIN_MODULE_ACTIVATE" };
};
export function actionAdminModuleDeactivate() {
  return { type: "ACTION_ADMIN_MODULE_DEACTIVATE" };
};
export function actionGetSettings(settings) {
  return { type: "ACTION_GET_SETTINGS", settings };
};

export function actionLogin(user) {
  return { type: "ACTION_LOGIN", user };
};
export function actionLogout() {
  return { type: "ACTION_LOGOUT" };
};

export function actionSetOrders(orders) {
  return { type: "ACTION_SET_ORDERS", orders };
};
export function actionSetOrder(order) {
  return { type: "ACTION_SET_ORDER", order };
};
export function actionClearOrders() {
  return { type: "ACTION_CLEAR_ORDERS" };
};

export function actionVinhoGetProducts(products) {
  return { type: "ACTION_VINHO_GET_PRODUCTS", products };
};
export function actionVinhoAdd() {
  return { type: "ACTION_VINHO_ADD" };
};
export function actionVinhoEdit(dadosVinho) {
  return { type: "ACTION_VINHO_EDIT", dadosVinho };
};
export function actionVinhoDelete() {
  return { type: "ACTION_VINHO_DELETE" };
};
export function actionVinhoList() {
  return { type: "ACTION_VINHO_LIST" };
};
export function actionSetProductCategory(category) {
  return { type: "ACTION_SET_PRODUCT_CATEGORY", category };
};

export function actionCartReset() {
  return { type: "ACTION_CART_RESET" };
};
export function actionCartRecalculate(shippingTaxInfo) {
  return { type: "ACTION_CART_RECALCULATE", shippingTaxInfo };
};
export function actionSelectProduct(product) {
  return { type: "ACTION_SELECT_PRODUCT", product };
};
export function actionAddToCart(itemToAdd) {
  return { type: "ACTION_ADD_TO_CART", itemToAdd };
};
export function actionSubFromCart(itemToSub) {
  return { type: "ACTION_SUB_FROM_CART", itemToSub };
};
export function actionRemoveFromCart(itemToRemove) {
  return { type: "ACTION_REMOVE_FROM_CART", itemToRemove };
};
export function actionSelectPaymentType(paymentTypeData) {
  return { type: "ACTION_SELECT_PAYMENT_TYPE", paymentTypeData };
};
export function actionSetComments(comments) {
  return { type: "ACTION_SET_COMMENTS", comments };
};
export function actionSetCustomerDistance(customerDistance) {
  return { type: "ACTION_SET_CUSTOMER_DISTANCE", customerDistance };
};

export function actionGetDeliveryAddress(address) {
  return { type: "ACTION_GET_DELIVERY_ADDRESS", address };
};
export function actionDeliveryAddressSave(address) {
  return { type: "ACTION_DELIVERY_ADDRESS_SAVE", address };
};
export function actionSetCustomerInfo(customerInfo) {
  return { type: "ACTION_SET_CUSTOMER_INFO", customerInfo };
};
export function actionSetCoords(coords) {
  return { type: "ACTION_SET_COORDS", coords };
};

export function actionGetCategories(data) {
  return { type: "ACTION_GET_CATEGORIES", data };
};
