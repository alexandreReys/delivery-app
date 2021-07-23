import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, Alert,
    View, ScrollView, Text, Image, TouchableOpacity, Linking, BackHandler
} from "react-native";
import { connect } from "react-redux";

import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import banner from "../../../assets/icon.png";

import * as utils from "../../utils";
import * as defs from "../../configs/default";

import * as productService from "../../services/productService";
import * as orderService from "../../services/orderService";
import * as settingsService from "../../services/settingsService";
import * as categoryService from "../../services/categoryService";

import store from "../../store";
import { actionGetCategories, actionSelectProduct } from "../../store/actions";

import Loader from "../../components/Loader";
import Carrousel from "../../components/carrousel"

// import LottieView from 'lottie-react-native';

const ShoppingList = ({ navigation, addressState, quantityOfItems }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchBox, setSearchBox] = useState(false);
    const [categories, setCategories] = useState([]);
    const [banner1, setBanner1] = useState("");
    const [banner2, setBanner2] = useState("");
    const [banner3, setBanner3] = useState("");

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);

        getProductsAddressAndSettings();

        async function getProductsAddressAndSettings() {
            const data = await productService.getProductsGroupedByCategory();
            if (data) setProducts(data);

            await orderService.getAddressStorage();

            await settingsService.get();

            setBanner1(store.getState().defaultState.appBannerSettings);
            setBanner2(store.getState().defaultState.appBanner2Settings);
            setBanner3(store.getState().defaultState.appBanner3Settings);

            setLoading(false);
        };

        // const backAction = () => {
        //     console.log('backAction', navigation.state.routeName);
        //     if (navigation.state.routeName == 'ShoppingList') {
        //         Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        //         {
        //             text: 'Cancel',
        //             onPress: () => null,
        //             style: 'cancel',
        //         },
        //         { text: 'YES', onPress: () => BackHandler.exitApp() },
        //         ]);
        //         return true;
        //     };
        // };
        // BackHandler.addEventListener('hardwareBackPress', backAction);
        // return () => BackHandler.removeEventListener('hardwareBackPress');
    }, []);


    const showAddress = () => {
        if (!addressState.street) return " ";
        return addressState.street + ", " + addressState.number;
    }

    const handleShoppingCartBtn = () => {
        if (!addressState.street) return navigation.navigate('Address');
        navigation.navigate('ShoppingCart')
    }

    const SearchBox = () => {
        const getCategories = async () => { setCategories(await categoryService.get()) };
        if (!categories.length) getCategories();

        return (
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View
                    style={{
                        marginVertical: 10, width: "95%",
                        borderRadius: 10, backgroundColor: "silver", elevation: 5,
                    }}
                >
                    <View style={{
                        marginTop: 1, marginLeft: 1, paddingVertical: 10,
                        width: "99%", borderRadius: 10, backgroundColor: "white",
                    }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", marginHorizontal: 15 }}>
                            {categories.map((category) => {
                                return (
                                    <Text
                                        key={category.IdCategory}
                                        style={{
                                            marginVertical: 5,
                                            paddingVertical: 5,
                                            width: 100,
                                            textAlign: "center",
                                            color: "navy",
                                            fontSize: 9,
                                            borderWidth: 1,
                                            borderColor: "orange",
                                            borderRadius: 5,
                                            backgroundColor: "#fffde7",
                                            elevation: 5,
                                        }}
                                        onPress={() => {
                                            setSearchBox(false)
                                            navigation.navigate("SeeAll", { category: category.DescriptionCategory })
                                        }
                                        }
                                    >
                                        {category.DescriptionCategory}
                                    </Text>
                                )
                            })}
                        </View>

                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>

            {/* logo, address, cart */}
            <View style={stylesHeader.headerContainer}>
                <View>
                    <Image
                        style={stylesHeader.logotipo}
                        source={utils.getImage(store.getState().defaultState.appLogoPSettings)}
                    />
                </View>

                <TouchableOpacity
                    style={stylesHeader.addressContainer}
                    onPress={() => { 
                        navigation.navigate('Address', 'ShoppingList') 
                    }}
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
            <TouchableWithoutFeedback >
                <View style={stylesHeader.searchContainer}>
                    <View style={stylesHeader.searchArea}>
                        <Text style={[stylesHeader.searchText, { paddingHorizontal: 15 }]}></Text>
                        <Text
                            style={stylesHeader.searchText}
                            onPress={() => { navigation.navigate("Search") }}
                        >
                            Pesquise sua bebida favorita
                        </Text>
                        <MaterialCommunityIcons
                            style={{
                                marginLeft: 24, color: "black", fontSize: 20,
                                fontWeight: "bold", paddingHorizontal: 15,
                            }}
                            name="chevron-down"
                            onPress={() => { setSearchBox(!searchBox) }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>

            {!!searchBox && (<SearchBox />)}

            {loading && (<Loader />)}

            {!loading && (
                <MainContent products={products} navigation={navigation} banner1={banner1} banner2={banner2} banner3={banner3} />
            )}

        </KeyboardAvoidingView>
    )
};



///////////////////////////////////////////////////////////////////////////////////////////////////
const MainContent = ({ products, navigation, banner1, banner2, banner3 }) => {
    // const imageList = [
    //     { uri: "https://www.anrsistemas.com.br/dv/1.jpg" },
    //     { uri: "https://www.anrsistemas.com.br/dv/2.jpg" },
    //     { uri: "https://www.anrsistemas.com.br/dv/3.jpg" },
    // ];
    const imageList = [
        { uri: banner1 }, { uri: banner2 }, { uri: banner3 },
    ];

    // console.log("shoppingList.imageList:", imageList);

    return (
        <ScrollView vertical showsVerticalScrollIndicator={false} >
            {!!banner1 && !!banner2 && !!banner3 && (
                <Carrousel imageList={imageList} />
            )}

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
    let seeAllStyles = StyleSheet.create({
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

    return (
        <ScrollView style={styles.productRow}
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {categoryProducts.map((product) => (
                <Product key={product.IdVinho} product={product} navigation={navigation} />
            ))}

            <View style={seeAllStyles.seeAllContainer}>
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

    const { precoVinho, precoAnterVinho } = utils.getPrice(product);

    return (
        <TouchableWithoutFeedback
            key={product.IdVinho}
            onPress={() => productClick(product)}
        >
            <View style={styles.productBox}>

                <View style={[styles.imageContainer]}>
                    <Image
                        style={styles.image}
                        source={utils.getImage(product.Imagem1Vinho)}
                        resizeMode={"contain"}
                    />
                </View>

                <View style={[styles.descriptionContainer,
                { marginBottom: product.QuantityProductVariation > 0 ? 5 : 30 }
                ]}>
                    <Text style={styles.description}>
                        {utils.filterDesc25(product.DescricaoVinho)}
                    </Text>
                </View>

                <PromotionalText product={product} />

                <PriceContainer product={product} precoAnterVinho={precoAnterVinho} precoVinho={precoVinho} />

            </View>
        </TouchableWithoutFeedback>
    );

    function PromotionalText({ product }) {
        if (product.QuantityProductVariation > 0) {
            return (
                <View style={{ marginBottom: 25 }}>
                    <Text style={{ fontSize: 10, color: "red" }}>
                        {product.DescriptionProductVariation}
                    </Text>
                </View>
            );
        };

        return null;
    };

    function PriceContainer({ product, precoAnterVinho, precoVinho }) {
        return (
            <View style={styles.priceContainer}>
                <View style={[{ flexDirection: "row" }]}>

                    <DiscardedPrice price={precoAnterVinho} emPromocao={product.EmPromocaoVinho} />

                    <EffectivePrice price={precoVinho} />

                </View>
            </View>
        );

        function DiscardedPrice({ price, emPromocao }) {
            if (!emPromocao) return null;

            return (
                <Text style={styles.priceLine}>
                    {price}
                </Text>
            );
        };

        function EffectivePrice({ price }) {
            return (
                <Text style={styles.price}>
                    {price}
                </Text>
            );
        };
    };

    function productClick(product) {
        const param = {
            id: product.IdVinho,
            description: product.DescricaoVinho,
            quantity: 1,
            price: product.PrecoVinho,
            image: product.Imagem1Vinho,

            productPrice: product.PrecoVinho,
            priceVariation: product.PriceProductVariation ? product.PriceProductVariation : 0,
            quantityVariation: product.QuantityProductVariation ? product.QuantityProductVariation : 0,
            descriptionVariation: product.DescriptionProductVariation,
        };
        store.dispatch(actionSelectProduct(param)); // => cart.item
        navigation.navigate('SelectedItem');
    };
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
        justifyContent: "space-between",
        backgroundColor: "white",
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    searchText: {
        color: "grey",
        fontSize: 14,
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