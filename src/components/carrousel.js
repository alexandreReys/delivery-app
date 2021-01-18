import React, { Component } from 'react';
import { Image, View, Dimensions, StyleSheet } from 'react-native';

import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

import { scrollInterpolator, animatedStyles } from './animations';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);

const images = [
    'https://www.anrsistemas.com.br/dv/1.jpg',
    'https://www.anrsistemas.com.br/dv/2.jpg',
    'https://www.anrsistemas.com.br/dv/3.jpg',
];

const DATA = [];
for (let i = 0; i < 3; i++) {
    DATA.push(i)
}

export default class Carrousel extends Component {

    state = {
        index: 0
    }

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this)
    }
    
    _renderItem({ item }) {
        return (
            <View style={styles.itemContainer}>
                <Image
                    source={{ uri: images[item] }}
                    style={{ backgroundColor: "white", width: "100%", height: "100%" }}
                    resizeMode={"contain"}
                />
            </View>
        );
    };

    render() {
        return (
            <View>
                <Carousel
                    ref={(c) => this.carousel = c}
                    data={DATA}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    containerCustomStyle={styles.carouselContainer}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => this.setState({ index })}
                    scrollInterpolator={scrollInterpolator}
                    slideInterpolatedStyle={animatedStyles}
                    useScrollView={true}
                />
            </View>

        );
    };
};

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: 5,
        marginBottom: 5,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'dodgerblue',
    },
    itemLabel: {
        color: 'white',
        fontSize: 24
    },
});
