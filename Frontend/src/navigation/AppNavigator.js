import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import FarmsScreen from '../screens/FarmsScreen';
import FarmDetailScreen from '../screens/FarmDetailScreen';
import FarmProductsScreen from '../screens/FarmProductsScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ManageFarmProductsScreen from '../screens/ManageFarmProductsScreen';
import EditProductScreen from '../screens/EditProductScreen';
import MapScreen from '../screens/MapScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProductsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProductsList" 
      component={ProductsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen}
      options={{ 
        title: 'Детали товара',
        headerBackTitle: 'Назад'
      }}
    />
  </Stack.Navigator>
);

const FarmsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="FarmsList" 
      component={FarmsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="FarmDetail" 
      component={FarmDetailScreen}
      options={{ 
        title: 'Детали фермы',
        headerBackTitle: 'Назад'
      }}
    />
    <Stack.Screen 
      name="FarmProducts" 
      component={FarmProductsScreen}
      options={{ 
        title: 'Продукты фермы',
        headerBackTitle: 'Назад'
      }}
    />
  </Stack.Navigator>
);

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MapMain" 
      component={MapScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="FarmDetail" 
      component={FarmDetailScreen}
      options={{ 
        title: 'Детали фермы',
        headerBackTitle: 'Назад'
      }}
    />
    <Stack.Screen 
      name="FarmProducts" 
      component={FarmProductsScreen}
      options={{ 
        title: 'Продукты фермы',
        headerBackTitle: 'Назад'
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProfileMain" 
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="AddProduct" 
      component={AddProductScreen}
      options={{ 
        title: 'Добавить продукт',
        headerBackTitle: 'Назад'
      }}
    />
    <Stack.Screen 
      name="ManageFarmProducts" 
      component={ManageFarmProductsScreen}
      options={{ 
        title: 'Управление продуктами',
        headerBackTitle: 'Назад'
      }}
    />
    <Stack.Screen 
      name="EditProduct" 
      component={EditProductScreen}
      options={{ 
        title: 'Редактировать продукт',
        headerBackTitle: 'Назад'
      }}
    />
    <Stack.Screen 
      name="FarmDetail" 
      component={FarmDetailScreen}
      options={{ 
        title: 'Детали фермы',
        headerBackTitle: 'Назад'
      }}
    />
    <Stack.Screen 
      name="FarmProducts" 
      component={FarmProductsScreen}
      options={{ 
        title: 'Продукты фермы',
        headerBackTitle: 'Назад'
      }}
    />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Products') {
          iconName = focused ? '🍎' : '🍎';
        } else if (route.name === 'Farms') {
          iconName = focused ? '🏡' : '🏡';
        } else if (route.name === 'Map') {
          iconName = focused ? '🗺️' : '🗺️';
        } else if (route.name === 'Cart') {
          iconName = focused ? '🛒' : '🛒';
        } else if (route.name === 'Orders') {
          iconName = focused ? '📋' : '📋';
        } else if (route.name === 'Profile') {
          iconName = focused ? '👤' : '👤';
        }

        return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Products" 
      component={ProductsStack}
      options={{ title: 'Товары' }}
    />
    <Tab.Screen 
      name="Farms" 
      component={FarmsStack}
      options={{ title: 'Фермы' }}
    />
    <Tab.Screen 
      name="Map" 
      component={MapStack}
      options={{ title: 'Карта' }}
    />
    <Tab.Screen 
      name="Cart" 
      component={CartScreen}
      options={{ title: 'Корзина' }}
    />
    <Tab.Screen 
      name="Orders" 
      component={OrdersScreen}
      options={{ title: 'Заказы' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileStack}
      options={{ title: 'Профиль' }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Можно добавить splash screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator; 