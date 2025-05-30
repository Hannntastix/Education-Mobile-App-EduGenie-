import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { UserDetailContext } from "./../../context/UserDetailContext"
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';

export default function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 20,
        }}>
            <View>
                <Text style={{
                    fontFamily: "outfit-bold",
                    fontSize: 24,
                    color: Colors.PRIMARY,
                }}>Hello, {userDetail?.name || 'User'}</Text>
                <Text style={{
                    fontFamily: "outfit-bold",
                    fontSize: 25,
                    color: Colors.PRIMARY,
                }}>Welcome to EduGenie!</Text>
                <Text style={{
                    fontFamily: "outfit",
                    fontSize: 16,
                    color: Colors.GRAY,
                }}>Let's Make Great Journey!</Text>
            </View>
            {/* <TouchableOpacity style={{
                backgroundColor: Colors.LIGHT_GRAY,
                padding: 10,
                borderRadius: 12,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            }}>
                <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity> */}
        </View>
    )
}