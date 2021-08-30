import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import noImage from "../../../assets/no-image.png";
import * as def from "../../configs/default";
import store from "../../store";
import * as actions from "../../store/actions";
import * as utils from "../../utils";
import * as masks from "../../utils/masks";

// import { back } from "react-native/Libraries/Animated/src/Easing";

const SelectedItem = ({ route, navigation }) => {

    let returnRoute;

    const [selectedProduct] = useState(store.getState().cartState.item);
    const showPrice2 = !!selectedProduct.priceVariation;

    const [quantity, setQuantity] = useState(!showPrice2 ? 1 : 0);
    const [quantity2, setQuantity2] = useState(0);

    const [totalQuantity, setTotalQuantity] = useState(!showPrice2 ? 1 : 0);

    const [mainPrice] = useState(selectedProduct.price);
    const [price2] = useState(selectedProduct.priceVariation);

    let priceVariation = "R$ 0,00";
    if (!!selectedProduct.priceVariation) priceVariation = masks.moneyMask(selectedProduct.priceVariation);

    let descriptionVariation = "Sem Promoção";
    if (!!selectedProduct.descriptionVariation) descriptionVariation = selectedProduct.descriptionVariation;


    useEffect(() => {
        returnRoute = route.params;
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.mainContainer}
        >
            <View style={styles.arrowLeftContainer}>
                <Feather
                    style={{ width: 50, fontSize: 28, color: "#777777" }}
                    name="arrow-left"
                    onPress={() => {
                        navigation.navigate(!!returnRoute ? returnRoute : 'ShoppingList');
                    }}
                />
            </View>

            <View style={styles.imageContainer}>
                {/* <Image style={styles.image} source={{ uri: selectedProduct.image }} /> */}
                {!!selectedProduct.image &&
                    <Image style={styles.image} source={{ uri: selectedProduct.image }} />
                }
                {!selectedProduct.image &&
                    <Image style={styles.image} source={noImage}
                    />}
            </View>

            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                    {selectedProduct.description}
                </Text>
            </View>

            {showPrice2 &&
                <>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                            {priceVariation}
                        </Text>
                        <Text style={{ color: "red" }}>
                            {descriptionVariation}
                        </Text>
                    </View>

                    <View style={styles.quantityContainer}>
                        <Text style={styles.btnSubtract}
                            onPress={() => {
                                if (quantity2 <= 0) return;

                                const qtty = quantity2 - 1;
                                setQuantity2(qtty);
                                setTotalQuantity(quantity + (qtty * selectedProduct.quantityVariation));
                            }}
                        >
                            -
                        </Text>

                        <Text style={styles.quantity}>
                            {quantity2}
                        </Text>

                        <Text style={styles.btnAdd}
                            onPress={() => {
                                const qtty = quantity2 + 1;
                                setQuantity2(qtty);
                                setTotalQuantity(quantity + (qtty * selectedProduct.quantityVariation));
                            }}
                        >
                            +
                        </Text>
                    </View>
                </>
            }

            <>
                <View style={[styles.priceContainer, { marginTop: 30 }]}>
                    <Text style={styles.price}>
                        {masks.moneyMask(mainPrice)}
                    </Text>
                    <Text style={{ color: "red" }}>
                        Unidade
                    </Text>
                </View>

                <View style={styles.quantityContainer}>
                    <Text style={styles.btnSubtract}
                        onPress={() => {
                            if (quantity <= !showPrice2 ? 1 : 0) return;

                            const qtty = quantity - 1;
                            setQuantity(qtty);
                            setTotalQuantity(qtty + (quantity2 * selectedProduct.quantityVariation));
                        }}
                    >
                        -
                    </Text>

                    <Text style={styles.quantity}>
                        {quantity}
                    </Text>

                    <Text style={styles.btnAdd}
                        onPress={() => {
                            const qtty = quantity + 1;
                            setQuantity(qtty);
                            setTotalQuantity(qtty + (quantity2 * selectedProduct.quantityVariation));
                        }}
                    >
                        +
                    </Text>
                </View>
            </>

            { totalQuantity > 0 && (
                <TouchableOpacity style={styles.addItemContainer}
                    onPress={() => btnAddClick(selectedProduct)}
                >
                    <Text style={styles.addItemText}>
                        {`Adicionar(${totalQuantity})`}
                    </Text>
                </TouchableOpacity>

            )}

            { !totalQuantity && (
                <View style={[styles.addItemContainer, {backgroundColor: "grey"}]}>
                    <Text style={styles.addItemText}>
                        {`Adicionar(${totalQuantity})`}
                    </Text>
                </View>

            )}

        </KeyboardAvoidingView>
    );

    function btnAddClick(selectedProduct, returnRoute) {

        if (!returnRoute) returnRoute = route.params;

        if (!quantity && !quantity2) return null;

        const previousQuantity = store.getState().cartState.quantityOfItems;

        if (quantity > 0) updateCart(selectedProduct, quantity, mainPrice);

        if (quantity2 > 0) updateCart(
            selectedProduct,
            quantity2 * selectedProduct.quantityVariation,
            price2,
            selectedProduct.quantityVariation,
            selectedProduct.priceVariation,
            selectedProduct.descriptionVariation,
        );

        if (previousQuantity === 0) {
            return navigation.navigate('Address', !!returnRoute ? returnRoute : 'ShoppingList');
        };

        navigation.navigate(!!returnRoute ? returnRoute : 'ShoppingList');

        //////////////////////////////////////

        async function updateCart(item, qtty, price, qttyVar = 0, priceVar = 0, descVar = '') {
            store.dispatch(actions.actionAddToCart(
                {
                    id: item.id,
                    description: item.description,
                    quantity: qtty,
                    price: price,
                    image: item.image,
                    shippingTax: await utils.getShippingTax(),
                    productPrice: item.productPrice,

                    priceVariation: priceVar,
                    quantityVariation: qttyVar,
                    descriptionVariation: descVar,
                }
            ));
        };
    };

};

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
        width: 200,
        height: 200,
    },
    descriptionContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 10,
        paddingHorizontal: 30,
    },
    description: {
        fontSize: 18,
        color: "grey",
    },

    priceContainer: {
        justifyContent: "flex-start",
        marginLeft: 30,
        marginTop: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#555555",
    },

    quantityContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginHorizontal: 15,
        paddingVertical: 1,
        paddingHorizontal: 20,
        borderRadius: 15,
        backgroundColor: "#efefef",

        borderColor: "silver",
        borderWidth: 1,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    btnSubtract: {
        fontSize: 28,
        fontWeight: "bold",
        color: "blue",
        paddingHorizontal: 25,
    },
    quantity: {
        fontSize: 20,
        fontWeight: "bold",
    },
    btnAdd: {
        fontSize: 28,
        fontWeight: "bold",
        color: "blue",
        paddingHorizontal: 25,
    },

    addItemContainer:
        def.confirmButtonContainer(),

    addItem2Container:
        def.confirmButtonContainer(),

    addItemText:
        def.confirmButtonText(),
});

export default SelectedItem;
