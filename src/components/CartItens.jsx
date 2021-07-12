import React from 'react';
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";

import { Item } from './CartItems-comps';

const CartItens = React.memo( ({ addedItems }) => {
    return (
        <View>
            {addedItems.map( (item, idx) => (
                <Item key={idx} item={item} style={styles.itemsDetailsContainer}/>
            ) )}
        </View>
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
});

export default connect((state) => ({
    addedItems: state.cartState.addedItems,
}))(CartItens);
