import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SimpleLoginScreen from './src/screens/SimpleLoginScreen';
import SimpleRegisterScreen from './src/screens/SimpleRegisterScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={SimpleLoginScreen} />
          <Stack.Screen name="Register" component={SimpleRegisterScreen} />
          <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen}
            options={{ headerShown: true, title: 'Детали продукта' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App; 