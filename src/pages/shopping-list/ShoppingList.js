import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback,
    View, ScrollView, Text, Image, TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import logo from "../../../assets/logo-shopping-list.png"
import banner from "../../../assets/app-banner.jpeg";

import * as masks from "../../utils/masks";
import * as utils from "../../utils";
import * as defs from "../../configs/default";

import * as productService from "../../services/productService";
import * as orderService from "../../services/orderService";
import * as settingsService from "../../services/settingsService";

import store from "../../store";
import { actionSelectProduct } from "../../store/actions";

import Loader from "../../components/Loader";
// import LottieView from 'lottie-react-native';

const ShoppingList = ({ navigation, addressState, quantityOfItems }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductsAddressAndSettings();
    }, []);

    async function getProductsAddressAndSettings() {
        const data = await productService.getProductsGroupedByCategory();
        if (data) setProducts(data);

        await orderService.getAddressStorage();
        await settingsService.get();

        setLoading(false);
    };

    const showAddress = () => {
        if (!addressState.street) return " ";
        return addressState.street + ", " + addressState.number;
    }

    const handleShoppingCartBtn = () => {
        if (!addressState.street) return navigation.navigate('Address');
        navigation.navigate('ShoppingCart')
    }

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>

            {/* logo, address, cart */}
            <View style={stylesHeader.headerContainer}>
                <View>
                    <Image
                        style={stylesHeader.logotipo}
                        source={logo}
                    />
                </View>

                <TouchableOpacity
                    style={stylesHeader.addressContainer}
                    onPress={() => { navigation.navigate('Address', 'ShoppingList') }}
                >
                    <View style={{ flexDirection: "row" }}>
                        <Text style={stylesHeader.address1Text}>
                            Receber agora em:
                        </Text>
                        <MaterialCommunityIcons
                            style={{ marginLeft: 24, color: "white", fontSize: 20, fontWeight: "bold" }}
                            name="chevron-down"
                        />
                    </View>
                    <View>
                        <Text style={stylesHeader.address2Text}>
                            {utils.filterDesc25(showAddress())}
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={stylesHeader.shoppinCartContainer}>
                    {quantityOfItems > 0 &&
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                                onPress={handleShoppingCartBtn}
                            >
                                <Feather
                                    style={stylesHeader.shoppinCartIcon}
                                    name="shopping-cart"
                                />
                            </TouchableOpacity>
                            <Text style={{ color: "white", alignSelf: "flex-end", marginLeft: 5 }}>{quantityOfItems}</Text>
                        </View>
                    }
                </View>
            </View>

            {/* search */}
            <TouchableWithoutFeedback
                onPress={() => { navigation.navigate("Search") }}
            >
                <View style={stylesHeader.searchContainer}>
                    <View style={stylesHeader.searchArea}>
                        <Text style={stylesHeader.searchText}>Pesquise sua bebida favorita</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>


            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <Image source={banner} style={{marginVertical: 10, width: "95%", height: 200, borderRadius: 20}} />
            </View>

            { loading && (<Loader />)}

            { !loading && (
                <MainContent products={products} navigation={navigation} />
            )}

        </KeyboardAvoidingView>
    )
};

const MainContent = ({ products, navigation }) => {
    return (
        <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
        >
            {products.map((it) => (
                <View vertical key={it.category} style={styles.categoryTitle}>
                    <Text style={styles.categoryDescription}>{it.category}</Text>
                    <ProductRow categoryProducts={it.products} navigation={navigation} />
                </View>
            ))}
        </ScrollView>
    );
};

const ProductRow = ({ categoryProducts, navigation }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.productRow}
        >
            {categoryProducts.map((product) => (
                <Product key={product.IdVinho} product={product} navigation={navigation} />
            ))}

            <View
                style={seeAllStyles.seeAllContainer}
            >
                <TouchableOpacity
                    style={seeAllStyles.seeAllButton}
                    onPress={() => {
                        navigation.navigate("SeeAll", { category: categoryProducts[0].TipoVinho })
                    }}
                >
                    <Feather name="arrow-right" style={seeAllStyles.seeAllIcon}></Feather>
                </TouchableOpacity>
                <Text style={seeAllStyles.seeAllText}>Ver Todos</Text>
            </View>
        </ScrollView>
    );
};

const Product = ({ product, navigation }) => {
    product = utils.adjustPromotionalPrice(product);

    var precoVinho, precoAnterVinho;

    if (product.EmPromocaoVinho && product.PrecoVinho >= 100) { precoVinho = masks.numberMask(product.PrecoVinho) }
    else { precoVinho = masks.moneyMask(product.PrecoVinho) };

    if (product.EmPromocaoVinho && product.PrecoPromocionalVinho >= 100) { precoAnterVinho = masks.moneyMaskSpaceless(product.PrecoAnterVinho) }
    else { precoAnterVinho = masks.moneyMask(product.PrecoAnterVinho) };

    productClick = (product) => {
        const param = {
            id: product.IdVinho,
            description: product.DescricaoVinho,
            quantity: 1,
            price: product.PrecoVinho,
            image: product.Imagem1Vinho,
        };
        store.dispatch(actionSelectProduct(param));
        navigation.navigate('SelectedItem');
    };

    return (
        <TouchableWithoutFeedback
            key={product.IdVinho}
            onPress={() => productClick(product)}
        >
            <View style={styles.productBox}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={utils.getImage(product.Imagem1Vinho)}
                        resizeMode={"contain"}
                    />
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        {utils.filterDesc25(product.DescricaoVinho)}
                    </Text>
                </View>

                <View style={styles.priceContainer}>
                    <View style={[{ flexDirection: "row" }]}>
                        <Text style={!product.EmPromocaoVinho ? styles.price : styles.priceLine}>
                            {precoAnterVinho}
                        </Text>

                        {!!product.EmPromocaoVinho && (
                            <Text style={styles.price}>
                                {precoVinho}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};


const stylesHeader = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        height: 60,
        backgroundColor: "#222222",
        paddingTop: 10,
        paddingHorizontal: 15,
    },

    logotipo: {
        width: 40,
        height: 40,
    },

    addressContainer: {
        width: 220,
    },
    address1Text: {
        color: "#ffcb01",
        fontSize: 16,
        fontWeight: "bold",
    },
    address2Text: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },

    shoppinCartContainer: {
        paddingHorizontal: 10,
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    shoppinCartIcon: {
        color: "yellow",
        fontSize: 30,
    },

    searchContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "black",
        height: 60,
        paddingHorizontal: 15,
    },
    searchArea: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "white",
        width: "100%",
        paddingVertical: 10,
        borderRadius: 10,
    },
    searchText: {
        color: "grey",
        fontSize: 14,
    },
});

const seeAllStyles = StyleSheet.create({
    seeAllContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 120
    },
    seeAllButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 70,
        borderColor: "silver",
        borderWidth: 1,
        borderRadius: 50,
        backgroundColor: "#fff",
        elevation: 5,
    },
    seeAllIcon: {
        fontSize: 32,
        color: "blue"
    },
    seeAllText: {
        marginTop: 5,
        fontWeight: "bold",
        color: "#1523c8"
    },
});

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },

    categoryTitle: {
        marginTop: 3,
        marginHorizontal: 10,
    },
    categoryDescription: {
        fontWeight: "bold",
        fontSize: 16,
        color: "navy",
    },

    productRow: {
        flexDirection: "row",
    },

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
        fontSize: 14,
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


export default connect((state) => ({
    addressState: state.addressState,
    quantityOfItems: state.cartState.quantityOfItems,
}))(ShoppingList);