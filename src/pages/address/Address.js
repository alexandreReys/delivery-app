import React, { useEffect, useRef, useState } from "react";
import {
    Alert, BackHandler, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity,
    View
} from "react-native";
import Loader from "../../components/Loader";
import * as defs from "../../configs/default";
import * as mapsService from "../../services/mapsService";
import * as orderService from "../../services/orderService";
import * as settingsService from "../../services/settingsService";
import store from "../../store";
import * as actions from "../../store/actions";
import * as utils from "../../utils";
import * as masks from "../../utils/masks";




const Address = ({ route, navigation }) => {

    const [loading, setLoading] = useState(false);
    const [deliveryAreaDistance, setDeliveryAreaDistance] = useState(0);

    // const [name, setName] = useState(store.getState().addressState.name);
    // const [document, setDocument] = useState(store.getState().addressState.document);
    // const [phoneNumber, setPhoneNumber] = useState(store.getState().addressState.phoneNumber);
    const [postalCode, setPostalCode] = useState(store.getState().addressState.postalCode);
    const [street, setStreet] = useState(store.getState().addressState.street);
    const [number, setNumber] = useState(store.getState().addressState.number);
    const [complement, setComplement] = useState(store.getState().addressState.complement);
    const [info, setInfo] = useState(store.getState().addressState.info);
    const [neighborhood, setNeighborhood] = useState(store.getState().addressState.neighborhood);
    const [city, setCity] = useState(store.getState().addressState.city);
    const [state, setState] = useState(store.getState().addressState.state);

    const [stateAddress, setStateAddress] = useState(orderService.getAddress(store.getState().addressState));
    const [buttonEnabled, setButtonEnabled] = useState(true);
    const [onEdit, setOnEdit] = useState(false);
    const refPostalCodeInput = useRef(null);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);

        (async function getSettings() {
            if (!deliveryAreaDistance || deliveryAreaDistance === 0) {
                if ( 
                    !store.getState().defaultState.deliveryAreaDistance || 
                    store.getState().defaultState.deliveryAreaDistance === 0
                ) {
                    await settingsService.get();
                };
                setDeliveryAreaDistance(store.getState().defaultState.deliveryAreaDistance);
            };
        })();

        if (!postalCode) {
            setOnEdit(true);
        };
    }, []);

    async function handleSubmit() {
        const addressValues = verifyFields();

        if (!addressValues) return false;

        store.dispatch( actions.actionDeliveryAddressSave(addressValues) );
        
        const addr = utils.getShortAddress(addressValues);
        const distances = await mapsService.googleDistance( addr );
        const customerDistance = (distances.distance.value / 1000).toFixed(2);

        if ( customerDistance > deliveryAreaDistance ) {
            store.dispatch( actions.actionCartReset() );

            utils.showAlert( "Sinto Muito ...", 
`Infelizmente você se encontra fora de nossa area de entrega !! 
            
Atendemos uma área de ${deliveryAreaDistance} kms e você se encontra a ${customerDistance} kms`
            );
        };

        store.dispatch( actions.actionSetCustomerDistance(customerDistance) );
        
        store.dispatch( actions.actionCartRecalculate(
            {
                deliveryAreaDistance: store.getState().defaultState.deliveryAreaDistance,
                shippingTaxSettings: store.getState().defaultState.shippingTaxSettings,
                deliveryAreaDistance2: store.getState().defaultState.deliveryAreaDistance2,
                shippingTax2Settings: store.getState().defaultState.shippingTax2Settings,
                deliveryAreaDistance3: store.getState().defaultState.deliveryAreaDistance3,
                shippingTax3Settings: store.getState().defaultState.shippingTax3Settings,
            }
        ));
        navigation.navigate(route.params);
    };

    function verifyFields() {
        if (!buttonEnabled) return null;
        if (!city) return null;
        const addressValues = {
            // name, 
            // document, 
            // phoneNumber, 
            addressType: " ", 
            postalCode, 
            street, 
            number, 
            complement, 
            info, 
            neighborhood, 
            city, 
            state,
        };
        if (!validateFields(addressValues)) return null;

        return addressValues;
    };

    const fillAddressByZipCode = async () => {
        if (!postalCode) return;

        const zipCode = postalCode;

        setStateAddress(null);

        setStreet(null)
        setNeighborhood(null);
        setCity(null);
        setState(null);

        if (!zipCode) {
            Alert.alert("oops", "Cep é informação obrigatória !!");
            return false;
        }

        if (zipCode.length < 9) {
            Alert.alert("CEP Invalido", "O Cep deve ter 9 digitos !!");
            setPostalCode("");
            refPostalCodeInput.current.focus();
            return false;
        }

        const zipCodeClean = zipCode.substr(0, 5) + zipCode.substr(6, 3);

        setButtonEnabled(false);

        setStateAddress("CONSULTANDO CEP ...");

        setStreet(" ");
        setNeighborhood(" ");
        setCity(" ");
        setState(" ");

        setLoading(true);
        const addr = await orderService.getCep(zipCodeClean);
        setLoading(false);

        if (!addr || !addr.logradouro) {
            utils.showAlert("Erro Consulta Cep", `Cep ${zipCode} não encontrado !!`);
            setStreet(" ");
            setPostalCode(" ");
            setStateAddress("CEP não encontrado !!")
            setButtonEnabled(true);
            return false;
        };

        setStateAddress(orderService.getAddress({
            street: addr.logradouro,
            number: number ? number : "",
            neighborhood: addr.bairro,
            city: addr.cidade.nome,
            state: addr.estado.sigla,
            complement: "",
        }));

        setStreet(addr.logradouro);
        setNeighborhood(addr.bairro);
        setCity(addr.cidade.nome);
        setState(addr.estado.sigla);

        setButtonEnabled(true);
    };

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>

            { loading && (<Loader />)}

            <ScrollView
                vertical
                showsVerticalScrollIndicator={false}
            >
                {/* Onde deseja receber seu pedido ? */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        Onde deseja receber seu pedido ?
                    </Text>
                </View>

                { !onEdit && ( 
                    <>
                        {/* Painel endereço */}
                        <View style={styles.addressPanel}>
                            <Text style={styles.addressPanelText}>
                                {stateAddress}
                            </Text>
                        </View>

                        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginHorizontal: 20}}>

                            {/* BOTÃO CONFIRMAR */}
                            <TouchableOpacity
                                style={[
                                    styles.confirmContainer,
                                    {
                                        marginHorizontal: 1,
                                        width: "48%",
                                        backgroundColor: !!buttonEnabled ? defs.confirmButtonColor() : "silver" 
                                    }
                                ]}
                                onPress={handleSubmit}
                            >
                                <Text style={[styles.confirmText, {fontSize: 18}]}>
                                    Confirmar
                                </Text>
                            </TouchableOpacity>

                            {/* Botão alterar */}
                            <TouchableOpacity
                                style={[
                                    styles.confirmContainer,
                                    {
                                        marginHorizontal: 1,
                                        width: "48%",
                                        backgroundColor: !!buttonEnabled ? defs.confirmButtonColor() : "silver" 
                                    }
                                ]}
                                onPress={() => setOnEdit(true)}
                            >
                                <Text style={[styles.confirmText, {fontSize: 18}]}>
                                    Alterar
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </>
                )}

                { onEdit && ( 
                    <>
                        {/* CEP */}
                        <View style={{ flexDirection: "row", marginTop: 15, marginHorizontal: 20 }}>
                            {/* CEP */}
                            <View style={[{ flexDirection: "column", width: "40%", marginRight: "10%" }]}>
                                <Text style={[styles.textInputLabel]}>
                                    Cep
                                </Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    ref={refPostalCodeInput}
                                    keyboardType="numeric"
                                    maxLength={9}
                                    onChangeText={text => setPostalCode(masks.cepMask(text))}
                                    onBlur={fillAddressByZipCode}
                                    defaultValue={postalCode}
                                />
                            </View>

                            {/* Numero */}
                            <View style={{ flexDirection: "column", width: "40%" }}>
                                <Text style={styles.textInputLabel}>
                                    Numero
                                </Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    keyboardType="numeric"
                                    maxLength={15}
                                    onChangeText={text => setNumber(text)}
                                    defaultValue={number}
                                />
                            </View>
                        </View>

                        {/* Complemento */}
                        <View style={{ flexDirection: "row", marginHorizontal: 20, paddingTop: 10 }}>
                            {/* Complemento */}
                            <View style={[{ flexDirection: "column", width: "100%", marginRight: "10%" }]}>
                                <Text style={[styles.textInputLabel]}>
                                    Complemento
                                </Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    onChangeText={text => setComplement(text)}
                                    defaultValue={complement}
                                />
                            </View>
                        </View>

                        {/* Referência */}
                        <View style={{ flexDirection: "row", marginHorizontal: 20, paddingTop: 10 }}>
                            {/* Referência */}
                            <View style={[{ flexDirection: "column", width: "100%", marginRight: "10%" }]}>
                                <Text style={[styles.textInputLabel]}>
                                    Referência
                                </Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    onChangeText={text => setInfo(text)}
                                    defaultValue={info}
                                />
                            </View>
                        </View>

                        {/* Painel endereço */}
                        <View style={styles.addressPanel}>
                            <Text style={styles.addressPanelText}>
                                {stateAddress}
                            </Text>
                        </View>

                        {/* Botão Salvar */}
                        <TouchableOpacity
                            style={[
                                styles.confirmContainer,
                                {
                                    marginTop: 30,
                                    marginHorizontal: 20,
                                    backgroundColor: !!buttonEnabled ? defs.confirmButtonColor() : "silver" 
                                }
                            ]}
                            onPress={handleSubmit}
                        >
                            <Text style={[styles.confirmText, {fontSize: 18}]}>
                                Salvar
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

            </ScrollView>

        </KeyboardAvoidingView>
    )
};

