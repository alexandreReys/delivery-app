import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView, BackHandler,
    StyleSheet, View, Text, ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as masks from "../../utils/masks";
import * as utils from "../../utils";
import store from "../../store";
import { actionCartReset } from "../../store/actions";

const Confirmed = ({ navigation }) => {
    const [insertId] = useState(navigation.state.params.insertId);
    const [dateOrder] = useState(navigation.state.params.dateOrder);
    const [timeOrder] = useState(navigation.state.params.timeOrder);
    const [prevision, setPrevision] = useState(null);

    const [subtotal] = useState(masks.moneyMask(store.getState().cartState.subtotal));
    const [shipping] = useState(masks.moneyMask(store.getState().cartState.shipping));
    const [total] = useState(masks.moneyMask(store.getState().cartState.total));
    const [addedItems] = useState(store.getState().cartState.addedItems);
    const [quantityOfItems] = useState(store.getState().cartState.quantityOfItems);
    const [paymentType] = useState(store.getState().cartState.paymentType);

    const addr = store.getState().addressState;

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
        setPrevision(utils.orderPrevision(dateOrder, timeOrder));
        return () => { store.dispatch(actionCartReset()) }
    }, [])

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>

            <View style={styles.header}>
                <Feather
                    style={styles.headerIcon}
                    name="arrow-left"
                    onPress={() => { navigation.navigate('ShoppingList') }}
                />
                <Text style={{ fontSize: 24, color: "#777777" }}>Pedido Confirmado</Text>
                <Text style={{ width: 50 }}></Text>
            </View>

            <View style={styles.orderIdContainer}>
                <View style={{ width: "12%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <Feather
                        style={{ fontSize: 22, color: "black" }}
                        name="award"
                    />
                </View>
                <View style={{ width: "88%", }}>
                    <Text style={{ fontSize: 14, color: "black", fontWeight: "bold" }}>
                        Pedido : {insertId}
                    </Text>
                </View>
            </View>

            <View style={styles.line} />

            <View style={styles.previsionContainer}>
                <View style={{ width: "12%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <Feather
                        style={{ fontSize: 22, color: "black" }}
                        name="clock"
                    />
                </View>
                <View style={{ width: "88%", }}>
                    <Text style={{ fontSize: 14, color: "black", fontWeight: "bold" }}>
                        Previsão de entrega
          </Text>
                    <Text style={{ fontSize: 14, color: "#444" }}>
                        {timeOrder.substr(0, 5)} - {prevision}
                    </Text>
                </View>
            </View>

            <View style={styles.line} />

            <View style={styles.addressContainer}>
                <View style={{ width: "12%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <Feather
                        style={{ fontSize: 22, color: "black" }}
                        name="map-pin"
                        onPress={() => { navigation.navigate('ShoppingList') }}
                    />
                </View>
                <View style={{ width: "88%", }}>
                    <Text style={{ fontSize: 14, color: "black", fontWeight: "bold" }}>
                        Receber agora em
          </Text>
                    <Text style={{ fontSize: 14, color: "#444" }}>
                        {`${addr.street}, ${addr.number}`}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#444" }}>
                        {`${addr.neighborhood}, ${addr.city}, ${addr.state}`}
                    </Text>
                </View>

            </View>

            <View style={styles.line} />

            <View style={styles.paymentContainer}>
                <View style={{ width: "12%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <Feather
                        style={{ fontSize: 22, color: "black" }}
                        name="credit-card"
                        onPress={() => { navigation.navigate('ShoppingList') }}
                    />
                </View>
                <View style={{ width: "88%", }}>
                    <Text style={{ fontSize: 14, color: "black", fontWeight: "bold" }}>
                        Pagamento na entrega
          </Text>
                    <Text style={{ fontSize: 14, color: "#444" }}>
                        {paymentType}
                    </Text>
                </View>
            </View>

            <View style={styles.line} />

            {/* <View style={styles.resumeContainer}> */}
            <View>

                <View style={styles.orderIdContainer}>
                    <View style={{ width: "13%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                        <Feather
                            style={{ fontSize: 22, color: "black" }}
                            name="shopping-cart"
                        />
                    </View>
                    <View style={[styles.resumeItems, { width: "90%" }]}>
                        <View>
                            <Text style={styles.resumeText}>{quantityOfItems} produto(s)</Text>
                        </View>
                        <View>
                            <Text style={styles.resumeText}>{subtotal}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.orderIdContainer}>
                    <View style={{ width: "13%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                        <Feather
                            style={{ fontSize: 22, color: "black" }}
                            name="truck"
                        />
                    </View>
                    <View style={[styles.resumeItems, { width: "90%" }]}>
                        <View>
                            <Text style={styles.resumeText}>Frete</Text>
                        </View>
                        <View>
                            <Text style={styles.resumeText}>{shipping}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.orderIdContainer}>
                    <View style={{ width: "13%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                        <Feather
                            style={{ fontSize: 22, color: "black" }}
                            name="dollar-sign"
                        />
                    </View>
                    <View style={[styles.resumeItems, { width: "90%" }]}>
                        <View>
                            <Text style={styles.resumeTextTotal}>Total</Text>
                        </View>
                        <View>
                            <Text style={styles.resumeTextTotal}>{total}</Text>
                        </View>
                    </View>
                </View>

            </View>

            <View style={styles.line} />

            <View style={styles.itemsHeaderContainer}>
                <View style={[{flexDirection: "row"},styles.header1]}>
                    <Feather
                        style={{ fontSize: 22, color: "black", marginRight: 10 }}
                        name="list"
                    />
                    <Text style={styles.headerText}>Produtos</Text>
                </View>
                <View style={styles.header2}>
                    <Text style={styles.headerText}>Qtde</Text>
                </View>
            </View>

            <ScrollView vertical style={styles.itemsDetails}>
                {addedItems.map((item) => {
                    return (
                        <View key={item.description} style={styles.itemsDetailsContainer}>
                            <View style={styles.det1}>
                                <Text>{item.description}</Text>
                            </View>
                            <View style={styles.det2}>
                                <Text>{item.quantity}</Text>
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
        // backgroundColor: "#fff",
        backgroundColor: "white",
    },
    line: {
        height: 2,
        width: "90%",
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: "5%",
        // borderBottomColor: "maroon",
        // borderBottomWidth: 2
    },
    header: {
        // backgroundColor: "#263238",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    arrowLeftIcon: {
        width: 50,
        fontSize: 28,
        color: "green"
    },
    orderIdContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        marginLeft: 20,
        marginRight: "30%",
    },
    previsionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
    },
    addressContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
    },
    paymentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
    },
    itemsHeaderContainer: {
        marginBottom: 1,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 5,
        flexDirection: "row",
    },
    itemsDetails: {
        // backgroundColor: "white",
    },
    itemsDetailsContainer: {
        flexDirection: "row",
        marginTop: 5,
        marginLeft: 20,
        marginRight: 5,
    },

    header1: {
        fontWeight: "bold",
        width: "78%",
    },
    header2: {
        alignItems: "center",
        fontWeight: "bold",
        width: "20%",
    },
    headerIcon: {
        width: 50,
        fontSize: 28,
        color: "#777777",
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "black",
    },

    det1: {
        width: "78%",
    },
    det2: {
        alignItems: "center",
        width: "20%",
    },

    resumeContainer: {
        marginHorizontal: 12,
    },
    resumeItems: {
        flexDirection: "row",
        justifyContent: "space-between",
        // marginTop: 10,
        paddingHorizontal: 10,
    },

    resumeShipping: {
        flexDirection: "row",
        justifyContent: "space-between",
        // marginTop: 10,
        paddingHorizontal: 10,
    },

    // resumeTotal: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     marginTop: 5,
    //     paddingHorizontal: 10,
    // },
    resumeText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
    },
    resumeTextTotal: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
});

export default Confirmed;
