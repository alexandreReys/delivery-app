import React, { useEffect, useState } from 'react';
import {
    StyleSheet, KeyboardAvoidingView, View,
    Text, TouchableOpacity, ScrollView, Image,
} from "react-native";

import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";

import CartItens from '../../components/CartItens';
import store from "../../store";
import * as masks from "../../utils/masks";
import * as def from "../../configs/default";

const ShoppingCart = ({ navigation, quantityOfItems, subtotal }) => {
    const [addr, setAddr] = useState(store.getState().addressState);
    const [amountLeft, setAmountLeft] = useState(0);
    const [widthSize, setWidthSize] = useState(0);

    const maskedSubtotal = masks.moneyMask(subtotal);
    const maskedShippingValue = masks.moneyMask(store.getState().cartState.shipping);
    const maskedTotal = masks.moneyMask(store.getState().cartState.total);

    const minimumOrderValue = 10;

    useEffect(() => {
        setAddr(store.getState().addressState);
    }, []);

    useEffect(() => {
        if (!quantityOfItems) navigation.navigate('ShoppingList');
    });

    useEffect(() => {
        const calcSize = (partial, total) => {
            const percent = 100 - ( Number.parseInt( partial * 100 ) / total );
            return setWidthSize(percent);
        };

        let x = minimumOrderValue - subtotal;
        setAmountLeft(x);
        calcSize(x, minimumOrderValue);

    }, [subtotal]);

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>

            {amountLeft > 0 && (
                <>
                    <View style={{ backgroundColor: "silver" }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: "black", paddingVertical: 5, textAlign: "center" }}>
                            Faltam {masks.moneyMask(amountLeft)} para o valor minimo do pedido
                        </Text>
                    </View>
                    <View style={[styles.viewTransparent, { width: `${widthSize}%` }]}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: "black", paddingVertical: 5 }}></Text>
                    </View>
                </>
            )}

            <View style={styles.header}>
                <Feather
                    style={styles.arrowLeftIcon}
                    name="arrow-left"
                    onPress={() => { navigation.navigate('ShoppingList') }}
                />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: "silver" }}>
                    Sacola
                </Text>
                <Text style={{ width: 50 }}></Text>
            </View>

            <TouchableOpacity style={[styles.finalizeContainer, {backgroundColor: amountLeft <= 0 ? '#deeffe' : 'silver'}]}
                onPress={() => {
                    if (amountLeft <= 0) navigation.navigate('Payment');
                }}
            >
                <Text style={{ fontWeight: 'bold', color: amountLeft <= 0 ? "maroon" : 'white'}}>
                    Finalizar Compra
                </Text>
            </TouchableOpacity>

            <ScrollView>

                <CartItens />

                <View style={styles.addressContainer}>
                    <View style={{ width: "12%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                        <Feather
                            style={{ fontSize: 22, color: "black" }}
                            name="map-pin"
                        />
                    </View>
                    <View style={{ width: "78%", }}>
                        <Text style={{ fontSize: 16, color: "navy", fontWeight: "bold" }}>
                            Receber agora em
                        </Text>
                        <Text style={{ fontSize: 14, color: "#777" }}>
                            {`${addr.street}, ${addr.number}`}
                        </Text>
                        <Text style={{ fontSize: 14, color: "#777" }}>
                            {`${addr.neighborhood}, ${addr.city}, ${addr.state}`}
                        </Text>
                    </View>
                    <View style={{ width: "10%", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                        <Feather
                            style={{ fontSize: 22, color: "blue" }}
                            name="edit"
                            onPress={() => { navigation.navigate('Address', 'ShoppingCart') }}
                        />
                    </View>
                </View>

                <View>


                    <View style={styles.resumeContainer}>
                        <View style={styles.resumeItems}>
                            <View>
                                <Text style={styles.resumeText}>{quantityOfItems} produto(s)</Text>
                            </View>
                            <View>
                                <Text style={styles.resumeText}>{maskedSubtotal}</Text>
                            </View>
                        </View>

                        <View style={styles.resumeShipping}>
                            <View>
                                <Text style={styles.resumeText}>Frete</Text>
                            </View>
                            <View>
                                <Text style={styles.resumeText}>{maskedShippingValue}</Text>
                            </View>
                        </View>

                        <View style={styles.resumeTotal}>
                            <View>
                                <Text style={styles.resumeTextTotal}>Total</Text>
                            </View>
                            <View>
                                <Text style={styles.resumeTextTotal}>{maskedTotal}</Text>
                            </View>
                        </View>
                    </View>

                    {amountLeft <= 0 && (
                        <TouchableOpacity
                            style={styles.continueContainer}
                            onPress={() => {
                                navigation.navigate('Payment');
                            }}
                        >
                            <Text style={styles.continue}>
                                Finalizar Compra
                            </Text>
                        </TouchableOpacity>
                    )}

                    {amountLeft > 0 && (
                        <View
                            style={[styles.continueContainer, { backgroundColor: "silver" }]}
                        >
                            <Text style={styles.continue}>
                                Finalizar Compra
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.keepBuyingContainer}
                        onPress={() => {
                            navigation.navigate('ShoppingList');
                        }}
                    >
                        <Text style={styles.keepBuying}>
                            Adicionar mais produtos
                        </Text>
                    </TouchableOpacity>

                </View>


            </ScrollView>

        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    viewTransparent: {
        backgroundColor: "green", 
        position: "absolute", 
        top: 0, 
        opacity : 0.5,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    arrowLeftIcon: {
        width: 50,
        fontSize: 28,
        color: "#777777"
    },
    finalizeContainer: {
        marginTop: 15,
        marginBottom: 20,
        marginHorizontal: 20,
        paddingVertical: 10,

        backgroundColor: '#deeffe',
        borderStyle: 'solid',
        borderColor: "gray",
        borderRadius: 10,
        elevation: 4,

        flexDirection: "row",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    },
    addressContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 20,
        paddingHorizontal: 10,
        margin: 20,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "navy",
        borderRadius: 10,
    },
    itemsHeaderContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 10,
        flexDirection: "row",
    },
    resumeContainer: {
        marginHorizontal: 20,
        backgroundColor: "white",
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: "navy",
        borderRadius: 10,
    },
    resumeItems: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingHorizontal: 10,
    },
    resumeShipping: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingHorizontal: 10,
    },
    resumeTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingHorizontal: 10,
    },
    resumeText: {
        fontSize: 16,
        color: "#777777",
    },
    resumeTextTotal: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },

    continueContainer:
        def.confirmButtonContainer(),
    continue:
        def.confirmButtonText(),
    keepBuyingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 50,
    },
    keepBuying: {
        fontSize: 16,
        color: "grey",
    },


    // itemsDetailsContainer: {
    //     marginTop: 15,
    //     marginHorizontal: 20,
    //     paddingVertical: 10,

    //     backgroundColor: 'white',
    //     borderStyle: 'solid',
    //     borderColor: "gray",
    //     borderRadius: 10,
    //     elevation: 4,

    //     flexDirection: "row",

    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 3 },
    //     shadowOpacity: 0.27,
    //     shadowRadius: 4.65,
    // },
    // qttyContainer: {
    //     marginTop: 5,
    //     borderStyle: 'solid',
    //     borderColor: "silver",
    //     borderWidth: 1,
    //     borderRadius: 10,
    //     paddingHorizontal: 10,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "space-between",
    // },
    // detText: {
    //     fontSize: 13,
    //     color: "black",
    // },


});

export default connect((state) => ({
    quantityOfItems: state.cartState.quantityOfItems,
    subtotal: state.cartState.subtotal,
}))(ShoppingCart);
