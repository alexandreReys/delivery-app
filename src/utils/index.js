import { Alert } from "react-native";
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location";
// import * as orderService from "../services/orderService";
import * as mapsService from "../services/mapsService";

import store from "../store";
import * as masks from "./masks";

import * as actions from "../store/actions";
import noImage from "../../assets/no-image.png";

export const testaCPF = (pStrCPF) => {
    var Soma;
    var Resto;
    
    let strCPF = pStrCPF.replace(/[^0-9]/g,'');

    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;

    return true;
}

function TestarFuncaoCPF() {
    // /^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2})|([0-9]{11}))$/
    var strCPF = "12345678909";
    alert(TestaCPF(strCPF));

//     function(){
// 		var campo = $('input').val(); // Pega valor do campo
//     nomeSobrenome = /\b[A-Za-zÀ-ú][A-Za-zÀ-ú]+,?\s[A-Za-zÀ-ú][A-Za-zÀ-ú]{2,19}\b/gi;
//     // Regex para duas strings, separadas com espaço e com no mínimo 3 caracteres. Aceita acentuação e rejeita números.
    
//     // Faz a validacao do regex no campo indicado
//     if(!(nomeSobrenome.test(campo))){
// 			alert('Inválido');      
// 		}else{
// 			alert('Válido');
// 		}
// }
};


// dd/mm/yyyy
export const formattedDate = (date) => {
    const d = date.toString().substring(0, 10);
    return d.substr(8, 2) + "/" + d.substr(5, 2) + "/" + d.substr(0, 4);
};

// dd/mm/yyyy 00:00
export const formattedDateTime = (date, time) => {
    const d = date.toString().substring(0, 10);
    const t = time.toString().substring(0, 5);
    return d.substr(8, 2) + "/" + d.substr(5, 2) + "/" + d.substr(0, 4) + " " + t;
};

export const adjustPromotionalPrice = (list) => {
    list = { ...list, PrecoAnterVinho: list.PrecoVinho };
    if (list.EmPromocaoVinho && list.PrecoPromocionalVinho > 0) list.PrecoVinho = list.PrecoPromocionalVinho;
    return list;
};

export const getPrice = (product) => {
    let precoVinho, precoAnterVinho;

    if (
        !!product.DescriptionProductVariation && 
        product.QuantityProductVariation > 0 &&
        product.PriceProductVariation > 0
    ) {

        precoVinho = masks.moneyMask(product.PriceProductVariation);
        precoAnterVinho = masks.moneyMask(product.PriceProductVariation);

    } else {
        if (!product.EmPromocaoVinho || !product.PrecoPromocionalVinho) {

            precoVinho = masks.moneyMask(product.PrecoVinho);
            precoAnterVinho = masks.moneyMask(product.PrecoVinho);

        } else {

            if (product.EmPromocaoVinho && product.PrecoVinho >= 100) {
                precoVinho = masks.numberMask(product.PrecoVinho)
            } else {
                precoVinho = masks.moneyMask(product.PrecoVinho)
            };
        
            if (product.EmPromocaoVinho && product.PrecoPromocionalVinho >= 100) {
                precoAnterVinho = masks.moneyMaskSpaceless(product.PrecoAnterVinho)
            } else {
                precoAnterVinho = masks.moneyMask(product.PrecoAnterVinho)
            };

        };
    };
    
    return { precoVinho, precoAnterVinho };
};

export const showAlert = (title, message) => {
    Alert.alert(
        title,
        message,
        [{ text: "OK" }],
        { cancelable: true }
    )
};

export const fieldInvalidMessage = message => {
    Alert.alert("Campo Invalido", message)
};

export const orderPrevision = (date, time) => {
    const d = new Date(`${date}T${time}`);
    const date30minutes = dateAdd(d, 'minute', +30);
    const response = leftPad(date30minutes.getUTCHours(), 2) + ":" + leftPad(date30minutes.getMinutes(), 2);
    return response;
};

function leftPad(value, totalWidth, paddingChar) {
    var length = totalWidth - value.toString().length + 1;
    return Array(length).join(paddingChar || '0') + value;
};

export const dateAdd = (date, interval, units) => {
    //  d = new Date('2020-08-28 12:00:00');
    //  log('+1 year:    ' + dateAdd(d, 'YEAR', 1));
    //  log('-1 year:    ' + dateAdd(d, 'YEAR', -1));
    //  log('+1 quarter: ' + dateAdd(d, 'QUARTER', 1));
    //  log('+1 month:   ' + dateAdd(d, 'MONTH', 1));
    //  log('+1 week:    ' + dateAdd(d, 'week', 1));
    //  log('+1 day:     ' + dateAdd(d, 'day', 1));
    //  log('+1 hour:    ' + dateAdd(d, 'hour', 1));
    //  log('+1 minute:  ' + dateAdd(d, 'minute', 1));
    //  log('+1 second:  ' + dateAdd(d, 'second', 1));

    if (!(date instanceof Date)) return undefined;

    var ret = new Date(date); //don't change original date

    var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };

    switch (String(interval).toLowerCase()) {
        case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
        case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
        case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
        case 'week': ret.setDate(ret.getDate() + 7 * units); break;
        case 'day': ret.setDate(ret.getDate() + units); break;
        case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
        case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
        case 'second': ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;
    }
    return ret;
}

export const filterDesc25 = (desc) => {
    if (!desc.trim()) return "Clique para digitar endereço";
    if (desc.length < 25) return desc;
    return `${desc.substring(0, 22)}...`
};

export const getImage = (uri) => {
    if (uri) return { uri };
    return noImage;
};

export async function loadInitialPosition() {
    const { granted } = await requestPermissionsAsync();

    if (granted) {
        const { coords } = await getCurrentPositionAsync({
            enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        return {
            latitude,
            longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
        };
    };
};

export const getShortAddress = (addr) => {
    let address = "";

    address += !addr.street ? "" : addr.street;
    address += !addr.number ? "" : ", " + addr.number;
    address += !addr.neighborhood ? "" : " " + addr.neighborhood;
    address += !addr.city ? "" : " " + addr.city;
    address += !addr.state ? "" : " " + addr.state;
    address += !addr.postalCode ? "" : " " + addr.postalCode;

    return address;
};

export const getShippingTax = async () => {
    const settings = store.getState().defaultState;
    const deliveryInfo = store.getState().addressState;

    if (!deliveryInfo.street) return settings.shippingTaxSettings;

    let customerDistance = store.getState().cartState.customerDistance;

    if (!customerDistance) {
        const addr = getShortAddress(deliveryInfo);
        const distances = await mapsService.googleDistance( addr );
        customerDistance = (distances.distance.value / 1000).toFixed(2);
        store.dispatch( actions.actionSetCustomerDistance(customerDistance) );
    };
    
    if (!settings.deliveryAreaDistance2) return settings.shippingTaxSettings;

    if (!customerDistance) return settings.shippingTaxSettings;

    return ( customerDistance <= settings.deliveryAreaDistance2 )
        ? settings.shippingTax2Settings
        : settings.shippingTaxSettings;
};