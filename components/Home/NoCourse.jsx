import { View, Text, Image } from 'react-native'
import React from 'react'
import Button from '../Shared/Button'
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router'

export default function NoCourse() {
    const router = useRouter();

    return (
        <View style={{
            marginTop: 40,
            alignItems: 'center',
            gap: 16,
        }}>
            <Image source={require('./../../assets/images/Courses.png')}
                style={{
                    height: 200,
                    width: 200,
                    borderRadius: 40,
                    resizeMode: 'contain'
                }}
            />
            <Text
                style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 22,
                    textAlign: 'center',
                    marginTop: 10,
                    color: Colors.DARK,
                }}
            >You don't have any course</Text>

            <Button text={'+ Create New Course'} onPress={() => router.push('/addCourse')}/>
            <Button text={'Explore Existing Courses'} type='outline' />
        </View>

    )
}