import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView } from 'react-native';
import GPS from './GPS';
import AllSensors from './AllSensors'; // Add this import

export default function App() {
   return (
    <View style={{ flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <AllSensors /> 
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
    paddingBottom: 50, // Add this line for bottom padding
    // paddingTop: 500, // Add this line for bottom padding
  },
  
  text: {
    fontSize: 20,
    color: '#333',
  }
});