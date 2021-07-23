import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import store from '../store';
import * as actions from '../store/actions';
import * as utils from '../utils';
import * as masks from '../utils/masks';
// import Loader from "../components/Loader";

export const ProductImage = React.memo( ({ image }) => {
    return (
        <Image
            style={{ width: 80, height: 80 }}
            source={utils.getImage(image)}
            resizeMode={"contain"}
        />
    );
});

export const Price = React.memo( ({ price, descriptionVariation }) => {
    const masekedPrice = masks.moneyMask( price );
    return (
        <View>
            <Text style={[styles.detText, { fontWeight: "bold" }]}>
                {masekedPrice}  {descriptionVariation}
            </Text>
        </View>
    );
});

export const Description = React.memo( ({ description }) => {
    return (
        <View>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: 'grey' }}>
                {description}
            </Text>
        </View>
    );
});

export const Item = React.memo( ({ item }) => {
    const [quantity, setQuantity] = React.useState(item.quantity);
    const [loading, setLoading] = React.useState(false);
            
    async function btnRemoveClick() {
        store.dispatch( actions.actionRemoveFromCart( item ) );
    };

    async function btnAddClick() {
        // setLoading(true);
        // setTimeout(() => setLoading(false), 900);
    
        const qttyAdd = (item.quantityVariation === 0 ? 1 : item.quantityVariation);
        setQuantity( quantity + qttyAdd );
        store.dispatch( actions.actionAddToCart( await getItem(qttyAdd) ) );
    };

    async function btnSubtClick() {
        // setLoading(true);
        // setTimeout(() => setLoading(false), 900);
    
        const qttySub = (item.quantityVariation === 0 ? 1 : item.quantityVariation);
        if ( quantity > qttySub ) {
            setQuantity( quantity - qttySub );
            store.dispatch( actions.actionSubFromCart( await getItem(qttySub) ) );
        };
    };

    async function getItem( qtty ) {
        return {
            id: item.id,
            description: item.description,
            quantity: qtty,
            price: item.price,
            image: item.image,
            shippingTax: await utils.getShippingTax(),
            productPrice: item.productPrice,
            priceVariation: item.priceVariation,
            quantityVariation: item.quantityVariation,
            descriptionVariation: item.descriptionVariation,
        };
    };

    const Quantity = () => (
        <View style={styles.qttyContainer}>
            <TouchableOpacity
                style={{paddingHorizontal: 20}}
                onPress={ () => btnSubtClick() }
            >
                <Text style={{ fontSize: 36, color: 'blue' }}>
                    -
                </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 20, color: 'black' }}>
                {quantity}
            </Text>

            <TouchableOpacity
                style={{paddingHorizontal: 20}}
                onPress={ () => btnAddClick(item) }
            >
                <Text style={{ fontSize: 26, color: 'blue' }}>
                    +
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            {!!quantity && (
                <View style={styles.itemsDetailsContainer}>
                    {/* {loading && (<Loader />)} */}

                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <ProductImage image={item.image} />
                    </View>

                    <View style={{ width: '60%' }}>
                        
                        <Description description={item.description} />

                        <Price price={item.price} descriptionVariation={item.descriptionVariation} />
                        
                        <Quantity />

                    </View>

                    <TouchableOpacity style={{ width: '10%', alignItems: 'center' }}
                        onPress={ () => btnRemoveClick(item) }
                    >
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}>
                            X
                        </Text>
                    </TouchableOpacity>

                </View>
            )}
        </>
    );

});



const styles = StyleSheet.create({

    itemsDetailsContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        paddingVertical: 10,

        backgroundColor: 'white',
        borderStyle: 'solid',
        borderColor: "gray",
        borderRadius: 10,
        elevation: 4,

        flexDirection: "row",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    },
    qttyContainer: {
        marginTop: 5,
        borderStyle: 'solid',
        borderColor: "silver",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    detText: {
        fontSize: 13,
        color: "black",
    },
    
});



// const styles = StyleSheet.create({
//     detText: {
//         fontSize: 13,
//         color: "black",
//     },
// });
