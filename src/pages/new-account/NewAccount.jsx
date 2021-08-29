import React from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from '../../components/Header';
import * as loginService from '../../services/loginService'

const Login = ({ navigation }) => {
    return (
        <KeyboardAvoidingView style={styles.mainContainer} behavior="height">
            <Header title={'CRIAR CONTA'} exitRoute={'ShoppingList'} navigation={navigation} />
            <Form  navigation={navigation} />
        </KeyboardAvoidingView>
    );

    function Form({ navigation }) {
        const [name, setName] = React.useState('');
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        const [cpf, setCpf] = React.useState('');
        const [phone, setPhone] = React.useState('');
        const [age, setAge] = React.useState('');

        return (
            <View style={styles.formContainer}>
                <Text style={styles.textTop}>
                    Criar conta com e-mail e senha :
                </Text>

                <TextInput placeholder="Nome e sobrenome"
                    style={styles.textInput}
                    maxLength={100}
                    onChangeText={text => setName(text)}
                    defaultValue={name}
                />

                <TextInput placeholder="E-mail"
                    style={styles.textInput}
                    maxLength={100}
                    onChangeText={text => setEmail(text)}
                    defaultValue={email}
                />

                <TextInput placeholder="Senha"
                    style={styles.textInput}
                    maxLength={20}
                    onChangeText={text => setPassword(text)}
                    defaultValue={password}
                />

                <TextInput placeholder="CPF"
                    style={styles.textInput}
                    maxLength={20}
                    onChangeText={text => setCpf(text)}
                    defaultValue={cpf}
                />

                <TextInput placeholder="Celular DDD + Numero"
                    style={styles.textInput}
                    maxLength={20}
                    onChangeText={text => setPhone(text)}
                    defaultValue={phone}
                />

                <TextInput placeholder="Idade"
                    style={styles.textInput}
                    maxLength={20}
                    onChangeText={text => setAge(text)}
                    defaultValue={age}
                />

                <TouchableOpacity style={styles.buttonEnter}
                    onPress={ async () => {
                        const response = await loginService.newAccount( { email, password, name } );

                        if (response) {
                            navigation.navigate('Login');
                        };
                    }}
                >
                    <Text style={styles.buttonEnterText}>
                        CRIAR CONTA
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={ async () => {
                        const response = await loginService.login(email, password);
                        if (response) {
                            navigation.navigate('Login')
                        };
                    }}
                >
                    <Text style={styles.linkCreateText}>
                        Já tenho uma conta
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