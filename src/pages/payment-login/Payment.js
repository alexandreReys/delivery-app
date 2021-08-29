import React, { useState, useEffect, useRef } from "react";
import {
    KeyboardAvoidingView, StyleSheet, Alert,
    View, Text, TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Header from '../../components/Header';
import CurrencyInput from "react-native-currency-input";
import store from "../../store";
import { actionSelectPaymentType } from "../../store/actions";
import * as masks from "../../utils/masks";
import * as defs from "../../configs/default";

const Payment = ({ navigation }) => {
    // const [loading, setLoading] = useState(false);
    const [paymentOption, setPaymentOption] = useState(null);
    const [continueEnabled, setContinueEnabled] = useState(false);
    const [shoppingCartTotal] = useState(store.getState().cartState.total);
    const [showChange, setShowChange] = useState(true);

    const [changeInput, setChangeInput] = useState("");

    var changeRef = useRef(null);

    useEffect(() => { 
        setShowChange(false) 
    }, []);

    const cardButtonColor = () => ({ 
        backgroundColor: paymentOption === "Debito/Credito" ? "#F9E79F" : "white",
    });
    const moneyButtonColor = () => ({
        backgroundColor: paymentOption === "Dinheiro" ? "#F9E79F" : "white",
    });
    const confirmButtonColor = () => ({
        backgroundColor: continueEnabled === true
            ? defs.confirmButtonColor()
            : "silver"
    });

    const total = masks.moneyMask(shoppingCartTotal);

    const handleOrderConfirmation = async () => {
        if (!paymentOption) return;

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

            await store.dispatch(actionSelectPaymentType(paymentTypeData));

            navigation.navigate('Comments');

            return;
        };
    };

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>
            {/* { loading && (<Loader />)} */}

            <Header title='FORMA DE PAGAMENTO' exitRoute='ShoppingCart' navigation={navigation}/>
            
            {/* Card and Money Button */}
            <Text style={[styles.textInputLabel, {marginHorizontal: "5%", marginTop: 20}]}>
                PAGAMENTO NA ENTREGA
            </Text>

            <Text style={[styles.textInputLabel, {marginHorizontal: "5%", marginTop: 20}]}>
                Valor : {total}, pagar com :
            </Text>

            <View style={{ flexDirection: "column", justifyContent: "space-between", marginHorizontal: "5%", marginTop: 10 }}>
                {/* Payment Card Button */}
                    <TouchableOpacity
                        style={ [styles.paymentButton, cardButtonColor()] }
                        onPress={() => {
                            setShowChange(false);
                            setPaymentOption("Debito/Credito")
                            setContinueEnabled(true)
                        }}>
                        <MaterialIcons style={{ fontSize: 30, color: "#777777" }} name="credit-card" />
                        <Text style={{ marginLeft: 15, fontSize: 16, color: "#333333" }} >
                            Cartão
                        </Text>
                    </TouchableOpacity>
                {/* </View> */}

                {/* Money Button */}
                    <TouchableOpacity
                        style={ [styles.paymentButton, moneyButtonColor()] }
                        onPress={() => {
                            setShowChange(true);
                            setPaymentOption("Dinheiro")
                            setContinueEnabled(true)
                        }}>
                        <Feather style={{ fontSize: 24, color: "#777777" }} name="dollar-sign" />
                        <Text style={{ marginLeft: 15, fontSize: 16, color: "#333333" }} >
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
                    onChangeText={ formattedValue => null }
                        
                />

            </View>

            {/* Order Confirmation */}
            <TouchableOpacity
                style={ [styles.continueButton, { marginTop: 30 }, confirmButtonColor()] }
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

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
        width: "100%",
        height: 50,
        borderRadius: 7,
        borderColor: "silver",
        elevation: 7,
        marginBottom: 20,
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
        color: '#283593',
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