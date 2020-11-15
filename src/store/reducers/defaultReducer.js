const INITIAL_STATE = {
  appTitle: "Adega da Villa",
  loadingText: "Acessando dados ...",
  errorMsgText: "Verificando ...",
  adminModule: false,
  addressSellerSettings: "",
  shippingTaxSettings: 0,
  appBannerSettings: "",
  appBannerPublicIdSettings: "",
  appLogoPSettings: "",
  appLogoPPublicIdSettings: "",
};

export default function defaultReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ACTION_ADMIN_MODULE_ACTIVATE":
      return { ...state, adminModule: true };
    case "ACTION_ADMIN_MODULE_DEACTIVATE":
      return { ...state, adminModule: false };
    case "ACTION_GET_SETTINGS":
      return functionGetSettings(state, action);
    default:
      return state;
  }
}

const functionGetSettings = (state, { settings }) => {
  return {
    ...state,
    addressSellerSettings: settings.AddressSellerSettings,
    shippingTaxSettings: settings.ShippingTaxSettings,
    appBannerSettings: settings.AppBannerSettings,
    appBannerPublicIdSettings: settings.AppBannerPublicIdSettings,
    appLogoPSettings: settings.AppLogoPSettings,
    appLogoPPublicIdSettings: settings.AppLogoPPublicIdSettings,
    };
};
