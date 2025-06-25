import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView } from 'react-native';
import GPS from './GPS';
import AllSensors from './AllSensors'; 
import LightSensorComponent from './LightSensor'; 
import { Ionicons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

function MainTabContent() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <AllSensors /> 
        <LightSensorComponent /> 
        <GPS />
      </ScrollView>
    </View>
  );
}

function PlaceholderTab() {
  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Text style={styles.text}>Second Tab Content</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'bottom', 'left']}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Main') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Others') {
                iconName = focused ? 'settings' : 'settings-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4F8EF7',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
          })}
        >
          <Tab.Screen name="Main" component={MainTabContent} />
          <Tab.Screen name="Others" component={PlaceholderTab} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',   
    backgroundColor: '#fff',  
    paddingBottom: 50, 
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 60,
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});