function Input({ label, setFunction, state }) {
    return (
        <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>
                {label}
            </Text>
            <TextInput
                style={styles.textInput}
                onChangeText={text => setFunction(text)}
                defaultValue={state}
            />
        </View>
    );
};

function Label({ label, state }) {
    return (
        <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 20 }}>
            <Text style={{ color: "#285395", fontWeight: "bold", fontSize: 18 }}>
                {label}:
      </Text>
            <Text style={{ color: "#000000", fontSize: 18 }}>
                {" " + state ? state : null}
            </Text>
        </View>
    );
};

const validateFields = (address) => {
    if (!address.postalCode) {
        utils.fieldInvalidMessage("Campo CEP é obrigatório !!");
        return false;
    }
    if (address.postalCode.length < 9) {
        utils.fieldInvalidMessage("Cep Invalido !!");
        return false;
    }
    if (!address.number) {
        utils.fieldInvalidMessage("Campo Numero é obrigatório !!");
        return false;
    }

    return true;
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: "white",
        marginHorizontal: 20,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: "2%",
    },
    headerText: { 
        fontSize: 16,
        fontWeight: "bold", 
        color: "black",
    },
    addressPanel: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "white",
        marginHorizontal: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "grey",
        elevation: 5,
        marginTop: 20,
        paddingVertical: 20,
        paddingHorizontal: "5%",
    },
    addressPanelText: { 
        fontSize: 16,
        color: "grey" 
    },
    textInputContainer: {
        marginTop: 10,
        // marginHorizontal: 20,
    },
    textInputLabel: {
        color: "#285395",
        fontWeight: "bold",
    },
    textInput: {
        height: 30,
        // borderColor: 'gray',
        // borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        backgroundColor: "white",
        elevation: 5,
    },
    confirmContainer:
        defs.confirmButtonContainer(),
    confirmText:
        defs.confirmButtonText(),

});

export default Address;