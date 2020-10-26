import React, { useState, useEffect, useRef } from "react";
import {
    KeyboardAvoidingView, StyleSheet, Alert,
    View, Text, Image, TouchableOpacity, TextInput
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInputMask } from "react-native-masked-text";
import { moneyInputConfig } from "../../configs/textInputMaskConfig";

import store from "../../store";
import { actionSelectPaymentType, actionSetCustomerInfo } from "../../store/actions";
import * as utils from "../../utils/masks";
import * as masks from "../../utils/masks";
import * as defs from "../../configs/default";
import * as orderService from "../../services/orderService";
import Loader from "../../components/Loader";

const Payment = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(store.getState().addressState.name);
    const [document, setDocument] = useState(store.getState().addressState.document);
    const [phoneNumber, setPhoneNumber] = useState(store.getState().addressState.phoneNumber);

    const [paymentOption, setPaymentOption] = useState(null);
    const [continueEnabled, setContinueEnabled] = useState(false);
    const [shoppingCartTotal] = useState(store.getState().cartState.total);
    const [showChange, setShowChange] = useState(true);

    const [changeInput, setChangeInput] = useState("0");

    var changeRef = useRef(null);

    useEffect(() => { setShowChange(false) }, []);

    const cardButtonClassName = paymentOption === "Debito/Credito"
        ? [styles.paymentButton, styles.paymentButtonEnabled]
        : [styles.paymentButton, styles.paymentButtonDisable];

    const moneyButtonClassName = paymentOption === "Dinheiro"
        ? [styles.paymentButton, styles.paymentButtonEnabled]
        : [styles.paymentButton, styles.paymentButtonDisable];

    const continueButtonClassName = continueEnabled === true
        ? [styles.continueButton, styles.continueButtonEnabled, {marginTop: 30}]
        : [styles.continueButton, styles.continueButtonDisable, {marginTop: 30}];

    const handleOrderConfirmation = async () => {
        if (!paymentOption) return;
        
        const customerInfo = { name, phoneNumber, document };
        if (!validateFields(customerInfo)) return;
        
        store.dispatch( actionSetCustomerInfo(customerInfo) );

        let changeFor = changeRef.getRawValue();

        if (paymentOption) {
            if (paymentOption === "Dinheiro") {
                if (changeFor !== 0) {
                    if (changeFor <= shoppingCartTotal) {
                        Alert.alert(
                            "Valor Invalido !!",
                            "O Valor do Troco deve ser maior que o valor da compra !!"
                        );
                        return;
                    };
                };
            };

            if (paymentOption === "Debito/Credito") {
                if (changeFor !== 0) setChangeInput(0);
            };

            let changeValue = 0;
            if (changeFor !== 0) changeValue = changeFor - shoppingCartTotal;

            const paymentTypeData = {
                paymentType: paymentOption,
                changeValue: changeValue,
            };

            setLoading(true);
            await store.dispatch(actionSelectPaymentType(paymentTypeData));
            const orderInformation = await orderService.postOrder();
            setLoading(false);

            navigation.navigate('Confirmed', orderInformation);

            return;
        };
    };

    const total = utils.moneyMask(shoppingCartTotal);

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>
            { loading && (<Loader />)}

            <View style={styles.header}>
                <Feather
                    style={styles.headerIcon}
                    name="arrow-left"
                    onPress={() => { navigation.navigate('ShoppingCart') }}
                />
                <Text style={styles.headerText}>Pagamento na entrega: {total}</Text>
                <Text style={{ width: 50 }}></Text>
            </View>


            {/* Nome */}
            <View style={{ flexDirection: "row", marginHorizontal: 20, paddingTop: 10 }}>
                {/* Nome */}
                <View style={[{ flexDirection: "column", width: "100%", marginRight: "10%" }]}>
                    <Text style={[styles.textInputLabel]}>
                        Nome
                    </Text>
                    <TextInput
                        style={[styles.textInput]}
                        autoFocus={true}
                        maxLength={100}
                        onChangeText={text => setName(text)}
                        defaultValue={name}
                    />
                </View>
            </View>

            {/* Telefone e CPF */}
            <View style={{ flexDirection: "row", marginTop: 15, marginHorizontal: "5%" }}>
                {/* Telefone */}
                <View style={[{ flexDirection: "column", width: "47%", marginRight: "3%" }]}>
                    <Text style={[styles.textInputLabel]}>
                        Telefone
                    </Text>
                    <TextInput
                        style={[styles.textInput]}
                        keyboardType="numeric"
                        maxLength={15}
                        onChangeText={text => setPhoneNumber(masks.phoneMask(text))}
                        defaultValue={phoneNumber}
                    />
                </View>

                {/* CPF */}
                <View style={{ flexDirection: "column", width: "50%" }}>
                    <Text style={styles.textInputLabel}>
                        CPF
                    </Text>
                    <TextInput
                        style={[styles.textInput]}
                        keyboardType="numeric"
                        maxLength={14}
                        onChangeText={text => setDocument(masks.cpfMask(text))}
                        defaultValue={document}
                    />
                </View>
            </View>



            <View style={styles.creditCardButton}>
                <TouchableOpacity
                    style={cardButtonClassName}
                    onPress={() => {
                        setShowChange(false);
                        setPaymentOption("Debito/Credito")
                        setContinueEnabled(true)
                    }}>
                    <MaterialIcons style={{ fontSize: 30, color: "#777777" }} name="credit-card" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#333333" }} >
                        Cartão de Débito ou Crédito
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.moneyButton}>
                <TouchableOpacity
                    style={moneyButtonClassName}
                    onPress={() => {
                        setShowChange(true);
                        setPaymentOption("Dinheiro")
                        setContinueEnabled(true)
                    }}>
                    <Feather style={{ fontSize: 26, color: "#777777" }} name="dollar-sign" />
                    <Text
                        style={{
                            marginLeft: 15,
                            fontSize: 18,
                            color: "#333333"
                        }}
                    >
                        Dinheiro
                    </Text>
                </TouchableOpacity>
            </View>

            {/* change container */}
            <View
                style={[
                    styles.changeContainer,
                    { display: showChange ? "flex" : "none" }
                ]}
            >
                <Text style={styles.changeLabel}>
                    Troco para:
                </Text>
                <TextInputMask
                    ref={ref => (changeRef = ref)}
                    type={'money'}
                    value={changeInput}
                    style={styles.changeInput}
                    options={moneyInputConfig}
                    onChangeText={text => setChangeInput(text)}
                />

            </View>


            {/* Order Confirmation */}
            <TouchableOpacity
                style={continueButtonClassName}
                onPress={handleOrderConfirmation}
            >
                <Text style={{ fontSize: 22, color: defs.confirmButtonTextColor() }}>
                    Confirmar
                </Text>
            </TouchableOpacity>

            <View style={styles.precautionText}>
                <View>
                    <Text style={{ color: "#283593", fontSize: 16, fontWeight: "bold" }}>
                        Por precaução:
                    </Text>
                    <Text>
                        Evite o pagamento com dinheiro em espécie
                    </Text>
                    <Text>
                        É mais seguro para você e para o entregador
                    </Text>
                </View>
            </View>

        </KeyboardAvoidingView>
    );
};

