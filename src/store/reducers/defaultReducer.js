const INITIAL_STATE = {
  appTitle: "Adega da Villa",
  loadingText: "Acessando dados ...",
  errorMsgText: "Verificando ...",
  adminModule: false,

  operationIsEnabledSettings: 1,
  addressSellerSettings: "",
  webBannerSettings: "",
  webBannerPublicIdSettings: "",
  appBannerSettings: "",
  appBannerPublicIdSettings: "",
  appBanner2Settings: "",
  appBanner2PublicIdSettings: "",
  appBanner3Settings: "",
  appBanner3PublicIdSettings: "",
  appLogoPSettings: "",
  appLogoPPublicIdSettings: "",
  urlDeliveryMap: "",
  urlGooglePlay: "",
  contactPhone: "",
  contactEmail: "",
  contactWhatsapp: "",
  deliveryAreaDistance: 0,
  shippingTaxSettings: 0,
  deliveryAreaDistance2: 0,
  shippingTax2Settings: 0,
  deliveryAreaDistance3: 0,
  shippingTax3Settings: 0,
};

export default function defaultReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ACTION_ADMIN_MODULE_ACTIVATE":
      return { ...state, adminModule: true };
    case "ACTION_ADMIN_MODULE_DEACTIVATE":
      return { ...state, adminModule: false };
    case "ACTION_GET_SETTINGS":
      return getSettings(state, action);
    default:
      return state;
  };
};

const getSettings = (state, { settings }) => {
  return {
    ...state,
    operationIsEnabledSettings: settings.OperationIsEnabledSettings,
    addressSellerSettings: settings.AddressSellerSettings,
    webBannerSettings: settings.WebBannerSettings,
    webBannerPublicIdSettings: settings.WebBannerPublicIdSettings,
    appBannerSettings: settings.AppBannerSettings,
    appBannerPublicIdSettings: settings.AppBannerPublicIdSettings,
    appBanner2Settings: settings.AppBanner2Settings,
    appBanner2PublicIdSettings: settings.AppBanner2PublicIdSettings,
    appBanner3Settings: settings.AppBanner3Settings,
    appBanner3PublicIdSettings: settings.AppBanner3PublicIdSettings,
    appLogoPSettings: settings.AppLogoPSettings,
    appLogoPPublicIdSettings: settings.AppLogoPPublicIdSettings,
    urlDeliveryMap: settings.UrlDeliveryMap,
    urlGooglePlay: settings.UrlGooglePlay,
    contactPhone: settings.ContactPhone,
    contactEmail: settings.ContactEmail,
    contactWhatsapp: settings.ContactWhatsapp,
    deliveryAreaDistance: settings.DeliveryAreaDistance,
    shippingTaxSettings: settings.ShippingTaxSettings,
    deliveryAreaDistance2: settings.DeliveryAreaDistance2,
    shippingTax2Settings: settings.ShippingTax2Settings,
    deliveryAreaDistance3: settings.DeliveryAreaDistance3,
    shippingTax3Settings: settings.ShippingTax3Settings,
    efectiveShippingTax: settings.ShippingTaxSettings,
  };
};
