import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback,
    View, ScrollView, Text, Image, TouchableOpacity
} from "react-native";

import { Feather } from "@expo/vector-icons";

import logo from "../../../assets/logo-shopping-list.png";
import * as masks from "../../utils/masks";
import * as utils from "../../utils";
import * as defs from "../../configs/default";

import * as productService from "../../services/productService";
import store from "../../store";
import { actionSelectProduct } from "../../store/actions";


const SeeAll = ({ navigation }) => {
    
    const [products, setProducts] = useState([]);

    useEffect(() => { getProductList() }, []);

    async function getProductList() {

        async function getProductsByCategory() {
            const data = await productService.getActiveProductsByCategory(navigation.state.params.category);
            if (data) setProducts(data);
        };
        getProductsByCategory();

    }

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>

            <View style={headerStyles.header}>
                <Feather
                    style={headerStyles.headerIcon}
                    name="arrow-left"
                    onPress={() => { navigation.navigate('ShoppingList') }}
                />
                <Text style={headerStyles.headerText}>{navigation.state.params.category}</Text>
                <Text style={{ width: 50 }}></Text>
            </View>

            <ScrollView
                vertical
                showsHorizontalScrollIndicator={false}
            >
                <Products products={products} navigation={navigation} />
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

const Products = ({ products, navigation }) => {
    return (
        <View style={{ marginHorizontal: 20, flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
            {products.map((product) => (
                <Product key={product.IdVinho} product={product} navigation={navigation} />
            ))}
        </View>
    );
};

const Product = ({ product, navigation }) => {
    const precoVinho = masks.moneyMask(product.PrecoVinho);
    const img = product.Imagem1Vinho;

    return (
        <TouchableWithoutFeedback
            key={product.IdVinho}
            onPress={() => {
                const param = {
                    id: product.IdVinho,
                    description: product.DescricaoVinho,
                    quantity: 1,
                    price: product.PrecoVinho,
                    image: img,
                };
                store.dispatch(actionSelectProduct(param));
                navigation.navigate('SelectedItem');
            }}
        >
            <View style={productStyles.productBox}>
                <View style={productStyles.imageContainer}>
                    {!!product.Imagem1Vinho && (
                        <Image
                            style={productStyles.image}
                            source={{ uri: img }}
                            resizeMode={"contain"}
                        />
                    )}
                    {!product.Imagem1Vinho &&
                        <Image
                            style={productStyles.image}
                            source={logo}
                        />}
                </View>
                <View style={productStyles.descriptionContainer}>
                    <Text style={productStyles.description}>
                        {utils.filterDesc25(product.DescricaoVinho)}
                    </Text>
                </View>
                <View style={productStyles.priceContainer}>
                    <Text style={productStyles.price}>
                        {precoVinho}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#f2f9f9",
    },
});
const headerStyles = StyleSheet.create({
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
        fontSize: 16,
        color: "#777777",
        alignSelf: "center"
    },
});
const productStyles = StyleSheet.create({
    productBox:
        defs.productBox(),

    imageContainer: {
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 80,
    },

    descriptionContainer: {
        marginTop: 5,
        marginBottom: 30,
        paddingLeft: 2,

    },
    description: {
        fontSize: 14,
        color: "grey",
    },
    priceContainer: {
        position: 'absolute',
        left: 10,
        bottom: 10,
    },
    price: {
        fontWeight: "bold",
        fontSize: 16,
    },
});


export default SeeAll;
