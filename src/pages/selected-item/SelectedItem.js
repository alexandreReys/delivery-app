import React, { useState } from "react";
import {
    KeyboardAvoidingView, StyleSheet,
    View, Text, Image, TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";

import store from "../../store";
import { actionAddToCart } from "../../store/actions";
import logo from "../../../assets/logo-shopping-list.png";
import * as masks from "../../utils/masks";
import * as def from "../../configs/default";

const SelectedItem = ({ navigation }) => {

    const [selectedProduct] = useState(store.getState().cartState.item);
    const [quantity, setQuantity] = useState(1);
    const price = masks.moneyMask(selectedProduct.price);

    const confirmClick = (selectedProduct) => {
        const itemToAddToCart = {
            id: selectedProduct.id,
            description: selectedProduct.description,
            quantity,
            price: selectedProduct.price,
            image: selectedProduct.image,
            shippingTax: store.getState().defaultState.shippingTaxSettings,
        };
        store.dispatch(actionAddToCart(itemToAddToCart));

        if (store.getState().cartState.quantityOfItems === 1) {
            return navigation.navigate('Address', 'ShoppingList');
        }
        navigation.navigate('ShoppingList');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.mainContainer}
        >
            <View style={styles.arrowLeftContainer}>
                <Feather
                    style={{ width: 50, fontSize: 28, color: "#777777" }}
                    name="arrow-left"
                    onPress={() => { navigation.navigate('ShoppingList') }}
                />
            </View>

            <View style={styles.imageContainer}>
                {/* <Image style={styles.image} source={{ uri: selectedProduct.image }} /> */}
                {!!selectedProduct.image &&
                    <Image style={styles.image} source={{ uri: selectedProduct.image }} />
                }
                {!selectedProduct.image &&
                    <Image style={styles.image} source={logo}
                    />}
            </View>

            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                    {selectedProduct.description}
                </Text>
            </View>

            <View style={styles.priceContainer}>
                <Text style={styles.price}>{price}</Text>
            </View>

            <View style={styles.quantityContainer}>
                <Text
                    style={styles.btnPlus}
                    onPress={() => {
                        if (quantity > 1) setQuantity(quantity - 1);
                    }}
                >
                    -
                </Text>
                <Text style={styles.quantity}>{quantity}</Text>
                <Text
                    style={styles.btnMinus}
                    onPress={() => setQuantity(quantity + 1)}
                >
                    +
                </Text>
            </View>

            <TouchableOpacity
                style={styles.addItemContainer}
                onPress={() => confirmClick(selectedProduct) }
            >
                <Text style={styles.addItemText}>Adicionar</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    arrowLeftContainer: {
        paddingTop: 10,
        paddingHorizontal: 10
    },
    imageContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    image: {
        width: 280,
        height: 280,
    },
    descriptionContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 20,
        paddingHorizontal: 30,
    },
    description: {
        fontSize: 18,
        color: "grey",
    },

    priceContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginLeft: 30,
        marginTop: 10,
    },
    price: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#555555",
    },

    quantityContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
        marginHorizontal: 60,
        paddingVertical: 1,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "#efefef",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    btnPlus: {
        fontSize: 36,
        fontWeight: "bold",
        color: "blue",
        paddingHorizontal: 25,
    },
    quantity: {
        fontSize: 32,
        fontWeight: "bold",
    },
    btnMinus: {
        fontSize: 38,
        fontWeight: "bold",
        color: "blue",
        paddingHorizontal: 25,
    },

    addItemContainer:
        def.confirmButtonContainer(),
    addItemText:
        def.confirmButtonText(),
});

export default SelectedItem;
