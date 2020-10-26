import React, { useState, useRef } from "react";
import {
  KeyboardAvoidingView, StyleSheet, TouchableOpacity,
  View, Text, TextInput, ScrollView, Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";

import store from "../../store";
import { actionDeliveryAddressSave } from "../../store/actions";

import * as masks from "../../utils/masks";
import * as utils from "../../utils";
import * as defs from "../../configs/default";
import * as orderService from "../../services/orderService";
import Loader from "../../components/Loader";

const Customer = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(store.getState().addressState.name);
  const [document, setDocument] = useState(store.getState().addressState.document);
  const [phoneNumber, setPhoneNumber] = useState(store.getState().addressState.phoneNumber);
  const [postalCode, setPostalCode] = useState(store.getState().addressState.postalCode);
  const [street, setStreet] = useState(store.getState().addressState.street);
  const [number, setNumber] = useState(store.getState().addressState.number);
  // const [complement, setComplement] = useState(store.getState().addressState.complement);
  // const [info, setInfo] = useState(store.getState().addressState.info);
  const [neighborhood, setNeighborhood] = useState(store.getState().addressState.neighborhood);
  const [city, setCity] = useState(store.getState().addressState.city);
  const [state, setState] = useState(store.getState().addressState.state);

  const [stateAddress, setStateAddress] = useState(orderService.getAddress(store.getState().addressState));

  const [buttonEnabled, setButtonEnabled] = useState(true);

  const refPostalCodeInput = useRef(null);

  function handleSubmit() {
    if (!buttonEnabled) return;
    if (!city) return;

    const addressValues = {
      name,
      document,
      phoneNumber,
      addressType: " ",
      postalCode,
      street,
      number,
      complement: " ",
      info: " ",
      neighborhood,
      city,
      state,
    };

    if (!validateFields(addressValues)) return false;

    store.dispatch(actionDeliveryAddressSave(addressValues));

    navigation.goBack();
  };

  const fillAddressByZipCode = async () => {
    if (!postalCode) return;

    const zipCode = postalCode;

    setStateAddress(null);

    setStreet(null)
    setNeighborhood(null);
    setCity(null);
    setState(null);

    if (!zipCode) {
      Alert.alert("oops", "Cep é informação obrigatória !!");
      return false;
    }

    if (zipCode.length < 9) {
      Alert.alert("CEP Invalido", "O Cep deve ter 9 digitos !!");
      setPostalCode("");
      refPostalCodeInput.current.focus();
      return false;
    }

    const zipCodeClean = zipCode.substr(0, 5) + zipCode.substr(6, 3);

    setButtonEnabled(false);
    
    setStateAddress("CONSULTANDO CEP ...");

    setStreet(" ");
    setNeighborhood(" ");
    setCity(" ");
    setState(" ");

    setLoading(true);
    const addr = await orderService.getCep(zipCodeClean);
    setLoading(false);
    
    if (!addr || !addr.logradouro) {
      utils.showAlert("Erro Consulta Cep", `Cep ${zipCode} não encontrado !!`);
      setStreet(" ");
      setPostalCode(" ");
      setButtonEnabled(true);
      return false;
    };

    setStateAddress(orderService.getAddress({
      street: addr.logradouro,
      number: number ? number : "",
      neighborhood: addr.bairro,
      city: addr.cidade.nome,
      state: addr.estado.sigla,
      complement: "",
    }));

    setStreet(addr.logradouro);
    setNeighborhood(addr.bairro);
    setCity(addr.cidade.nome);
    setState(addr.estado.sigla);

    setButtonEnabled(true);
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>

      <View style={styles.header}>
        <Feather
          style={styles.headerIcon}
          name="arrow-left"
          onPress={() => { navigation.goBack() }}
        />
        <Text style={styles.headerText}>ENDEREÇO DE ENTREGA</Text>
        <Text style={{ width: 50 }}></Text>
      </View>

      { loading && ( <Loader /> )}

      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
      >
        {/* Nome */}
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>
            * Nome
          </Text>
          <TextInput
            style={styles.textInput}
            autoFocus={true}
            maxLength={100}
            onChangeText={text => setName(text)}
            defaultValue={name}
          />
        </View>

        {/* CPF */}
        <View style={[styles.textInputContainer, {flexDirection: "row"}]}>
          <Text style={[styles.textInputLabel, {width: "45%", marginRight: 15}]}>
            * CPF
          </Text>
          <Text style={styles.textInputLabel}>
            * Telefone
          </Text>
        </View>

        {/* CPF */}
        <View style={{flexDirection: "row", marginHorizontal: 20}}>
          <TextInput
            style={[styles.textInput, { width: "45%", marginRight: 15 }]}
            keyboardType="numeric"
            maxLength={14}
            onChangeText={text => setDocument(masks.cpfMask(text))}
            defaultValue={document}
          />
          {/* Telefone */}
          <TextInput
            style={[styles.textInput, { width: "45%" }]}
            keyboardType="numeric"
            maxLength={15}
            onChangeText={text => setPhoneNumber(masks.phoneMask(text))}
            defaultValue={phoneNumber}
          />
        </View>

        {/* CEP e Numero */}
        <View style={[styles.textInputContainer, {flexDirection: "row"}]}>
          {/* CEP */}
          <Text style={[styles.textInputLabel, {width: "45%", marginRight: 15}]}>
            * Cep
          </Text>
          <Text style={styles.textInputLabel}>
            * Numero
          </Text>
        </View>

        {/* CEP e Numero */}
        <View style={{flexDirection: "row", marginHorizontal: 20}}>
          {/* CEP */}
          <TextInput
            ref={refPostalCodeInput}
            style={[styles.textInput, { width: "45%", marginRight: 15 }]}
            keyboardType="numeric"
            maxLength={9}
            onChangeText={text => setPostalCode(masks.cepMask(text))}
            onBlur={fillAddressByZipCode}
            defaultValue={postalCode}
          />

          {/* Numero */}
          <TextInput
            style={[styles.textInput, { width: "30%" }]}
            keyboardType="numeric"
            maxLength={15}
            onChangeText={text => setNumber(text)}
            defaultValue={number}
          />
        </View>

        {/* APRESENTA ENDEREÇO */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ color: "maroon", fontWeight: "bold" }}>
            {stateAddress}
          </Text>
        </View>

        {/* BOTÃO CONFIRMAR */}
        <TouchableOpacity
          style={[
            styles.confirmContainer,
            { backgroundColor: !!buttonEnabled ? "#ffcc00" : "silver" }
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.confirmText}>
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>

    </KeyboardAvoidingView>
  )
};