const validateFields = (customerInfo) => {
    if (!customerInfo.name) {
        utils.fieldInvalidMessage("Campo Nome é obrigatório !!");
        return false;
    }
    if (!customerInfo.phoneNumber) {
        utils.fieldInvalidMessage("Campo Telefone é obrigatório !!");
        return false;
    }

    return true;
};


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#f2f9f9",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    headerIcon: {
        width: 50,
        fontSize: 28,
        color: "#777777"
    },
    headerText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000",
        alignSelf: "center"
    },
    creditCardButton: {
        marginTop: 20,
    },
    moneyButton: {
        marginTop: 20,
    },
    changeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginHorizontal: 20,
        paddingVertical: 10,
    },
    changeLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black"
    },
    changeInput: {
        marginLeft: 10,
        height: 30,
        width: 200,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: "white",
        elevation: 3,
        fontSize: 16,
        color: "black",
        borderColor: "#999",
    },
    precautionText: {
        marginTop: 20,
        marginHorizontal: "5%",
    },
    paymentButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "5%",
        width: "90%",
        height: 60,
        borderRadius: 5,
        elevation: 7,
    },
    paymentButtonDisable: {
        backgroundColor: "white",
    },
    paymentButtonEnabled: {
        backgroundColor: "lightgreen",
    },
    continue_Button: {
        flexDirection: "row",
        justifyContent: "center",
        // position: "absolute",
        // bottom: 80,
        marginTop: 60,
        marginHorizontal: "10%",
        width: "80%",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: "#a5a5a5",

        // backgroundColor: "#ffcc00",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    continueButton: defs.confirmButtonContainer()
    ,
    continueButtonDisable: {
        backgroundColor: "silver",
    },
    continueButtonEnabled: {
        backgroundColor: defs.confirmButtonColor(),
    },
    displayEnabled: {
        display: "flex",
    },
    displayDisabled: {
        display: "none",
    },
    textInputLabel: {
        color: "black",
        fontWeight: "bold",
    },
    textInput: {
        height: 30,
        borderRadius: 5,
        paddingLeft: 10,
        backgroundColor: "white",
        elevation: 5,
    },

});

export default Payment;