import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View
} from "react-native";
import Header from "../../components/Header";
import * as defs from "../../configs/default";
import * as orderService from "../../services/orderService";
import store from "../../store";
import * as utils from "../../utils";
import * as masks from "../../utils/masks";





const CustomerOrder = ({ route, navigation }) => {

    const [order, setOrder] = useState(route.params.order);
    const [items, setItems] = useState([]);
    const [historyItems, setHistoryItems] = useState([]);

    useEffect(() => {
        getOrderItems();
        getOrderHistoryItems();
    }, []);

    async function getOrderItems() {
        (async function () {
            const response = await orderService.getOrderItems(order.IdOrder);
            if (response) setItems(response);
        })();
    };

    async function getOrderHistoryItems() {
        (async function () {
            const response = await orderService.getOrderHistory(order.IdOrder);
            if (response) setHistoryItems(response);
        })();
    };

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>
            <Header title={`PEDIDO Nº ${order.IdOrder}`} exitRoute='CustomerOrders' navigation={navigation} />

            <ScrollView vertical showsHorizontalScrollIndicator={false}>

                <View style={styles.orderContainer}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.title}>
                            Entrega
                        </Text>

                        <TouchableWithoutFeedback
                            onPress={() => whatsappPress(
                                order.CustomerNameOrder,
                                order.IdOrder,
                            )}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <FontAwesome
                                    style={{ fontSize: 24, fontWeight: 'bold', color: "green", marginRight: 10, paddingTop: 2 }}
                                    name="whatsapp"
                                />
                                <Text style={[styles.title, { color: 'green' }]}>
                                    Ajuda
                                </Text>
                            </View>

                        </TouchableWithoutFeedback>
                    </View>

                    {historyItems.map((historyItem, idx) => <HistoryItem key={idx} historyItem={historyItem} />)}
                </View>

                <Order order={order} navigation={navigation}/>

                <View style={[styles.orderContainer]}>
                    <Text style={styles.title}>
                        Produtos
                    </Text>
                    {items.map((item, idx) => <Item key={idx} item={item} />)}
                </View>

                <Resume order={order} />

                <HelpMe order={order} />

            </ScrollView>
        </KeyboardAvoidingView>
    );
};





const HistoryItem = ({ historyItem }) => {
    return (
        <>
            {!!historyItem && (
                <View style={{
                    width: '100%',
                    paddingVertical: 5,
                    flexDirection: 'row',
                }}>

                    <Feather name="check-square" style={{ color: 'green', fontSize: 20, paddingTop: 8, width: '10%' }} />

                    <Text style={[styles.text, { width: '30%' }]}>
                        {utils.formattedDateTime(historyItem.Date_OrderHistory, historyItem.Time_OrderHistory)}
                    </Text>

                    <Text style={[styles.text]}>
                        {historyItem.Status_OrderHistory}
                    </Text>
                </View>
            )}
        </>
    );
};




const Order = ({ order, navigation }) => {
    return (
        <>
            {!!order && (
                <View style={[styles.orderBox, { width: '100%' }]}>
                    
                    {order.StatusOrder !== 'Entregue' && (
                        <View style={styles.orderContainer}>
                            <TouchableOpacity
                                onPress={()=>{
                                    orderService.cancelOrder(order.IdOrder);
                                    navigation.navigate('ShoppingList')
                                }}
                            >
                                <Text style={{fontWeight: 'bold', color: '#fe7015'}}>
                                    Cancelar Pedido
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    
                    <View style={styles.orderContainer}>
                        <Text style={styles.title}>
                            Endereço
                        </Text>
                        <Text style={styles.text}>
                            {order.CustomerAddressOrder}
                        </Text>
                    </View>

                    <View style={styles.orderContainer}>
                        <Text style={styles.title}>
                            Pagamento na entrega
                        </Text>
                        <Text style={styles.text}>
                            {order.PaymantTypeOrder}
                        </Text>
                    </View>

                </View>
            )}
        </>
    );
};




const Item = ({ item }) => {
    return (
        <>
            {!!item && (
                <View style={{
                    width: '100%',
                    paddingVertical: 5,
                    flexDirection: 'row',
                }}>
                    <Text style={[styles.text, { width: '10%' }]}>
                        {item.quantityOrderItem}
                    </Text>
                    <Text style={[styles.text, { width: '90%' }]}>
                        {item.DescricaoVinho.toUpperCase()}
                    </Text>
                </View>
            )}
        </>
    );
};




const Resume = ({ order }) => {
    return (
        <>
            {!!order && (
                <View style={[styles.orderBox, { width: '100%' }]}>

                    <View style={styles.orderContainer}>
                        <Text style={styles.title}>
                            Totais
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.text}>
                                {order.QuantityItemsOrder} produtos
                            </Text>
                            <Text style={styles.text}>
                                {masks.moneyMask(order.TotalProductsOrder)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.text}>
                                Frete
                            </Text>
                            <Text style={styles.text}>
                                {masks.moneyMask(order.ShippingAmountOrder)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.text}>
                                Total a pagar
                            </Text>
                            <Text style={styles.text}>
                                {masks.moneyMask(order.TotalOrder)}
                            </Text>
                        </View>
                    </View>

                </View>
            )}
        </>
    );
};





const HelpMe = ({ order }) => {
    return (
        <View style={[styles.orderContainer, { marginBottom: 150, }]}>
            <TouchableWithoutFeedback
                onPress={() => whatsappPress(
                    order.CustomerNameOrder,
                    order.IdOrder,
                )}
            >
                <View style={{
                    width: '100%',
                    paddingVertical: 5,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}>
                    <FontAwesome
                        style={{ fontSize: 32, fontWeight: 'bold', color: "green", marginRight: 18, paddingTop: 2 }}
                        name="whatsapp"
                    />
                    <Text style={[styles.text, { fontSize: 18 }]}>
                        Preciso de ajuda
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
};


function whatsappPress(name, id) {
    // const name = order.CustomerNameOrder;
    // const id = order.IdOrder;
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

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: defs.backgroundColor,
        // backgroundColor: "#f2f9f9",
    },
    orderBox: {
    },
    orderContainer: {
        backgroundColor: 'white',
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defs.labelColor,
    },
    text: {
        marginTop: 8,
        fontWeight: 'bold',
        color: defs.infoColor,
    },
});

export default CustomerOrder;
