import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView } from 'react-native';
import GPS from './GPS';
import AllSensors from './AllSensors'; 
import LightSensorComponent from './LightSensor'; 

export default function App() {
   return (
    <View style={{ flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <AllSensors /> 
        <LightSensorComponent /> 
        <GPS />

      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',   
    backgroundColor: '#fff',  
    paddingBottom: 50, 
    // paddingTop: 500, 
  },
  text: {
    fontSize: 20,
    color: '#333',
  }
});