function Input({ label, setFunction, state }) {
  return (
    <View style={styles.textInputContainer}>
      <Text style={styles.textInputLabel}>
        {label}
      </Text>
      <TextInput
        style={styles.textInput}
        onChangeText={text => setFunction(text)}
        defaultValue={state}
      />
    </View>
  );
};

function Label({ label, state }) {
  return (
    <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 20 }}>
      <Text style={{ color: "#285395", fontWeight: "bold", fontSize: 18 }}>
        {label}:
      </Text>
      <Text style={{ color: "#000000", fontSize: 18 }}>
        {" " + state ? state : null}
      </Text>
    </View>
  );
};

const validateFields = (address) => {
  if (!address.name) {
    utils.fieldInvalidMessage("Campo Nome é obrigatório !!");
    return false;
  }
  if (!address.document) {
    utils.fieldInvalidMessage("Campo CPF é obrigatório !!");
    return false;
  }
  if (address.document.length !== 14) {
    utils.fieldInvalidMessage(`CPF ${address.document} invalido !!`);
    return false;
  }
  if (!address.phoneNumber) {
    utils.fieldInvalidMessage("Campo Telefone é obrigatório !!");
    return false;
  }
  if (address.phoneNumber.length < 14) {
    utils.fieldInvalidMessage("Telefone Invalido !!");
    return false;
  }
  if (!address.postalCode) {
    utils.fieldInvalidMessage("Campo CEP é obrigatório !!");
    return false;
  }
  if (address.postalCode.length < 9) {
    utils.fieldInvalidMessage("Cep Invalido !!");
    return false;
  }
  if (!address.number) {
    utils.fieldInvalidMessage("Campo Numero é obrigatório !!");
    return false;
  }

  return true;
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "black",
  },
  headerIcon: {
    width: 50,
    fontSize: 28,
    color: "white"
  },
  headerText: {
    fontSize: 16,
    color: "white",
    // color: "#777777",
    alignSelf: "center"
  },
  textInputContainer: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  textInputLabel: {
    color: "#285395",
    fontWeight: "bold",
  },
  textInput: {
    height: 30,
    // borderColor: 'gray',
    // borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "white",
    elevation: 5,
  },
  confirmContainer:
    defs.confirmButtonContainer(),
  confirmText:
    defs.confirmButtonText(),

});

export default Customer;