import React from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from '../../components/Header';
import * as loginService from '../../services/loginService'
import * as utils from '../../utils'

const Login = ({ navigation }) => {
    return (
        <KeyboardAvoidingView style={styles.mainContainer} behavior="height">
            <Header title={'ENTRAR NA CONTA'} exitRoute={'ShoppingList'} navigation={navigation} />
            <Form navigation={navigation} />
        </KeyboardAvoidingView>
    );

    function Form({ navigation }) {
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        return (
            <View style={styles.formContainer}>
                <Text style={styles.textTop}>
                    Entrar na conta com e-mail e senha :
                </Text>

                <TextInput
                    style={styles.textInput}
                    placeholder="E-mail"
                    maxLength={100}
                    onChangeText={text => setEmail(text)}
                    defaultValue={email}
                // autoFocus={true}
                />

                <TextInput
                    style={styles.textInput}
                    placeholder="Senha"
                    maxLength={20}
                    onChangeText={text => setPassword(text)}
                    defaultValue={password}
                />

                <TouchableOpacity
                    style={styles.buttonEnter}
                    onPress={async () => {
                        const response = await loginService.login(email, password);
                        if (response) {
                            navigation.navigate('Payment')
                        };
                    }}
                >
                    <Text style={styles.buttonEnterText}>
                        ENTRAR
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={ () => navigation.navigate('NewAccount') }
                >
                    <Text style={styles.linkCreateText}>
                        Quero criar uma conta
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={ async () => {
                        const response = await loginService.passwordRecover(email);
                        if (response) {
                            utils.showAlert( 'Sua senha foi enviada !!', 'Verifique sua caixa de mensagens' );
                        };

                    } }
                >
                    <Text style={styles.linkCreateText}>
                        Esqueci minha senha
                    </Text>
                </TouchableOpacity>


            </View>
        );
    }
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: "#f5f5f5",
    },
    textInput: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 7,
        borderColor: 'silver',
        borderWidth: 1,
        marginBottom: 10,
    },
    formContainer: {
        padding: 20,
    },
    textTop: {
        color: '#283593',
        marginBottom: 15,
        fontWeight: 'bold'
    },
    buttonEnter: {
        marginTop: 25,
        backgroundColor: '#3559a4',
        paddingVertical: 10,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'silver',
        elevation: 5,
    },
    buttonEnterText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
    linkCreateText: {
        marginTop: 35,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#d55023',
        textAlign: 'center',
    },
});

export default Login;