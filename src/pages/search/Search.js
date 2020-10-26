import React, { useState, useCallback } from 'react';
import {
  View, Text, KeyboardAvoidingView, Image, TouchableOpacity,
  ScrollView, TouchableWithoutFeedback, StyleSheet, TextInput
} from "react-native";
import { debounce } from "lodash";

import { Feather } from "@expo/vector-icons";

import logo from "../../../assets/logo-shopping-list.png";
import * as masks from "../../utils/masks";
import * as utils from "../../utils";
import * as defs from "../../configs/default";

import store from '../../store';
import { actionSelectProduct } from "../../store/actions";
import * as productService from '../../services/productService';

const Search = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handler =
    useCallback(
      debounce((text) => {
        setSearchText(text);
        getProductsByName(text);
      }, 1000),
      []
    );

  async function getProductsByName(text) {
    if (!text) {
      setProducts([]);;
    } else {
      const data = await productService.getActiveProductsPorNome(text);
      if (data) setProducts(data);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>

      {/* header back icon and title */}
      <View style={headerStyles.header}>
        <Feather
          style={headerStyles.headerIcon}
          name="arrow-left"
          onPress={() => { navigation.navigate('ShoppingList') }}
        />
        <Text style={headerStyles.headerText}>Escolha</Text>
        <Text style={{ width: 50 }}></Text>
      </View>

      {/* search */}
      <View style={searchStyles.searchContainer}>
        <View style={searchStyles.searchArea}>
          <TextInput
            style={searchStyles.textSearch}
            autoFocus={true}
            maxLength={20}
            onChangeText={text => {
              handler(text);
            }}
            defaultValue={searchText}
          />
          <TouchableOpacity
            style={ searchStyles.xContainer }
            onPress={() => {
              setSearchText("");
              getProductsByName("");
            }}
          >
            <Feather
              name="x"
              style={{ fontSize: 20 }}
            >
            </Feather>
          </TouchableOpacity>

        </View>
      </View>

      {/* product list */}
      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
      >
        {products.map((product) => {
          const img = product.Imagem1Vinho;
          return (
            <TouchableWithoutFeedback
              key={product.IdVinho}
              onPress={() => {
                const param = {
                  id: product.IdVinho,
                  description: product.DescricaoVinho,
                  quantity: 1,
                  price: product.PrecoVinho,
                  image: img,
                };
                store.dispatch(actionSelectProduct(param));
                navigation.navigate('SelectedItem');
              }}
            >
              <View style={{
                flexDirection: "row",
                marginBottom: 20,
                marginHorizontal: 20,
                backgroundColor: "white",
                elevation: 5,
              }}
              >
                <View
                  style={{
                    width: "30%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-end"
                  }}
                >
                  <Image
                    style={{
                      height: 80,
                      width: 80
                    }}
                    source={utils.getImage(product.Imagem1Vinho)}
                    resizeMode={"contain"}
                  />
                </View>
                <View
                  style={{
                    width: "70%",
                  }}
                >
                  <Text style={{ marginTop: 10, paddingRight: 0, fontSize: 16, color: "#555" }}>
                    {product.DescricaoVinho}
                  </Text>
                  <Text style={{ marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: "bold", color: "#555" }}>
                    {masks.moneyMask(product.PrecoVinho)}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )
        })}
      </ScrollView>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f2f9f9",
  },
});
const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  headerIcon: {
    width: 50,
    fontSize: 28,
    color: "#777777"
  },
  headerText: {
    fontSize: 16,
    color: "#777777",
    alignSelf: "center"
  },
});
const searchStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    height: 60,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    paddingVertical: 5,
    paddingLeft: 20,
    paddingRight: 5,
    borderRadius: 10,
  },
  textSearch: { 
    width: "83%", 
    fontSize: 16, 
    color: "grey",

  },
  xContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: "15%",
  }
});

export default Search;