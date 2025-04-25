import { View, Text, Platform } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Colors from './../../constant/Colors'
import NoCourse from '../../components/Home/NoCourse'

export default function Home() {
    return (
        <View style={{
            paddingHorizontal: 25,
            paddingTop: Platform.OS === 'ios' ? 50 : 30,
            flex: 1,
            backgroundColor: Colors.WHITE,
        }}>
            <Header />
            <View style={{
                justifyContent: "center",
                flex: 1,
            }}>
                <NoCourse />
            </View>
        </View>
    )
}