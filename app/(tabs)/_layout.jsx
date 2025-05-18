import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false
        }}>
            <Tabs.Screen name='home'
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                    tabBarLabel: 'Home'
                }}
            />
            <Tabs.Screen name='explore'
                options={{
                    tabBarIcon: ({ color, size }) => <AntDesign name="pluscircleo" size={size} color={color} />,
                    tabBarLabel: 'Add'
                }}
            />
            <Tabs.Screen name='progress'
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
                    tabBarLabel: 'Progress'
                }}
            />
            <Tabs.Screen name='profile'
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                    tabBarLabel: 'Profile'
                }}
            />
        </Tabs>
    )
}