import React, { useState, useEffect, useRef } from "react";
import {
    KeyboardAvoidingView, StyleSheet, Alert,
    View, Text, Image, TouchableOpacity, TextInput
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInputMask } from "react-native-masked-text";
import { moneyInputConfig } from "../../configs/textInputMaskConfig";
import CurrencyInput from "react-native-currency-input";

import store from "../../store";
import { actionSelectPaymentType, actionSetCustomerInfo } from "../../store/actions";
import * as utils from "../../utils";
import * as masks from "../../utils/masks";
import * as defs from "../../configs/default";
import * as orderService from "../../services/orderService";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
// import { TestaCPF } from '../../utils'

const Payment = ({ navigation }) => {
    // const [loading, setLoading] = useState(false);

    const [name, setName] = useState(store.getState().addressState.name);
    const [document, setDocument] = useState(store.getState().addressState.document);
    const [phoneNumber, setPhoneNumber] = useState(store.getState().addressState.phoneNumber);

    const [paymentOption, setPaymentOption] = useState(null);
    const [continueEnabled, setContinueEnabled] = useState(false);
    const [shoppingCartTotal] = useState(store.getState().cartState.total);
    const [showChange, setShowChange] = useState(true);

    const [changeInput, setChangeInput] = useState("");

    var changeRef = useRef(null);

    useEffect(() => { setShowChange(false) }, []);

    const cardButtonColor = () => (
        {
            backgroundColor: paymentOption === "Debito/Credito"
                ? defs.orangeBackColor
                : "white",
        }
    );
    const moneyButtonColor = () => (
        {
            backgroundColor: paymentOption === "Dinheiro"
                ? defs.orangeBackColor
                : "white",
        }
    );

    const cardText = () => ({ 
        fontSize: paymentOption === "Debito/Credito" ? 20 : 16,
        fontWeight: paymentOption === "Debito/Credito" ? 'bold' : 'normal',
        color: paymentOption === "Debito/Credito" ? defs.labelColor : 'black',
    });
    const moneyText = () => ({ 
        fontSize: paymentOption === "Dinheiro" ? 20 : 16,
        fontWeight: paymentOption === "Dinheiro" ? 'bold' : 'normal',
        color: paymentOption === "Dinheiro" ? defs.labelColor : 'black',
    });

    const confirmButtonColor = () => ({
        backgroundColor: continueEnabled === true
            ? defs.confirmButtonColor()
            : "silver"
    });

    const total = masks.moneyMask(shoppingCartTotal);

    const handleOrderConfirmation = async () => {
        if (!paymentOption) return;

        const customerInfo = {
            id: 0,
            name,
            phoneNumber,
            document
        };
        if (!validateFields(customerInfo)) return;

        store.dispatch(actionSetCustomerInfo(customerInfo));

        let changeFor = Number(changeInput);

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

            // setLoading(true);
            await store.dispatch(actionSelectPaymentType(paymentTypeData));
            // const orderInformation = await orderService.postOrder();
            // setLoading(false);

            navigation.navigate('Comments');

            return;
        };
    };

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>
            {/* { loading && (<Loader />)} */}

            <Header title={'PAGAMENTO'} exitRoute={'ShoppingCart'} navigation={navigation} />

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

            {/* Card and Money Button */}
            <Text style={[styles.textInputLabel, { marginHorizontal: "5%", marginTop: 10, textAlign: "center" }]}>
                Pagar com :
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "5%", marginTop: 10 }}>
                {/* Payment Card Button */}
                <TouchableOpacity
                    style={[styles.paymentButton, cardButtonColor()]}
                    onPress={() => {
                        setShowChange(false);
                        setPaymentOption("Debito/Credito")
                        setContinueEnabled(true)
                    }}>
                    <MaterialIcons style={{ fontSize: 30, color: defs.labelColor }} name="credit-card" />
                    <Text style={[styles.paymentText, cardText()]} >
                        Cartão
                    </Text>
                </TouchableOpacity>
                {/* </View> */}

                {/* Money Button */}
                <TouchableOpacity
                    style={[styles.paymentButton, moneyButtonColor()]}
                    onPress={() => {
                        setShowChange(true);
                        setPaymentOption("Dinheiro")
                        setContinueEnabled(true)
                    }}>
                    <Feather style={{ fontSize: 24, color: defs.labelColor }} name="dollar-sign" />
                    <Text style={[styles.paymentText, moneyText()]} >
                        Dinheiro
                    </Text>
                </TouchableOpacity>
                {/* </View> */}
            </View>

            {/* change container */}
            {/* <View
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

            </View> */}

            {/* change container */}
            <View
                style={[
                    styles.changeContainer,
                    { display: showChange ? "flex" : "none" }
                ]}
            >
                <Text style={styles.changeLabel}>
                    Troco para R$
                </Text>

                <CurrencyInput
                    style={styles.changeInput}
                    value={changeInput}
                    minValue={0}
                    keyboardType="numeric"
                    maxLength={8}
                    onChangeValue={setChangeInput}
                    prefix=""
                    delimiter=""
                    separator=","
                    precision={2}
                    onChangeText={formattedValue => null}

                />

            </View>

            {/* Order Confirmation */}
            <TouchableOpacity
                style={[styles.continueButton, { marginTop: 30 }, confirmButtonColor()]}
                onPress={handleOrderConfirmation}
            >
                <Text style={{ fontSize: 22, color: defs.confirmButtonTextColor() }}>
                    Confirmar
                </Text>
            </TouchableOpacity>

            {/* precaution Text */}
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
    if (!customerInfo.document) {
        utils.fieldInvalidMessage("Campo CPF é obrigatório !!");
        return false;
    }
    if ( !utils.testaCPF(customerInfo.document) ) {
        utils.fieldInvalidMessage('Digite um numero de CPF valido !!');
        return false;
    }

    return true;
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: defs.backgroundColor,
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
        backgroundColor: "white",
        marginLeft: 10,
        width: 200,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 7,
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontSize: 18,
        elevation: 8,
    },
    precautionText: {
        marginTop: 20,
        marginHorizontal: "5%",
    },
    paymentButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "48%",
        height: 60,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "orange",
        elevation: 7,
    },
    paymentText: {
        marginLeft: 15, 
        fontSize: 16, 
        color: "#333333",
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    continueButton: defs.confirmButtonContainer()
    ,
    displayEnabled: {
        display: "flex",
    },
    displayDisabled: {
        display: "none",
    },
    textInputLabel: {
        color: defs.labelColor,
        fontWeight: "bold",
    },
    textInput: {
        height: 30,
        borderRadius: 5,
        paddingLeft: 10,
        backgroundColor: "white",
        borderColor: 'silver',
        borderWidth: 1,
    },

});

export default Payment;