import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from "@expo/vector-icons";

const header = ({ title, exitRoute, navigation }) => {
    return (
        <View style={styles.header}>
            <Feather
                style={styles.arrowLeftIcon}
                name="arrow-left"
                onPress={() => navigation.navigate(exitRoute)}
            />
            <Text style={styles.title}>
                {title}
            </Text>
            <Text style={{ width: 50 }}></Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    arrowLeftIcon: {
        width: 50,
        fontSize: 28,
        color: "grey"
    },
    title: { 
        paddingTop: 5,
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#a6a6a6',
    },
});

export default header;