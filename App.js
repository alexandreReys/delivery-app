import { Anton_400Regular, useFonts } from "@expo-google-fonts/anton";
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from "react-native";
import { AppearanceProvider } from 'react-native-appearance';
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import Routes from "./src/routes";
import * as pushNotificationService from "./src/services/pushNotificationService";
import store from "./src/store";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [fontsLoaded] = useFonts({ Anton_400Regular });

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token);
            if (token) pushNotificationService.postPushNotificationToken(token);
        });

        // notificationListener.current = 
        Notifications.addNotificationReceivedListener( notification => {
            setNotification(notification);
        });

        // responseListener.current = 
        Notifications.addNotificationResponseReceivedListener( response => {
            console.log(response);
        });

        // return () => {
        //     Notifications.removeNotificationSubscription(notificationListener);
        //     Notifications.removeNotificationSubscription(responseListener);
        // };
    }, []);

    if (!fontsLoaded) { return <AppLoading /> };

    return (
        <Provider store={store}>
            <NavigationContainer>
                <AppearanceProvider>
                    <StatusBar barStyle="light-content" backGroundColor="black" translucent={false} />
                    <Routes />
                </AppearanceProvider>
            </NavigationContainer>
        </Provider>
    );
}



async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    }
    else {
        token = "EmulatorPushToken[0000000000000000000000]";
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}


async function NewRegisterForPushNotificationsAsync() {
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
        this.setState({ expoPushToken: token });
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
};






async function sendPushNotification(expoPushToken) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
    });
}