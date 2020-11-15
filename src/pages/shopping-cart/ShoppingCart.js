import React, { useEffect } from 'react';
import {
    StyleSheet, KeyboardAvoidingView, View,
    Text, TouchableOpacity, ScrollView
} from "react-native";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import store from "../../store";
import * as masks from "../../utils/masks";
import * as def from "../../configs/default";

const ShoppingCart = ({ navigation, addedItems, quantityOfItems }) => {
    const subtotal = masks.moneyMask(store.getState().cartState.subtotal);
    const shipping = masks.moneyMask(store.getState().cartState.shipping);
    const total = masks.moneyMask(store.getState().cartState.total);

    const addr = store.getState().addressState;

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>

            <View style={styles.header}>
                <Feather
                    style={styles.arrowLeftIcon}
                    name="arrow-left"
                    onPress={() => { navigation.navigate('ShoppingList') }}
                />
                <Text style={{ fontSize: 24, color: "#777777" }}>Sacola</Text>
                <Text style={{ width: 50 }}></Text>
            </View>

            <View style={styles.addressContainer}>
                <View style={{ width: "12%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <Feather
                        style={{ fontSize: 22, color: "#777777" }}
                        name="map-pin"
                        onPress={() => { navigation.navigate('ShoppingList') }}
                    />
                </View>
                <View style={{ width: "78%", }}>
                    <Text style={{ fontSize: 16, color: "#000", fontWeight: "bold" }}>
                        Receber agora em
                    </Text>
                    <Text style={{ fontSize: 16, color: "#777" }}>
                        {`${addr.street}, ${addr.number}`}
                    </Text>
                    <Text style={{ fontSize: 16, color: "#777" }}>
                        {`${addr.neighborhood}, ${addr.city}, ${addr.state}`}
                    </Text>
                </View>
                <View style={{ width: "10%", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                    <Feather
                        style={{ fontSize: 22, color: "#777777" }}
                        name="edit"
                        onPress={() => { navigation.navigate('Address', 'ShoppingCart') }}
                    />
                </View>
            </View>

            <View style={styles.resumeContainer}>
                <View style={styles.resumeItems}>
                    <View>
                        <Text style={styles.resumeText}>{quantityOfItems} produto(s)</Text>
                    </View>
                    <View>
                        <Text style={styles.resumeText}>{subtotal}</Text>
                    </View>
                </View>

                <View style={styles.resumeShipping}>
                    <View>
                        <Text style={styles.resumeText}>Frete</Text>
                    </View>
                    <View>
                        <Text style={styles.resumeText}>{shipping}</Text>
                    </View>
                </View>

                <View style={styles.resumeTotal}>
                    <View>
                        <Text style={styles.resumeTextTotal}>Total</Text>
                    </View>
                    <View>
                        <Text style={styles.resumeTextTotal}>{total}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.continueContainer}
                    onPress={() => {
                        navigation.navigate('Payment');
                    }}
                >
                    <Text style={styles.continue}>
                        Pagar
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.keepBuyingContainer}
                    onPress={() => {
                        navigation.navigate('ShoppingList');
                    }}
                >
                    <Text style={styles.keepBuying}>
                        Comprar mais
                    </Text>
                </TouchableOpacity>

            </View>

            <View style={styles.itemsHeaderContainer}>
                <View style={styles.header1}>
                    <Text style={styles.headerText}>Produto</Text>
                </View>
                <View style={styles.header2}>
                    <Text style={styles.headerText}>Qtde</Text>
                </View>
                <View style={styles.header3}>
                    <Text style={styles.headerText}>Preço</Text>
                </View>
            </View>

            <ScrollView style={styles.itemsDetails}>
                {addedItems.map((item) => {
                    const price = masks.moneyMask(item.price);
                    return (
                        <View key={item.description} style={styles.itemsDetailsContainer}>
                            <View style={styles.det1}>
                                <Text>{item.description}</Text>
                            </View>
                            <View style={styles.det2}>
                                <Text>{item.quantity}</Text>
                            </View>
                            <View style={styles.det3}>
                                <Text>{price}</Text>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>


        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
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
    addressContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
    itemsHeaderContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 10,
        flexDirection: "row",
    },
    itemsDetails: {
        // backgroundColor: "white",
    },
    itemsDetailsContainer: {
        marginTop: 5,
        marginHorizontal: 20,
        flexDirection: "row",
    },

    header1: {
        fontWeight: "bold",
        width: "60%",
    },
    header2: {
        flexDirection: "row",
        justifyContent: "center",
        fontWeight: "bold",
        width: "20%",
    },
    header3: {
        flexDirection: "row",
        justifyContent: "flex-end",
        fontWeight: "bold",
        width: "20%",
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#000",
    },

    det1: {
        width: "60%",
    },
    det2: {
        flexDirection: "row",
        justifyContent: "center",
        width: "20%",
    },
    det3: {
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "20%",
    },

    resumeContainer: {
        marginHorizontal: 20,
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
        marginVertical: 30,
    },
    keepBuying: {
        fontSize: 20,
        textDecorationLine: "underline",
        color: "blue",
    },

});

export default connect((state) => ({
    addedItems: state.cartState.addedItems,
    quantityOfItems: state.cartState.quantityOfItems,
}))(ShoppingCart);
