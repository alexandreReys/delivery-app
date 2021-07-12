import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView, BackHandler,
    StyleSheet, View, Text, ScrollView, Linking
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import StepIndicator from 'react-native-step-indicator';
import { Rating, AirbnbRating } from 'react-native-ratings';

import * as masks from "../../utils/masks";
import * as utils from "../../utils";
import store from "../../store";
import { actionCartReset } from "../../store/actions";

import * as orderService from "../../services/orderService";

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

    const [position, setPosition] = useState(0);
    const [rating, setRating] = useState("");

    const labels = ["Pedido Enviado", "Separando Produtos", "Entregador saiu", "Chegando ...", "Entregue"];
    const reviews = ["Péssimo", "Ruim", "OK", "Gostei", "Ótimo"];
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: '#fe7013',
        stepStrokeWidth: 3,
        stepStrokeFinishedColor: '#fe7013',
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: '#fe7013',
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: '#fe7013',
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: '#fe7013',
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: '#fe7013'
    };

    const addr = store.getState().addressState;
    var myTimer;

    useEffect(() => {
        myTimer = setInterval(() => {
            if (position > 500) {
                console.log('timer finish')
                clearInterval(myTimer);
            } else {
                checkDeliveryStatus();
            };
        }, 15000);

        BackHandler.addEventListener('hardwareBackPress', () => true);
        setPrevision(utils.orderPrevision(dateOrder, timeOrder));
        return () => {
            clearInterval(myTimer);
            store.dispatch(actionCartReset());
        };
    }, [position])

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>
            <View style={styles.header}>
                <Feather
                    style={styles.headerIcon}
                    name="arrow-left"
                    onPress={() => { 
                        orderService.updateRatingOrder(insertId, rating);
                        navigation.navigate('ShoppingList')
                    }}
                />
                <Text style={{ fontSize: 24, color: "#777777" }}>Pedido Confirmado</Text>
                <Text style={{ width: 50 }}></Text>
            </View>

            <View>
                <StepIndicator
                    customStyles={customStyles}
                    currentPosition={position}
                    labels={labels}
                />
            </View>

            <View style={styles.orderIdContainer}>
                <View style={{ width: "10%" }}>
                    <Feather
                        style={{ fontSize: 22, color: "#731cac" }}
                        name="award"
                    />
                </View>
                <View>
                    <Text style={{ fontSize: 14, color: "navy", fontWeight: "bold" }}>
                        Pedido : {insertId}
                    </Text>
                </View>

                <View style={{ marginLeft: 50, width: "10%" }}>
                    <FontAwesome
                        style={{ fontSize: 22, color: "green" }}
                        name="whatsapp"
                        onPress={() => whatsappPress()}
                    />
                </View>
                <View>
                    <Text 
                        style={{ fontSize: 14, color: "green", fontWeight: "bold" }}
                        onPress={() => whatsappPress()}
                    >
                        Contato
                    </Text>
                </View>
            </View>

            <View style={styles.line} />

            <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    paddingLeft: 25,
                    marginBottom: 3,
                }}
            >
                <Text style={{fontWeight: "bold", color: "blue"}}>Mostre o quanto foi agradável sua compra</Text>
            </View>

            <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    paddingLeft: 20,
                    marginBottom: 10,
                }}
            >
                <AirbnbRating
                    style={{ color: "black"}}
                    onFinishRating={ratingCompleted}
                    selectedColor="blue"
                    reviewColor="blue"
                    reviewSize={16}
                    count={5}
                    showRating={false}
                    reviews={reviews}
                    defaultRating={0}
                    size={20}
                />
            </View>

            <ScrollView vertical>

                <View style={{paddingTop: 10, paddingBottom: 80}}>

                    {/* Previsão de Entrega */}
                    <View style={styles.infoContainer}>
                        <View style={{ width: "12%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                            <Feather
                                style={{ fontSize: 22, color: "#731cac" }}
                                name="clock"
                            />
                        </View>
                        <View style={{ width: "88%", }}>
                            <Text style={{ fontSize: 14, color: "navy", fontWeight: "bold" }}>
                                Previsão de entrega
                            </Text>
                            <Text style={{ fontSize: 14, color: "#444" }}>
                                {timeOrder.substr(0, 5)} - {prevision}
                            </Text>
                        </View>
                    </View>

                    {/* Endereço */}
                    <View style={styles.infoContainer}>
                        <View style={{ width: "12%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                            <Feather
                                style={{ fontSize: 22, color: "#731cac" }}
                                name="map-pin"
                                onPress={() => { navigation.navigate('ShoppingList') }}
                            />
                        </View>
                        <View style={{ width: "88%", }}>
                            <Text style={{ fontSize: 14, color: "navy", fontWeight: "bold" }}>
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

                    {/* Tipo Pagamento */}
                    <View style={styles.infoContainer}>
                        <View style={{ width: "12%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                            <Feather
                                style={{ fontSize: 22, color: "#731cac" }}
                                name="credit-card"
                                onPress={() => { navigation.navigate('ShoppingList') }}
                            />
                        </View>
                        <View style={{ width: "88%", }}>
                            <Text style={{ fontSize: 14, color: "navy", fontWeight: "bold" }}>
                                Pagamento na entrega
                </Text>
                            <Text style={{ fontSize: 14, color: "#444" }}>
                                {paymentType}
                            </Text>
                        </View>
                    </View>

                    {/* Qtde de Produtos, Frete, Total */}
                    <View style={
                        { 
                            borderWidth: 2, 
                            borderColor: "#501390", 
                            marginHorizontal: 20,
                            marginBottom: 10, 
                            borderRadius: 15, 
                            paddingBottom: 20,
                            backgroundColor: "white",
                            elevation: 5,
                        }
                    }>

                        {/* Qtde de Produtos */}
                        <View style={styles.totalContainer}>
                            <View style={{flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                                <Feather
                                    style={{ fontSize: 22, color: "#731cac" }}
                                    name="shopping-cart"
                                />
                            </View>

                            <View style={[styles.resumeItems, { width: "90%" }]}>
                                
                                <View>
                                    <Text style={styles.resumeText}>
                                        {quantityOfItems} produto(s)
                                    </Text>
                                </View>

                                <View>
                                    <Text style={styles.resumeText}>
                                        {subtotal}
                                    </Text>
                                </View>

                            </View>
                        </View>

                        {/* Frete */}
                        <View style={styles.totalContainer}>
                            <View style={{flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                                <Feather
                                    style={{ fontSize: 22, color: "#731cac" }}
                                    name="truck"
                                />
                            </View>
                            <View style={[styles.resumeItems, { width: "90%" }]}>
                                <View>
                                    <Text style={styles.resumeText}>
                                        Frete
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.resumeText}>{shipping}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Total */}
                        <View style={styles.totalContainer}>
                            <View style={{flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                                <Feather
                                    style={{ fontSize: 22, color: "#731cac" }}
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

                    <View style={styles.itemsHeaderContainer}>
                        <View style={[{ flexDirection: "row" }, styles.header1]}>
                            <Feather
                                style={{ fontSize: 22, color: "maroon", marginRight: 10 }}
                                name="list"
                            />
                            <Text style={styles.headerText}>Produtos</Text>
                        </View>
                        <View style={styles.header2}>
                            <Text style={styles.headerText}>Qtde</Text>
                        </View>
                    </View>

                    <View>
                        {addedItems.map((item, idx) => {
                            return (
                                <View key={idx} style={styles.itemsDetailsContainer}>
                                    <View style={styles.det1}>
                                        <Text>{item.description}</Text>
                                    </View>
                                    <View style={styles.det2}>
                                        <Text>{item.quantity}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );

    function whatsappPress() {
        let whatsappNumber = 
            '+55' + store.getState().defaultState.contactWhatsapp.replace(/\D/g, '');
        
        let url =
            'whatsapp://send?text=' + 'testando' + '&phone=' + whatsappNumber;
            
        Linking.openURL(url)
            .then((data) => {
                // console.log('WhatsApp Opened');
            })
            .catch(() => {
                alert('Não foi possivel acessar seu whatsapp');
            });
    };
    
    function checkDeliveryStatus() {
        async function getOrderStatus() {
            const order = await orderService.getOrder(insertId);
            if (order.StatusOrder === "Pendente" && position !== 1) {
                setPosition(1);   // Separando Produtos
            };
            if (order.StatusOrder === "Saiu para entregar" && position !== 2) {
                setPosition(2);   // Entregador saiu
            };
            if (order.StatusOrder === "A caminho" && position !== 3) {
                setPosition(3);   // Chegando ...
            };
            if (order.StatusOrder === "Entregue" && position !== 4) {
                setPosition(4);   // Entregue
            };
        };
        getOrderStatus();
    };

    function ratingCompleted(rating) {
        setRating(rating);
    };

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
        // justifyContent: "space-between",
        marginTop: 15,
        marginLeft: 20,
        marginRight: "30%",
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        marginLeft: 15,
        marginRight: 10,
    },
    infoContainer: {
        backgroundColor: "#e6e6e6",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "silver",
        elevation: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 15,
    },
    itemsHeaderContainer: {
        marginBottom: 1,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 5,
        flexDirection: "row",
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
        color: "navy",
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
        color: "navy",
    },
    resumeTextTotal: {
        fontSize: 16,
        fontWeight: "bold",
        color: "blue",
    },
});

export default Confirmed;
