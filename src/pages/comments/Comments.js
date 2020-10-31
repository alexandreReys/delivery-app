import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import store from "../../store";
import { actionSetComments } from "../../store/actions";
import * as defs from "../../configs/default";
import * as orderService from "../../services/orderService";
import Loader from "../../components/Loader";

const Comments = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState(store.getState().cartState.comments);

    const handleOrderConfirmation = async () => {
        setLoading(true);
        store.dispatch(actionSetComments(comments));
        const orderInformation = await orderService.postOrder();
        setLoading(false);

        navigation.navigate('Confirmed', orderInformation);
        return;
    };

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>
            { loading && (<Loader />)}

            <View style={styles.header}>
                <Feather
                    style={styles.headerIcon}
                    name="arrow-left"
                    onPress={() => { navigation.navigate('Payment') }}
                />
                <Text style={styles.headerText}>Observações</Text>
                <Text style={{ width: 50 }}></Text>
            </View>

            {/* Comentários */}
            <View style={{ flexDirection: "row", marginHorizontal: 20, paddingTop: 10 }}>
                {/* Nome */}
                <View style={[{ flexDirection: "column", width: "100%", marginRight: "10%" }]}>
                    <Text style={[styles.textInputLabel]}>
                        Observações, Comentários e referências
                    </Text>
                    <TextInput
                        style={[styles.textInput]}
                        autoFocus={true}
                        multiline={true}
                        numberOfLines={8}
                        onChangeText={text => setComments(text)}
                        defaultValue={comments}
                    />
                </View>
            </View>

            {/* Confirmation Button */}
            <TouchableOpacity
                style={styles.continueButton}
                onPress={handleOrderConfirmation}
            >
                <Text style={{ fontSize: 22, color: defs.confirmButtonTextColor() }}>
                    Confirmar
                </Text>
            </TouchableOpacity>

            {/* Precaution Text */}
            <View style={styles.warningContainer}>
                <Text style={{fontSize: 12, fontWeight: "bold", marginBottom: 10, color: "navy"}}>
                    Utilize este campo para :
                </Text>
                <Text style={[styles.warningText], {fontWeight: "bold"}}>
                    Colocar informações sobre seus produtos.
                </Text>
                <Text style={styles.warningText}>
                    {"    "} Exemplo: Refrigerantes sem gelo
                </Text>
                <Text style={[styles.warningText], {fontWeight: "bold"}}>
                    Informações sobre o local de entrega
                </Text>
                <Text style={styles.warningText}>
                    {"    "} Não tocar campainha, ligar quando chegar
                </Text>
                <Text style={styles.warningText}>
                    {"    "} Estamos na praça em frente ao numero informado
                </Text>
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
    textInputLabel: {
        color: "black",
        fontWeight: "bold",
    },
    textInput: {
        marginTop: 10,
        borderRadius: 5,
        paddingVertical: 5,
        paddingLeft: 10,
        fontSize: 12,
        textAlignVertical: "top",
        backgroundColor: "white",
        elevation: 5,
    },
    continueButton: defs.confirmButtonContainer()
    ,
    warningContainer: {
        marginTop: 20,
        marginHorizontal: "5%",
    },
    warningText: {
        fontSize: 12,
    },
   
});

export default Comments;