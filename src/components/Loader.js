import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
 
const Loader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(()=>{ return () => { setVisible(false) } },[]);

  return (
    <AnimatedLoader
      visible={visible}
      overlayColor="rgba(255,255,255,0.75)"
      source={require("../configs/8675-loader.json")}
      animationStyle={styles.lottie}
      speed={1}
    />
  );
};
 
const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  }
});

export default Loader;
