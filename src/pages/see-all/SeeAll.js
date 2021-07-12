import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback,
    View, ScrollView, Text, Image, TouchableOpacity
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import noImage from "../../../assets/no-image.png";
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
            let data;
            if (navigation.state.params.category === "PROMOÇÃO") {
                let products = await productService.getActiveProductsInPromotion();
                data = products.map((product) => utils.adjustPromotionalPrice(product));
            } else {
                let products = await productService.getActiveProductsByCategory(navigation.state.params.category);
                data = products.map((product) => utils.adjustPromotionalPrice(product));
            };

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

    const { precoVinho, precoAnterVinho } = utils.getPrice(product);
    
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

                    productPrice: product.PrecoVinho,
                    priceVariation: product.PriceProductVariation ? product.PriceProductVariation : 0,
                    quantityVariation: product.QuantityProductVariation ? product.QuantityProductVariation : 0,
                    descriptionVariation: product.DescriptionProductVariation,
                };
                store.dispatch(actionSelectProduct(param));
                navigation.navigate('SelectedItem', 'SeeAll');
            }}
        >
            <View style={[productStyles.productBox, {width: '45%'}]}>
                <View style={productStyles.imageContainer}>
                    {!!product.Imagem1Vinho && (
                        <Image
                            style={productStyles.image}
                            source={{ uri: img }}
                            // resizeMode={"contain"}
                        />
                    )}
                    {!product.Imagem1Vinho &&
                        <Image
                            style={productStyles.image}
                            source={noImage}
                        />
                    }
                </View>

                <View 
                    style={[
                        productStyles.descriptionContainer, 
                        { marginBottom: product.QuantityProductVariation > 0 ? 5 : 30 }
                    ]}
                >
                    <Text style={productStyles.description}>
                        {utils.filterDesc25(product.DescricaoVinho)}
                    </Text>
                </View>
                
                { product.QuantityProductVariation > 0 && 
                    <View style={productStyles.descriptionVariation}>
                        <Text style={productStyles.descriptionVariationText}>
                            {product.DescriptionProductVariation}
                        </Text>
                    </View>
                }

                <View style={productStyles.priceContainer}>
                    <View style={[{ flexDirection: "row" }]}>
                        
                    <Text style={!product.EmPromocaoVinho ? productStyles.price : productStyles.priceLine}>
                            {precoAnterVinho}
                        </Text>

                        {!!product.EmPromocaoVinho && (
                            <Text style={productStyles.price}>
                                {precoVinho}
                            </Text>
                        )}

                    </View>
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
    descriptionVariation: {
        marginBottom: 30,
    },
    descriptionVariationText: {
        fontSize: 10, 
        color: 'red',
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
    priceLine: {
        paddingTop: 5,
        fontSize: 10,
        textDecorationStyle: 'solid',
        textDecorationLine: 'line-through',
        color: "red",
        marginRight: 5,
    },
});


export default SeeAll;
