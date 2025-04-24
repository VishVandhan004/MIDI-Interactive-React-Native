import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Intro from './components/Intro'; // new screen
import Piano from './components/Piano';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Piano" component={Piano} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
