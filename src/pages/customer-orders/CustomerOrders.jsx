import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback,
    View, ScrollView, Text, Linking, 
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as masks from "../../utils/masks";
import * as utils from "../../utils";
import * as defs from "../../configs/default";
import * as orderService from "../../services/orderService";
import store from "../../store";
import Header from "../../components/Header";


const CustomerOrders = ({ navigation }) => {

    const [orders, setOrders] = useState([]);

    useEffect(() => { getCustomerOrders() }, []);

    async function getCustomerOrders() {
        (async function () {
            const data = await orderService.getByDocument(store.getState().addressState.document);
            if (data) setOrders(data);
        })();
    };

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>
            <Header title='MEUS PEDIDOS' exitRoute='ShoppingList' navigation={navigation} />
            <ScrollView vertical showsHorizontalScrollIndicator={false}>
                <Orders orders={orders} navigation={navigation} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const Orders = ({ orders, navigation }) => {
    return (
        <View style={{ marginHorizontal: 20, flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
            {orders.map((order, idx) => (
                <Order key={idx} order={order} navigation={navigation} />
            ))}
        </View>
    );
};

const Order = ({ order, navigation }) => {

    function whatsappPress() {
        const name = order.CustomerNameOrder;
        const id = order.IdOrder;
        const whatsappNumber = 
            '+55' + store.getState().defaultState.contactWhatsapp.replace(/\D/g, '');
        const url =
            `whatsapp://send?text=Olá, meu nome é ${name} e gostaria de falar sobre o pedido ${id}&phone= ${whatsappNumber}`;
        Linking.openURL(url)
            .then((data) => {
                // 'WhatsApp Opened'
            })
            .catch(() => {
                alert('Não foi possivel acessar seu whatsapp');
            });
    };

    return (
        <View style={[styles.orderBox, { width: '100%' }]}>
            <View style={styles.orderContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.Status}>
                        Pedido {order.IdOrder}
                    </Text>
                    <Text style={styles.Date}>
                        {order.StatusOrder}
                    </Text>
                </View>
                <Text style={styles.Date}>
                    Data : {utils.formattedDateTime(order.DateOrder, order.TimeOrder)}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.Date}>
                        Total : {masks.moneyMask(order.TotalOrder)}
                    </Text>
                    <Text style={styles.Date}>
                        {order.PaymantTypeOrder}
                    </Text>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: defs.orangeBackColor,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                paddingVertical: 10,
                paddingHorizontal: 30,
            }}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.navigate('CustomerOrder', { order });
                    }}
                >
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: defs.orangeFrontColor,
                    }}>
                        Detalhes
                    </Text>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    onPress={() => whatsappPress()}
                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <FontAwesome
                            style={{ fontSize: 22, fontWeight: 'bold', color: "green", marginRight: 8, paddingTop: 2 }}
                            name="whatsapp"
                            onPress={() => whatsappPress()}
                        />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'green',
                        }}>
                            Ajuda
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: defs.backgroundColor,
        // backgroundColor: "#f2f9f9",
    },
    orderBox:
        defs.productBox(),

    orderContainer: {
        padding: 16,
    },
    Status: {
        fontSize: 20,
        fontWeight: 'bold',
        color: defs.labelColor,
    },
    Date: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: defs.infoColor,
    },
});

export default CustomerOrders;
